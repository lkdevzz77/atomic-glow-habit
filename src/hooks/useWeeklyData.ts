import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useHabits } from '@/hooks/useHabits';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface DayData {
  day: string;
  date: string;
  completed: number;
  total: number;
  percentage: number;
  isToday: boolean;
  completions: any[];
}

export interface WeeklyData {
  days: DayData[];
  completions: any[];
}

export const useWeeklyData = () => {
  const { user } = useAuth();
  const { data: habits } = useHabits();

  return useQuery<WeeklyData>({
    queryKey: ['weekly-data', user?.id],
    queryFn: async () => {
      if (!user || !habits) {
        return { days: [], completions: [] };
      }

      const today = new Date();
      const weekStart = startOfWeek(today, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 0 });

      // Fetch completions for the week
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(weekEnd, 'yyyy-MM-dd'));

      // Process data for each day
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
        .map(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const dayCompletions = completions?.filter(c => c.date === dateStr) || [];
          const completed = dayCompletions.filter(c => c.percentage >= 100).length;

          return {
            day: format(date, 'EEE', { locale: ptBR }),
            date: dateStr,
            completed,
            total: habits?.length || 0,
            percentage: habits?.length ? Math.round((completed / habits.length) * 100) : 0,
            isToday: isSameDay(date, today),
            completions: dayCompletions
          };
        });

      return { days, completions: completions || [] };
    },
    enabled: !!user && !!habits,
    staleTime: 1000 * 30, // 30 seconds
  });
};
