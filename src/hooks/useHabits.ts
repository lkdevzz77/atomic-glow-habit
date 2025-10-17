import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { habitService } from '@/services/habitService';
import type { Database } from '@/lib/supabase';

type Habit = Database['public']['Tables']['habits']['Row'];

export function useHabits(status: 'active' | 'archived' = 'active') {
  const { user } = useAuthContext();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar hábitos
  const fetchHabits = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const { data, error: habitError } = await habitService.getHabits(user.id);
      
      if (habitError) throw habitError;
      
      // Filtrar por status
      const filteredHabits = data?.filter(habit => habit.status === status) || [];
      setHabits(filteredHabits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  };

  // Buscar hábitos ao montar componente ou mudar status/user
  useEffect(() => {
    fetchHabits();
  }, [user, status]);

  // Criar novo hábito
  const createHabit = async (data: Omit<Habit, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'streak' | 'longest_streak' | 'status'>) => {
    if (!user) return { error: new Error('User not authenticated') };

    try {
      setError(null);
      const { data: newHabit, error: habitError } = await habitService.createHabit(user.id, data);
      
      if (habitError) throw habitError;
      
      // Atualizar estado local
      if (newHabit && newHabit.status === status) {
        setHabits(prev => [newHabit, ...prev]);
      }

      return { data: newHabit, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create habit';
      setError(error);
      return { data: null, error };
    }
  };

  // Atualizar hábito
  const updateHabit = async (id: string, data: Partial<Habit>) => {
    try {
      setError(null);
      const { data: updatedHabit, error: habitError } = await habitService.updateHabit(id, data);
      
      if (habitError) throw habitError;
      
      // Atualizar estado local
      setHabits(prev => prev.map(habit => 
        habit.id === id ? { ...habit, ...updatedHabit } : habit
      ));

      return { data: updatedHabit, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update habit';
      setError(error);
      return { data: null, error };
    }
  };

  // Deletar hábito
  const deleteHabit = async (id: string) => {
    try {
      setError(null);
      const { error: habitError } = await habitService.deleteHabit(id);
      
      if (habitError) throw habitError;
      
      // Atualizar estado local
      setHabits(prev => prev.filter(habit => habit.id !== id));

      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete habit';
      setError(error);
      return { error };
    }
  };

  // Completar hábito
  const completeHabit = async (habitId: string, percentage: number) => {
    if (!user) return { error: new Error('User not authenticated') };

    try {
      setError(null);
      const today = new Date().toISOString().split('T')[0];
      
      const { error: completionError } = await habitService.completeHabit(
        habitId,
        user.id,
        today,
        percentage
      );
      
      if (completionError) throw completionError;

      // Atualizar UI otimisticamente
      setHabits(prev => prev.map(habit =>
        habit.id === habitId
          ? {
              ...habit,
              last_completion: today,
              streak: (habit.streak || 0) + (percentage >= 100 ? 1 : 0),
              longest_streak: Math.max(
                (habit.longest_streak || 0),
                (habit.streak || 0) + (percentage >= 100 ? 1 : 0)
              )
            }
          : habit
      ));

      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to complete habit';
      setError(error);
      return { error };
    }
  };

  return {
    habits,
    loading,
    error,
    refetch: fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit
  };
}