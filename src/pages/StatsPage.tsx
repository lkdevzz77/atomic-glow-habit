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
import HabitsTimeline from '@/components/stats/HabitsTimeline';
import SmartInsights from '@/components/stats/SmartInsights';
import { BarChart, Target, Flame, Trophy } from 'lucide-react';

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
    ? new Date(weeklyStats.data.bestDay.date).toLocaleDateString('pt-BR', { weekday: 'long' })
    : 'N/A';
  const activeStreak = streakStats.data?.currentStreak || 0;
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
        <div className="space-y-6">
          {/* Header Minimalista */}
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Estatísticas</h1>
            <p className="text-sm text-slate-400 mt-1">
              Acompanhe seu progresso ao longo do tempo
            </p>
          </div>

          {/* Métricas Principais - 4 cards essenciais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="neuro-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <BarChart className="w-5 h-5 text-violet-400" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm text-slate-400 font-medium">Taxa de Conclusão</h4>
                <p className="text-4xl font-bold text-slate-100">{Math.round(completionRate)}%</p>
                <p className="text-xs text-slate-500">
                  {completionRate >= 70 ? 'Ótimo desempenho!' : 'Continue se esforçando'}
                </p>
              </div>
            </div>

            <div className="neuro-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm text-slate-400 font-medium">Sequência Ativa</h4>
                <p className="text-4xl font-bold text-slate-100">{activeStreak}</p>
                <p className="text-xs text-slate-500">
                  {activeStreak >= 7 ? 'Você está pegando fogo! 🔥' : 'Continue assim!'}
                </p>
              </div>
            </div>

            <div className="neuro-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm text-slate-400 font-medium">Total de Conclusões</h4>
                <p className="text-4xl font-bold text-slate-100">{totalCompletions}</p>
                <p className="text-xs text-slate-500">{totalCompletions} hábitos completados</p>
              </div>
            </div>

            <div className="neuro-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Trophy className="w-5 h-5 text-violet-400" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm text-slate-400 font-medium">Melhor Dia</h4>
                <p className="text-2xl font-bold text-slate-100">{bestDay}</p>
                <p className="text-xs text-slate-500">Seu dia mais produtivo</p>
              </div>
            </div>
          </div>

          {/* Insights Inteligentes */}
          <SmartInsights
            averageCompletion={completionRate}
            currentStreak={activeStreak}
            bestDay={weeklyStats.data?.bestDay || { date: '', percentage: 0 }}
            worstDay={weeklyStats.data?.worstDay || { date: '', percentage: 0 }}
            totalCompletions={totalCompletions}
          />

          {/* Timeline Compacta */}
          {habits && completions && (
            <HabitsTimeline 
              habits={habits} 
              completions={completions}
              days={14}
              compact={true}
            />
          )}

          {/* Gráfico com Filtro de Período */}
          <PeriodChart />
        </div>
      </AnimatedPage>
    </AppLayout>
  );
};

export default StatsPage;
