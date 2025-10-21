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

    try {
      // Chamar função do banco que calcula XP
      const { data: xpData, error: xpError } = await supabase.rpc(
        'get_habit_completion_xp',
        {
          p_user_id: userId,
          p_habit_id: habitId,
          p_date: today,
        }
      );

      if (xpError) throw xpError;

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

      return {
        totalXP,
        reasons,
        newXP,
        oldLevel,
        newLevel,
        didLevelUp,
      };
    } catch (error) {
      console.error('❌ Erro ao conceder XP:', error);
      
      // Fallback: conceder XP base mesmo em caso de erro
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', userId)
        .single();

      const oldXP = profile?.xp || 0;
      const oldLevel = profile?.level || 1;
      const fallbackXP = XP_REWARDS.completeHabit;
      const newXP = oldXP + fallbackXP;

      await supabase
        .from('profiles')
        .update({ xp: newXP })
        .eq('id', userId);

      return {
        totalXP: fallbackXP,
        reasons: ['Hábito completado'],
        newXP,
        oldLevel,
        newLevel: oldLevel,
        didLevelUp: false,
      };
    }
  },
};
