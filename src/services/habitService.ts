import { supabase } from '@/lib/supabase';

interface HabitData {
  title: string;
  description?: string;
  icon?: string;
  frequency?: 'daily' | 'weekly';
  target_value?: number;
  reminder_time?: string;
  location?: string;
  trigger?: string;
  start_date: string;
}

export const habitService = {
  async getHabits(userId: string) {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getHabit(id: string) {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createHabit(userId: string, data: HabitData) {
    try {
      const { data: habit, error } = await supabase
        .from('habits')
        .insert({
          user_id: userId,
          ...data,
          status: 'active',
          streak: 0,
          longest_streak: 0
        })
        .select()
        .single();

      if (error) throw error;
      return { data: habit, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateHabit(id: string, data: Partial<HabitData>) {
    try {
      const { data: habit, error } = await supabase
        .from('habits')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: habit, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteHabit(id: string) {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async completeHabit(habitId: string, userId: string, date: string, percentage: number) {
    try {
      // 1. Registrar completion
      const { error: completionError } = await supabase
        .from('completions')
        .insert({
          habit_id: habitId,
          user_id: userId,
          date,
          percentage
        });

      if (completionError) throw completionError;

      // 2. Atualizar streak
      await this.updateStreak(habitId);

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async getCompletions(habitId: string, startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from('completions')
        .select('*')
        .eq('habit_id', habitId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateStreak(habitId: string) {
    try {
      // 1. Buscar hábito
      const { data: habit } = await this.getHabit(habitId);
      if (!habit) throw new Error('Habit not found');

      // 2. Buscar completions recentes
      const today = new Date().toISOString().split('T')[0];
      const { data: completions } = await this.getCompletions(
        habitId,
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        today
      );

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
          last_completion: today
        })
        .eq('id', habitId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};