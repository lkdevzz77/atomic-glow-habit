import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { addDays, startOfDay, endOfDay, formatISO, startOfWeek } from 'date-fns';

interface DayStats {
  date: string;
  completed: number;
  total: number;
  percentage: number;
  day: string;
  isToday: boolean;
  habits: {
    id: string;
    completed: boolean;
    value: number;
  }[];
}

interface WeeklyStats {
  days: DayStats[];
  bestDay: {
    date: string;
    percentage: number;
  };
  worstDay: {
    date: string;
    percentage: number;
  };
  averageCompletion: number;
}

interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  habitStreaks: {
    habitId: number;
    habitTitle: string;
    currentStreak: number;
    longestStreak: number;
  }[];
}

const QUERY_KEYS = {
  weeklyStats: (userId: string) => ['stats', userId, 'weekly'],
  streakStats: (userId: string) => ['stats', userId, 'streaks'],
  habitCompletions: (userId: string, habitId: string) => ['stats', userId, 'habit', habitId],
} as const;

export function useStats() {
  const { user } = useAuth();

  const weeklyStats = useQuery<WeeklyStats>({
    queryKey: QUERY_KEYS.weeklyStats(user?.id || ''),
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const today = new Date();
      const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Segunda-feira

      // Gerar array com os 7 dias da semana
      const days = Array.from({ length: 7 }).map((_, i) => {
        const date = addDays(startOfCurrentWeek, i);
        return {
          start: formatISO(startOfDay(date)),
          end: formatISO(endOfDay(date)),
          date: formatISO(date, { representation: 'date' }),
          dayOfWeek: i,
        };
      });

      // Buscar todos os hábitos ativos
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (habitsError) throw habitsError;
      if (!habits) throw new Error('Failed to fetch habits');

      // Buscar completions da semana
      const { data: completions, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', days[0].date)
        .lte('date', days[6].date);

      if (completionsError) throw completionsError;

      // Processar dados por dia
      const dayStats: DayStats[] = days.map(({ date, dayOfWeek }) => {
        // Completions do dia com 100% de conclusão
        const dayCompletions = (completions || []).filter(
          c => c.date === date && c.percentage >= 100
        );

        // Remover duplicatas (mesmo habit completado múltiplas vezes no mesmo dia)
        const uniqueHabits = new Set(dayCompletions.map(c => c.habit_id));
        const completed = uniqueHabits.size;
        const total = habits.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Verificar se é hoje
        const isToday = formatISO(today, { representation: 'date' }) === date;

        // Nome do dia em português
        const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

        return {
          date,
          completed,
          total,
          percentage,
          habits: habits.map(habit => ({
            id: habit.id.toString(),
            completed: dayCompletions.some(c => c.habit_id === habit.id),
            value: dayCompletions.find(c => c.habit_id === habit.id)?.percentage || 0,
          })),
          day: dayNames[dayOfWeek],
          isToday,
        };
      });

      // Calcular melhor e pior dia
      const sortedDays = [...dayStats]
        .filter(d => d.total > 0) // Excluir dias sem hábitos
        .sort((a, b) => b.percentage - a.percentage);

      const bestDay = sortedDays[0] || dayStats[0];
      
      // Pior dia: excluir hoje e dias futuros
      const pastDays = dayStats.filter(d => {
        const dayDate = new Date(d.date);
        return dayDate < today && d.total > 0;
      });
      const worstDay = pastDays.length > 0
        ? pastDays.reduce((worst, day) => 
            day.percentage < worst.percentage ? day : worst
          )
        : bestDay;

      // Calcular média apenas de dias passados
      const completedPastDays = pastDays.filter(d => {
        const dayDate = new Date(d.date);
        return dayDate <= today;
      });
      
      const averageCompletion = completedPastDays.length > 0
        ? completedPastDays.reduce((acc, day) => acc + day.percentage, 0) / completedPastDays.length
        : 0;

      return {
        days: dayStats,
        bestDay: {
          date: bestDay.date,
          percentage: bestDay.percentage,
        },
        worstDay: {
          date: worstDay.date,
          percentage: worstDay.percentage,
        },
        averageCompletion,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  const streakStats = useQuery<StreakStats>({
    queryKey: QUERY_KEYS.streakStats(user?.id || ''),
    queryFn: async () => {
      if (!user) return null;

      const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (!habits) {
        throw new Error('Failed to fetch habits');
      }

      // Get all habit streaks
      const habitStreaks = habits.map(habit => ({
        habitId: habit.id,
        habitTitle: habit.title,
        currentStreak: habit.streak || 0,
        longestStreak: habit.longest_streak || 0,
      }));

      // Calculate longest streak across all habits
      const longestStreak = Math.max(
        ...habitStreaks.map(h => h.longestStreak),
        0
      );

      // Calculate current streak (active days in a row)
      const { data: recentCompletions } = await supabase
        .from('habit_completions')
        .select('date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      let currentStreak = 0;
      let lastDate = new Date();

      if (recentCompletions) {
        for (const completion of recentCompletions) {
          const completionDate = new Date(completion.date);
          const dayDiff = Math.floor(
            (lastDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (dayDiff <= 1) {
            currentStreak++;
            lastDate = completionDate;
          } else {
            break;
          }
        }
      }

      // Get total active days
      const { count } = await supabase
        .from('habit_completions')
        .select('date', { count: 'exact', head: true })
        .eq('user_id', user.id);

      return {
        currentStreak,
        longestStreak,
        totalDaysActive: count || 0,
        habitStreaks,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    weeklyStats: {
      data: weeklyStats.data,
      isLoading: weeklyStats.isLoading,
      isError: weeklyStats.isError,
      error: weeklyStats.error as Error | null,
    },
    streakStats: {
      data: streakStats.data,
      isLoading: streakStats.isLoading,
      isError: streakStats.isError,
      error: streakStats.error as Error | null,
    },
  };
}