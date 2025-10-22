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
  userHabits: (userId: string, status: 'active' | 'archived' | 'pending' | 'all', today: string) => ['habits', userId, status, today],
} as const;

export function useHabits(status?: 'active' | 'archived' | 'pending') {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ⚡ Calcular today no cliente para queryKey (força refresh diário)
  const today = new Date().toISOString().split('T')[0];

  // ⚡ FASE 5: Cache strategy agressiva
  const habits = useQuery({
    queryKey: QUERY_KEYS.userHabits(user?.id || '', status || 'all', today),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchInterval: false,
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
      
      // 🎯 Logging expandido para debug
      const queryTimestamp = Date.now();
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🗓️ [useHabits] Query #' + queryTimestamp);
      console.log('🌍 Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
      console.log('📅 Client thinks today is:', today);
      console.log('🔍 Querying for user_id:', user.id);
      console.log('📊 Total habits loaded:', filteredHabits.length);
      
      // ⚡ USAR RPC para buscar completions com data server-side (com fallback)
      let todayCompletions = null;
      
      try {
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_user_todays_completions', { p_user_id: user.id });
        
        if (rpcError) {
          console.warn('⚠️ [useHabits] RPC failed, using fallback query:', rpcError.message);
          
          // FALLBACK: usar query antiga se RPC falhar
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('habit_completions')
            .select('habit_id, date, completed_at, percentage')
            .eq('user_id', user.id)
            .eq('date', today)
            .gte('percentage', 100)
            .order('completed_at', { ascending: false });
          
          if (fallbackError) {
            console.error('❌ [useHabits] Fallback query also failed:', fallbackError);
            todayCompletions = [];
          } else {
            todayCompletions = fallbackData || [];
            console.log('✅ Using fallback query (client-side date)');
          }
        } else {
          todayCompletions = rpcData || [];
          console.log('✅ Using RPC (server-side date)');
        }
      } catch (error) {
        console.error('❌ [useHabits] Error fetching completions:', error);
        // Em caso de erro, retornar array vazio para não bloquear
        todayCompletions = [];
      }
      
      console.log('✅ Completions found (server-side date):', todayCompletions?.length || 0);
      console.log('📋 Details:', todayCompletions);
      
      const completedIds = new Set(todayCompletions?.map(c => c.habit_id) || []);
      console.log('🎯 Habits marked as completedToday:', Array.from(completedIds));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const habitsWithCompletionStatus = filteredHabits.map(habit => ({
        ...habit,
        completedToday: completedIds.has(habit.id)
      }));
      
      return habitsWithCompletionStatus;
    },
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
      // Invalidar todas as queries relacionadas (todas as variações de today)
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
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
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
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
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
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
      console.log('🎯 [useHabits] onMutate - Iniciando optimistic update para habit:', habitId);
      
      const currentToday = new Date().toISOString().split('T')[0];
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.userHabits(user?.id || '', status || 'all', currentToday) });
      
      // Snapshot previous value
      const previousHabits = queryClient.getQueryData(QUERY_KEYS.userHabits(user?.id || '', status || 'all', currentToday));
      
      // Optimistic update - marcar como completo e incrementar streak
      queryClient.setQueryData(
        QUERY_KEYS.userHabits(user?.id || '', status || 'all', currentToday),
        (old: any) => {
          if (!old) return old;
          return old.map((h: any) => 
            h.id === habitId 
              ? { ...h, completedToday: true, streak: (h.streak || 0) + 1 }
              : h
          );
        }
      );
      
      console.log('✅ [useHabits] Optimistic update aplicado');
      
      return { previousHabits };
    },
    onError: (error: Error, variables, context) => {
      const currentToday = new Date().toISOString().split('T')[0];
      // Rollback on error
      if (context?.previousHabits) {
        queryClient.setQueryData(QUERY_KEYS.userHabits(user?.id || '', status || 'all', currentToday), context.previousHabits);
      }
      toast({
        title: 'Erro ao completar hábito',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: async (xpResult, { habitId, habitTitle }) => {
      // 1. Toast
      if (xpResult?.levelUp) {
        toast({
          title: "🎊 LEVEL UP!",
          description: `Você alcançou o nível ${xpResult.newLevel}!`,
        });
      } else {
        toast({
          title: `${habitTitle} completado! 🎉`,
          description: `+${xpResult.newVoteCount} XP`,
        });
      }
      
      // ⚡ FASE 5: Invalidação agressiva
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await Promise.all([
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'habits'
        }),
        queryClient.invalidateQueries({ queryKey: ['stats'] }),
        queryClient.invalidateQueries({ queryKey: ['weekly-data'] }),
        queryClient.invalidateQueries({ queryKey: ['profile'] }),
      ]);
      
      // Forçar refetch
      const currentToday = new Date().toISOString().split('T')[0];
      await queryClient.refetchQueries({ 
        queryKey: QUERY_KEYS.userHabits(user?.id || '', status || 'all', currentToday),
        type: 'active'
      });
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