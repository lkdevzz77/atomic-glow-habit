import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { addDays, startOfDay, endOfDay, formatISO } from 'date-fns';

type HabitCompletion = Database['public']['Tables']['habit_completions']['Row'];
type Habit = Database['public']['Tables']['habits']['Row'];

interface DayStats {
  date: string;
  completed: number;
  total: number;
  percentage: number;
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
    habitId: string;
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
      if (!user) return null;

      // Get last 7 days
      const days = Array.from({ length: 7 }).map((_, i) => {
        const date = addDays(new Date(), -i);
        return {
          start: formatISO(startOfDay(date)),
          end: formatISO(endOfDay(date)),
          date: formatISO(date, { representation: 'date' }),
        };
      });

      // Get all active habits
      const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (!habits) {
        throw new Error('Failed to fetch habits');
      }

      // Get completions for last 7 days
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', days[6].start)
        .lte('date', days[0].end);

      // Calculate stats for each day
      const dayStats = days.map(({ date }) => {
        const dayCompletions = (completions || []).filter(c => 
          c.date.startsWith(date)
        );

        const habitStats = habits.map(habit => ({
          id: habit.id.toString(),
          completed: dayCompletions.some(c => c.habit_id === habit.id),
          value: dayCompletions.find(c => c.habit_id === habit.id)?.percentage || 0,
        }));

        const completed = habitStats.filter(h => h.completed).length;
        const total = habits.length;

        return {
          date,
          completed,
          total,
          percentage: total > 0 ? (completed / total) * 100 : 0,
          habits: habitStats,
        };
      });

      // Calculate best and worst days
      const sortedDays = [...dayStats].sort((a, b) => b.percentage - a.percentage);
      const bestDay = {
        date: sortedDays[0].date,
        percentage: sortedDays[0].percentage,
      };
      const worstDay = {
        date: sortedDays[sortedDays.length - 1].date,
        percentage: sortedDays[sortedDays.length - 1].percentage,
      };

      // Calculate average
      const averageCompletion = dayStats.reduce(
        (acc, day) => acc + day.percentage,
        0
      ) / dayStats.length;

      return {
        days: dayStats,
        bestDay,
        worstDay,
        averageCompletion,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
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