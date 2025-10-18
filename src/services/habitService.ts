import { supabase } from '@/lib/supabase';

type HabitStatus = 'pending' | 'active' | 'completed';

// Interface base para dados do hábito
interface HabitData {
  title: string;
  icon: string;
  when_time: string;
  where_location: string;
  trigger_activity?: string | null;
  temptation_bundle?: string | null;
  environment_prep?: string | null;
  social_reinforcement?: string | null;
  goal_current: number;
  goal_target: number;
  goal_unit: string;
}

// Interface completa que representa o registro no banco
interface HabitRecord extends Omit<HabitData, 'status'> {
  id: number;
  user_id: string;
  streak: number;
  longest_streak: number;
  total_completions: number;
  status: HabitStatus;
  created_at: string;
  updated_at: string;
  last_completed?: string | null;
}

// Interface para conclusões de hábitos
interface HabitCompletion {
  id: number;
  habit_id: number;
  user_id: string;
  date: string;
  percentage: number;
  completed_at: string;
}

// Validações
const isValidHabitData = (data: any): data is HabitData => {
  return (
    typeof data.title === 'string' && data.title.trim() !== '' &&
    typeof data.icon === 'string' && data.icon.trim() !== '' &&
    typeof data.when_time === 'string' &&
    typeof data.where_location === 'string' && data.where_location.trim() !== '' &&
    typeof data.goal_current === 'number' && data.goal_current >= 0 &&
    typeof data.goal_target === 'number' && data.goal_target > 0 &&
    typeof data.goal_unit === 'string' && data.goal_unit.trim() !== ''
  );
};

export const habitService = {
  async getHabits(userId: string): Promise<{ data: HabitRecord[] | null; error: any }> {
    try {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data as HabitRecord[], error: null };
    } catch (error) {
      console.error('Error fetching habits:', error);
      return { data: null, error };
    }
  },

  async getHabit(id: number): Promise<{ data: HabitRecord | null; error: any }> {
    try {
      if (!id) throw new Error('Habit ID is required');

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data: data as HabitRecord, error: null };
    } catch (error) {
      console.error('Error fetching habit:', error);
      return { data: null, error };
    }
  },

  async createHabit(userId: string, data: HabitData): Promise<{ data: HabitRecord | null; error: any }> {
    try {
      if (!userId) throw new Error('User ID is required');
      if (!isValidHabitData(data)) throw new Error('Invalid habit data');

      const habitData = {
        user_id: userId,
        ...data,
        streak: 0,
        longest_streak: 0,
        total_completions: 0,
        status: 'pending' as HabitStatus
      };

      const { data: habit, error } = await supabase
        .from('habits')
        .insert(habitData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar hábito:', error);
        throw error;
      }

      console.log('Hábito criado com sucesso:', habit);
      return { data: habit, error: null };
    } catch (error) {
      console.error('Erro capturado em createHabit:', error);
      return { data: null, error };
    }
  },

  async updateHabit(id: number, data: Partial<HabitData>): Promise<{ data: HabitRecord | null; error: any }> {
    try {
      if (!id) throw new Error('Habit ID is required');

      const { data: habit, error } = await supabase
        .from('habits')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: habit as HabitRecord, error: null };
    } catch (error) {
      console.error('Error updating habit:', error);
      return { data: null, error };
    }
  },

  async deleteHabit(id: number): Promise<{ error: any }> {
    try {
      if (!id) throw new Error('Habit ID is required');

      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting habit:', error);
      return { error };
    }
  },

  async completeHabit(habitId: number, userId: string, date: string, percentage: number): Promise<{ error: any }> {
    try {
      if (!habitId) throw new Error('Habit ID is required');
      if (!userId) throw new Error('User ID is required');
      if (!date) throw new Error('Date is required');
      if (percentage < 0 || percentage > 100) throw new Error('Percentage must be between 0 and 100');

      // 1. Registrar completion
      const { error: completionError } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: habitId,
          user_id: userId,
          date,
          percentage,
          completed_at: new Date().toISOString()
        });

      if (completionError) throw completionError;

      // 2. Atualizar streak
      await this.updateStreak(habitId);

      return { error: null };
    } catch (error) {
      console.error('Error completing habit:', error);
      return { error };
    }
  },

  async getCompletions(habitId: number, startDate: string, endDate: string): Promise<{ data: HabitCompletion[] | null; error: any }> {
    try {
      if (!habitId) throw new Error('Habit ID is required');
      if (!startDate || !endDate) throw new Error('Date range is required');

      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habitId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) throw error;
      return { data: data as HabitCompletion[], error: null };
    } catch (error) {
      console.error('Error fetching completions:', error);
      return { data: null, error };
    }
  },

  async updateStreak(habitId: number): Promise<{ error: any }> {
    try {
      if (!habitId) throw new Error('Habit ID is required');

      // 1. Buscar hábito
      const { data: habit } = await this.getHabit(habitId);
      if (!habit) throw new Error('Habit not found');

      // 2. Buscar completions recentes (últimos 30 dias)
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habitId)
        .gte('date', thirtyDaysAgo)
        .lte('date', today)
        .order('date', { ascending: true });

      if (!completions) return { error: new Error('Failed to fetch completions') };

      // 3. Calcular streak atual
      let currentStreak = 0;
      const sortedCompletions = [...completions].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      for (const completion of sortedCompletions) {
        if (completion.percentage >= 100) {
          currentStreak++;
        } else {
          break;
        }
      }

      // 4. Atualizar hábito
      const longestStreak = Math.max(currentStreak, habit.longest_streak || 0);
      const { error } = await supabase
        .from('habits')
        .update({
          streak: currentStreak,
          longest_streak: longestStreak,
          last_completed: today,
          status: currentStreak > 0 ? 'active' as HabitStatus : 'pending' as HabitStatus
        })
        .eq('id', habitId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error updating streak:', error);
      return { error };
    }
  }
};