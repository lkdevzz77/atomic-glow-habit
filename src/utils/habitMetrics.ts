import { Habit } from '@/types/habit';

/**
 * Calcula a taxa de sucesso real baseada nos dias ativos
 */
export const calculateCompletionRate = (habit: Habit): number => {
  const createdDate = new Date(habit.created_at);
  const today = new Date();
  const daysActive = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  if (!habit.total_completions || daysActive === 0) return 0;
  
  return Math.min(100, Math.round((habit.total_completions / daysActive) * 100));
};

/**
 * Calcula os dias ativos desde a criação do hábito
 */
export const getDaysActive = (createdAt: string): number => {
  const createdDate = new Date(createdAt);
  const today = new Date();
  return Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Retorna o nível de streak (para estilização)
 */
export const getStreakLevel = (streak: number): 'none' | 'low' | 'medium' | 'high' | 'epic' => {
  if (streak === 0) return 'none';
  if (streak < 7) return 'low';
  if (streak < 30) return 'medium';
  if (streak < 100) return 'high';
  return 'epic';
};

/**
 * Retorna o emoji apropriado para o streak
 */
export const getStreakEmoji = (streak: number): string => {
  const level = getStreakLevel(streak);
  
  switch (level) {
    case 'epic':
      return '🔥🔥🔥';
    case 'high':
      return '🔥🔥';
    case 'medium':
      return '🔥';
    case 'low':
      return '✨';
    default:
      return '';
  }
};

/**
 * Calcula XP estimado para completar um hábito
 */
export const calculateEstimatedXP = (habit: Habit): number => {
  const baseXP = 15;
  let multiplier = 1;
  
  // Multiplier por streak
  if (habit.streak >= 90) multiplier *= 1.5;
  else if (habit.streak >= 30) multiplier *= 1.25;
  else if (habit.streak >= 7) multiplier *= 1.1;
  
  // Multiplier por dificuldade (goal_target)
  if (habit.goal_target >= 30) multiplier *= 1.5;
  else if (habit.goal_target >= 15) multiplier *= 1.2;
  
  return Math.floor(baseXP * multiplier);
};

/**
 * Formata o tempo para exibição
 */
export const formatTime = (time: string): string => {
  // Se já estiver formatado, retorna
  if (time.includes('h') || time.includes(':')) return time;
  
  // Tenta parsear
  try {
    const date = new Date(`2000-01-01T${time}`);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return time;
  }
};
