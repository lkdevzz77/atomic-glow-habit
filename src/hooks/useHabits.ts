import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { habitService } from '@/services/habitService';
import { xpService } from '@/services/xpService';
import { toast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Habit } from '@/types/habit';

const QUERY_KEYS = {
  habits: 'habits',
  habit: (id: string) => ['habits', id],
  userHabits: (userId: string, status: 'active' | 'archived' | 'pending' | 'all') => ['habits', userId, status],
} as const;

export function useHabits(status?: 'active' | 'archived' | 'pending') {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const habits = useQuery({
    queryKey: QUERY_KEYS.userHabits(user?.id || '', status || 'all'),
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await habitService.getHabits(user.id);
      if (error) throw error;
      
      // Filtrar por status GERAL (active/archived/paused)
      let filteredHabits = data || [];
      if (status) {
        filteredHabits = filteredHabits.filter(h => h.status === status);
      } else {
        // Se não especificar, mostrar apenas ativos
        filteredHabits = filteredHabits.filter(h => h.status === 'active');
      }
      
      // Adicionar flag de "completado hoje" dinamicamente
      const today = new Date().toISOString().split('T')[0];
      const { data: todayCompletions } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('date', today)
        .gte('percentage', 100);
      
      const completedIds = new Set(todayCompletions?.map(c => c.habit_id) || []);
      
      return filteredHabits.map(habit => ({
        ...habit,
        completedToday: completedIds.has(habit.id)
      }));
    },
    enabled: !!user,
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  });

  const createHabitMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      icon?: string;
      when_time: string;
      where_location: string;
      trigger_activity?: string | null;
      temptation_bundle?: string | null;
      environment_prep?: string | null;
      social_reinforcement?: string | null;
      goal_target: number;
      goal_unit?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      const result = await habitService.createHabit(data);
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userHabits(user?.id || '', status) });
      queryClient.invalidateQueries({ queryKey: ['stats', user?.id, 'weekly'] });
      queryClient.invalidateQueries({ queryKey: ['stats', user?.id, 'streaks'] });
      
      toast({
        title: '✅ Hábito criado!',
        description: 'Seu novo hábito foi criado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar hábito',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Habit> }) => {
      const result = await habitService.updateHabit(id, data);
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userHabits(user?.id || '', status) });
      toast({
        title: 'Hábito atualizado!',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar hábito',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: async (id: number) => {
      const result = await habitService.deleteHabit(id);
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userHabits(user?.id || '', status) });
      toast({
        title: 'Hábito deletado',
        description: 'O hábito foi removido com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao deletar hábito',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const completeHabitMutation = useMutation({
    mutationFn: async ({ habitId, percentage, habitTitle }: { habitId: number; percentage: number; habitTitle: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const today = new Date().toISOString().split('T')[0];
      
      // 1. Completar hábito
      const result = await habitService.completeHabit(
        habitId,
        user.id,
        today,
        percentage
      );
      
      if (result.error) throw result.error;

      // 2. Conceder XP automaticamente
      const xpResult = await xpService.awardForHabitCompletion(
        user.id,
        habitId,
        habitTitle
      );

      return xpResult;
    },
    onMutate: async ({ habitId }) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.userHabits(user?.id || '', status || 'all') });
      
      // Snapshot previous value
      const previousHabits = queryClient.getQueryData(QUERY_KEYS.userHabits(user?.id || '', status || 'all'));
      
      // Optimistically update
      queryClient.setQueryData(QUERY_KEYS.userHabits(user?.id || '', status || 'all'), (old: any) => 
        old?.map((h: any) => h.id === habitId ? { ...h, completedToday: true } : h)
      );
      
      return { previousHabits };
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previousHabits) {
        queryClient.setQueryData(QUERY_KEYS.userHabits(user?.id || '', status || 'all'), context.previousHabits);
      }
      toast({
        title: 'Erro ao completar hábito',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: async (xpResult, { habitId, percentage }) => {
      // Toast ANTES de invalidar
      if (xpResult?.didLevelUp) {
        toast({
          title: `🎊 LEVEL UP! Nível ${xpResult.newLevel}`,
          description: `+${xpResult.totalXP} XP: ${xpResult.reasons.join(' • ')}`,
        });
      } else {
        toast({
          title: `🎉 +${xpResult?.totalXP || 50} XP`,
          description: xpResult?.reasons.join(' • ') || 'Hábito completado!',
        });
      }
      
      // AGUARDAR um pouco para garantir que DB finalizou
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // DEPOIS invalidar queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userHabits(user?.id || '', status || 'all') });
      queryClient.invalidateQueries({ queryKey: ['stats', user?.id, 'weekly'] });
      queryClient.invalidateQueries({ queryKey: ['stats', user?.id, 'streaks'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-data'] });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  return {
    // Query Results
    data: habits.data,
    isLoading: habits.isLoading,
    isError: habits.isError,
    error: habits.error as Error | null,
    refetch: habits.refetch,

    // Mutations
    createHabit: async (data: Parameters<typeof createHabitMutation.mutate>[0]) => {
      try {
        return await createHabitMutation.mutateAsync(data);
      } catch (error) {
        console.error('Error creating habit:', error);
        throw error;
      }
    },
    updateHabit: updateHabitMutation.mutate,
    deleteHabit: deleteHabitMutation.mutate,
    completeHabit: completeHabitMutation.mutate,

    // Mutation States
    isCreating: createHabitMutation.isPending,
    isUpdating: updateHabitMutation.isPending,
    isDeleting: deleteHabitMutation.isPending,
    isCompleting: completeHabitMutation.isPending,
  };
}