import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { subDays, subMonths, subYears, format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, startOfMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PeriodType } from '@/components/stats/PeriodFilter';

export interface PeriodDataPoint {
  label: string;
  completed: number;
  total: number;
  percentage: number;
  date: string;
  isToday?: boolean;
}

export interface PeriodStats {
  data: PeriodDataPoint[];
  totalCompleted: number;
  totalPossible: number;
  averagePercentage: number;
  bestPeriod: PeriodDataPoint;
  worstPeriod: PeriodDataPoint;
}

export const usePeriodStats = (period: PeriodType) => {
  const { user } = useAuth();

  return useQuery<PeriodStats>({
    queryKey: ['period-stats', user?.id, period],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const today = new Date();
      let startDate: Date;
      let intervals: Date[];
      let formatLabel: (date: Date) => string;

      // Calcular range baseado no período
      switch (period) {
        case '7d':
          startDate = subDays(today, 6);
          intervals = eachDayOfInterval({ start: startDate, end: today });
          formatLabel = (d) => format(d, 'dd/MM', { locale: ptBR });
          break;
        case '14d':
          startDate = subDays(today, 13);
          intervals = eachDayOfInterval({ start: startDate, end: today });
          formatLabel = (d) => format(d, 'dd/MM', { locale: ptBR });
          break;
        case '1m':
          startDate = subMonths(today, 1);
          intervals = eachDayOfInterval({ start: startDate, end: today });
          formatLabel = (d) => format(d, 'dd/MM', { locale: ptBR });
          break;
        case '3m':
          startDate = subMonths(today, 3);
          intervals = eachWeekOfInterval({ start: startDate, end: today });
          formatLabel = (d) => format(startOfWeek(d, { weekStartsOn: 0 }), 'dd/MM', { locale: ptBR });
          break;
        case '6m':
          startDate = subMonths(today, 6);
          intervals = eachWeekOfInterval({ start: startDate, end: today });
          formatLabel = (d) => format(startOfWeek(d, { weekStartsOn: 0 }), 'dd/MM', { locale: ptBR });
          break;
        case '1y':
          startDate = subYears(today, 1);
          intervals = eachMonthOfInterval({ start: startDate, end: today });
          formatLabel = (d) => format(startOfMonth(d), 'MMM/yy', { locale: ptBR });
          break;
        default:
          startDate = subDays(today, 6);
          intervals = eachDayOfInterval({ start: startDate, end: today });
          formatLabel = (d) => format(d, 'dd/MM', { locale: ptBR });
      }

      // Buscar hábitos ativos
      const { data: habits } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (!habits) throw new Error('Failed to fetch habits');

      // Buscar completions do período
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(today, 'yyyy-MM-dd'));

      // Processar dados
      const processedData: PeriodDataPoint[] = intervals.map((date) => {
        let periodCompletions: typeof completions = [];

        // Para períodos agregados (semanas/meses), somar completions do intervalo
        if (period === '3m' || period === '6m') {
          const weekStart = startOfWeek(date, { weekStartsOn: 0 });
          const weekEnd = subDays(startOfWeek(subDays(date, -7), { weekStartsOn: 0 }), 1);
          periodCompletions = (completions || []).filter((c) => {
            const compDate = new Date(c.date);
            return compDate >= weekStart && compDate <= weekEnd && c.percentage >= 100;
          });
        } else if (period === '1y') {
          const monthStart = startOfMonth(date);
          const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
          periodCompletions = (completions || []).filter((c) => {
            const compDate = new Date(c.date);
            return compDate >= monthStart && compDate <= monthEnd && c.percentage >= 100;
          });
        } else {
          // Dias individuais
          const dateStr = format(date, 'yyyy-MM-dd');
          periodCompletions = (completions || []).filter(
            (c) => c.date === dateStr && c.percentage >= 100
          );
        }

        const uniqueHabits = new Set(periodCompletions.map((c) => c.habit_id));
        const completed = uniqueHabits.size;
        const total = habits.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          label: formatLabel(date),
          completed,
          total,
          percentage,
          date: format(date, 'yyyy-MM-dd'),
          isToday: isSameDay(date, today),
        };
      });

      // Calcular métricas
      const totalCompleted = processedData.reduce((sum, d) => sum + d.completed, 0);
      const totalPossible = processedData.reduce((sum, d) => sum + d.total, 0);
      const averagePercentage = totalPossible > 0 
        ? Math.round((totalCompleted / totalPossible) * 100) 
        : 0;

      const bestPeriod = processedData.reduce((best, d) =>
        d.percentage > best.percentage ? d : best
      , processedData[0]);

      const worstPeriod = processedData
        .filter((d) => d.total > 0)
        .reduce((worst, d) => 
          d.percentage < worst.percentage ? d : worst
        , processedData[0]);

      return {
        data: processedData,
        totalCompleted,
        totalPossible,
        averagePercentage,
        bestPeriod,
        worstPeriod,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
