import React from 'react';
import { useHabits } from '@/hooks/useHabits';
import { useStats } from '@/hooks/useStats';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { PageLoader } from '@/components/PageLoader';
import { AnimatedPage } from '@/components/AnimatedPage';
import StatMetricCard from '@/components/StatMetricCard';
import PeriodChart from '@/components/stats/PeriodChart';
import HabitDetailChart from '@/components/stats/HabitDetailChart';
import SmartInsights from '@/components/stats/SmartInsights';
import { Target, Flame, Trophy, CheckCircle2, TrendingUp } from 'lucide-react';

const StatsPage = () => {
  const { user } = useAuth();
  const { data: habits, isLoading } = useHabits();
  const { weeklyStats, streakStats } = useStats();

  // Buscar completions para timeline
  const { data: completions } = useQuery({
    queryKey: ['habit-completions-stats', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      return data || [];
    },
    enabled: !!user && !!habits,
  });

  const completionRate = weeklyStats.data?.averageCompletion || 0;
  const bestDay = weeklyStats.data?.bestDay.date 
    ? new Date(weeklyStats.data.bestDay.date).toLocaleDateString('pt-BR', { weekday: 'short' })
    : 'N/A';
  const currentStreak = streakStats.data?.currentStreak || 0;
  const worstDay = weeklyStats.data?.worstDay || { date: '', percentage: 0 };
  const totalCompletions = streakStats.data?.totalDaysActive || 0;

  if (isLoading || weeklyStats.isLoading || streakStats.isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="space-y-4 pb-20">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Estatísticas</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Acompanhe seu progresso de forma visual
              </p>
            </div>
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatMetricCard
              icon={<Target className="w-5 h-5" />}
              title="Taxa de Conclusão"
              value={`${Math.round(completionRate)}%`}
              subtitle="dos hábitos completados"
            />
            <StatMetricCard
              icon={<Flame className="w-5 h-5" />}
              title="Sequência Ativa"
              value={`${currentStreak}`}
              subtitle={currentStreak > 0 ? "dias consecutivos" : "Comece uma sequência!"}
            />
            <StatMetricCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              title="Total"
              value={totalCompletions.toString()}
              subtitle="hábitos completados"
            />
            <StatMetricCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="Melhor Dia"
              value={bestDay}
              subtitle="maior taxa de conclusão"
            />
          </div>

          {/* Smart Insights */}
          <SmartInsights
            averageCompletion={completionRate}
            currentStreak={currentStreak}
            bestDay={weeklyStats.data?.bestDay || { date: '', percentage: 0 }}
            worstDay={worstDay}
            totalCompletions={totalCompletions}
          />

          {/* Gráfico de Período */}
          <PeriodChart />

          {/* Timeline Compacta */}
        {habits && completions && habits.length > 0 && (
          <HabitDetailChart 
            habits={habits} 
            completions={completions}
          />
        )}
        </div>
      </AnimatedPage>
    </AppLayout>
  );
};

export default StatsPage;
