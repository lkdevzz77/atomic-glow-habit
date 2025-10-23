import { supabase } from '@/integrations/supabase/client';

/**
 * Busca a recompensa de XP de uma badge específica
 */
export async function getBadgeXPReward(badgeId: string): Promise<number> {
  const { data, error } = await supabase
    .from('badges')
    .select('xp_reward')
    .eq('id', badgeId)
    .single();

  if (error) {
    console.error('Erro ao buscar XP reward da badge:', error);
    return 50; // Fallback
  }

  return data.xp_reward || 50;
}

/**
 * Concede XP ao usuário por desbloquear uma badge
 */
export async function awardBadgeXP(userId: string, badgeId: string): Promise<boolean> {
  try {
    const xpReward = await getBadgeXPReward(badgeId);
    
    const { error } = await supabase.rpc('award_xp', {
      p_user_id: userId,
      p_xp_amount: xpReward,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao conceder XP da badge:', error);
    return false;
  }
}
