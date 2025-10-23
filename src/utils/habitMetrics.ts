/**
 * Habit Metrics Utilities
 * Funções para cálculo de métricas e estatísticas de hábitos
 */

/**
 * Calcula a taxa de conclusão baseada em dias desde criação
 */
export const calculateCompletionRate = (habit: {
  total_completions?: number;
  created_at: string;
}): number => {
  if (!habit.total_completions) return 0;
  
  const daysActive = getDaysActive(habit.created_at);
  if (daysActive === 0) return 0;
  
  const rate = (habit.total_completions / daysActive) * 100;
  return Math.min(Math.round(rate), 100); // Cap at 100%
};

/**
 * Calcula o número de dias desde a criação do hábito
 */
export const getDaysActive = (createdAt: string): number => {
  const created = new Date(createdAt);
  const today = new Date();
  const diffTime = today.getTime() - created.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o dia de criação
  return Math.max(diffDays, 1); // Mínimo de 1 dia
};

/**
 * Retorna o nível do streak (para badges e highlights)
 */
export const getStreakLevel = (streak: number): 'none' | 'fire' | 'star' | 'diamond' => {
  if (streak >= 100) return 'diamond';
  if (streak >= 30) return 'star';
  if (streak >= 7) return 'fire';
  return 'none';
};

/**
 * Retorna o emoji correspondente ao streak
 */
export const getStreakEmoji = (streak: number): string => {
  if (streak >= 100) return '💎';
  if (streak >= 30) return '🌟';
  if (streak >= 7) return '🔥';
  return '📊';
};

/**
 * Estima o XP total que pode ser ganho com o hábito
 */
export const estimateXP = (habit: {
  streak?: number;
  total_completions?: number;
}): number => {
  const baseXP = (habit.total_completions || 0) * 10; // 10 XP por conclusão
  const streakBonus = (habit.streak || 0) * 5; // 5 XP bonus por dia de streak
  return baseXP + streakBonus;
};

/**
 * Formata horário para exibição
 */
export const formatTime = (time: string): string => {
  // Se já está no formato "HH:MM", retorna como está
  if (/^\d{2}:\d{2}$/.test(time)) {
    return time;
  }
  
  // Caso contrário, retorna o texto original
  return time;
};

/**
 * Verifica se o hábito é novo (criado há menos de 3 dias)
 */
export const isNewHabit = (createdAt: string): boolean => {
  return getDaysActive(createdAt) <= 3;
};

/**
 * Verifica se o hábito está em risco (não completado há 2+ dias)
 */
export const isAtRisk = (lastCompleted: string | null, streak: number): boolean => {
  if (!lastCompleted || streak === 0) return false;
  
  const lastDate = new Date(lastCompleted);
  const today = new Date();
  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 2;
};
