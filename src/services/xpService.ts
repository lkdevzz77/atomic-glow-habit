import { supabase } from '@/lib/supabase';
import { XP_REWARDS } from '@/systems/levelSystem';
import { startOfWeek, endOfWeek, format } from 'date-fns';

export interface XPAwardResult {
  totalXP: number;
  reasons: string[];
  newXP: number;
  oldLevel: number;
  newLevel: number;
  didLevelUp: boolean;
}

export const xpService = {
  /**
   * Concede XP por completar um hábito e verifica todos os bônus aplicáveis
   */
  async awardForHabitCompletion(
    userId: string,
    habitId: number,
    habitTitle: string
  ): Promise<XPAwardResult> {
    const today = new Date().toISOString().split('T')[0];
    
    console.log('🎯 [XP] Iniciando award para hábito', habitId, habitTitle);

    try {
      // Tentar buscar XP com retry (até 3 tentativas)
      let retries = 0;
      let xpData: any = null;
      let xpError: any = null;

      while (retries < 3 && !xpData) {
        console.log(`🔄 [XP] Tentativa ${retries + 1}/3 - Chamando RPC get_habit_completion_xp`);
        
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
          console.log(`✅ [XP] RPC sucesso na tentativa ${retries + 1}:`, data);
          break;
        }

        xpError = error;
        retries++;
        
        if (retries < 3) {
          const delay = 200 * retries; // 200ms, 400ms, 600ms
          console.log(`⏳ [XP] Aguardando ${delay}ms antes da próxima tentativa...`);
          await new Promise(r => setTimeout(r, delay));
        }
      }

      // Se falhou após 3 tentativas, usar fallback
      if (!xpData) {
        console.warn('⚠️ [XP] RPC falhou após 3 tentativas, usando fallback');
        xpData = [{ total_xp: XP_REWARDS.completeHabit, reasons: ['Hábito completado (fallback)'] }];
      }

      const totalXP = xpData[0]?.total_xp || XP_REWARDS.completeHabit;
      const reasons = xpData[0]?.reasons || ['Hábito completado'];

      // Buscar perfil atual
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const oldXP = profile?.xp || 0;
      const oldLevel = profile?.level || 1;
      const newXP = oldXP + totalXP;

      // Atualizar XP (o trigger atualizará o level automaticamente)
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ xp: newXP })
        .eq('id', userId)
        .select('level')
        .single();

      if (updateError) throw updateError;

      const newLevel = updatedProfile?.level || oldLevel;
      const didLevelUp = newLevel > oldLevel;

      console.log('✅ [XP] Award concluído:', { totalXP, newLevel, didLevelUp });

      return {
        totalXP,
        reasons,
        newXP,
        oldLevel,
        newLevel,
        didLevelUp,
      };
    } catch (error) {
      console.error('❌ [XP] ERRO CRÍTICO ao conceder XP:', error);
      throw error;
    }
  },
};
