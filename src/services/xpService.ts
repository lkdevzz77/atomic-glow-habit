import { supabase } from '@/lib/supabase';
import { XP_REWARDS } from '@/systems/levelSystem';
import { startOfWeek, endOfWeek, format } from 'date-fns';

export interface IdentityVoteResult {
  totalVotes: number;
  reasons: string[];
  newVotes: number;
  oldLevel: number;
  newLevel: number;
  didLevelUp: boolean;
  identityGoal?: string;
}

export const identityVotesService = {
  /**
   * Registra votos de identidade por completar um hábito
   * Cada ação é um voto para quem você quer se tornar
   */
  async awardForHabitCompletion(
    userId: string,
    habitId: number,
    habitTitle: string
  ): Promise<IdentityVoteResult> {
    const today = new Date().toISOString().split('T')[0];
    
    console.log('🗳️ [Identity Votes] Registrando voto de identidade', habitId, habitTitle);

    try {
      // Tentar buscar XP com retry (até 3 tentativas)
      let retries = 0;
      let xpData: any = null;
      let xpError: any = null;

      while (retries < 3 && !xpData) {
        console.log(`🔄 [Identity Votes] Tentativa ${retries + 1}/3 - Calculando votos`);
        
        const { data, error } = await supabase.rpc(
          'get_habit_completion_xp',
          {
            p_user_id: userId,
            p_habit_id: habitId,
            p_date: today,
          }
        );

        if (!error && data?.[0]?.total_xp) {
          xpData = data;
          console.log(`✅ [Identity Votes] RPC sucesso na tentativa ${retries + 1}:`, data);
          break;
        }

        xpError = error;
        retries++;
        
        if (retries < 3) {
          const delay = 200 * retries;
          console.log(`⏳ [Identity Votes] Aguardando ${delay}ms antes da próxima tentativa...`);
          await new Promise(r => setTimeout(r, delay));
        }
      }

      // Buscar identity_goal do hábito
      const { data: habitData } = await supabase
        .from('habits')
        .select('identity_goal')
        .eq('id', habitId)
        .single();

      const identityGoal = habitData?.identity_goal || 'pessoa disciplinada e consistente';

      // Se falhou após 3 tentativas, usar fallback
      if (!xpData) {
        console.warn('⚠️ [Identity Votes] RPC falhou após 3 tentativas, usando fallback');
        xpData = [{ total_xp: XP_REWARDS.completeHabit, reasons: ['Voto de identidade registrado'] }];
      }

      const totalVotes = xpData[0]?.total_xp || XP_REWARDS.completeHabit;
      const reasons = xpData[0]?.reasons || ['Voto de identidade registrado'];

      // Buscar perfil atual
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const oldXP = profile?.xp || 0;
      const oldLevel = profile?.level || 1;
      const newXP = oldXP + totalVotes;

      // Atualizar votos de identidade
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ xp: newXP })
        .eq('id', userId)
        .select('level')
        .single();

      if (updateError) throw updateError;

      const newLevel = updatedProfile?.level || oldLevel;
      const didLevelUp = newLevel > oldLevel;

      console.log('✅ [Identity Votes] Voto registrado:', { totalVotes, newLevel, didLevelUp, identityGoal });

      return {
        totalVotes,
        reasons,
        newVotes: newXP,
        oldLevel,
        newLevel,
        didLevelUp,
        identityGoal,
      };
    } catch (error) {
      console.error('❌ [Identity Votes] ERRO ao registrar voto:', error);
      throw error;
    }
  },
};

// Backward compatibility
export const xpService = identityVotesService;
