import { supabase } from '@/integrations/supabase/client';

export const isHabitCompletedToday = async (habitId: number, userId: string): Promise<boolean> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .eq('date', today)
    .gte('percentage', 100)
    .maybeSingle();
  
  return !!data;
};

export const getHabitsWithTodayStatus = async <T extends { id: number }>(
  habits: T[], 
  userId: string
): Promise<(T & { completedToday: boolean })[]> => {
  const today = new Date().toISOString().split('T')[0];
  
  // Buscar todas as completions de hoje de uma vez (eficiente)
  const { data: todayCompletions } = await supabase
    .from('habit_completions')
    .select('habit_id')
    .eq('user_id', userId)
    .eq('date', today)
    .gte('percentage', 100);
  
  const completedIds = new Set(todayCompletions?.map(c => c.habit_id) || []);
  
  return habits.map(habit => ({
    ...habit,
    completedToday: completedIds.has(habit.id)
  }));
};
