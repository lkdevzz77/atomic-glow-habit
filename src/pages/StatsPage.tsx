import React from 'react';
import { useHabits } from '@/hooks/useHabits';
import { useStats } from '@/hooks/useStats';
import { AppLayout } from '@/layouts/AppLayout';
import { PageLoader } from '@/components/PageLoader';
import { AnimatedPage } from '@/components/AnimatedPage';
import StatMetricCard from '@/components/StatMetricCard';
import WeeklyChart from '@/components/WeeklyChart';
import WeeklyChecklist from '@/components/WeeklyChecklist';
import { BarChart, TrendingUp, Target, Award, Flame, Clock } from 'lucide-react';

const StatsPage = () => {
  const { data: habits, isLoading } = useHabits();
  const { weeklyStats, streakStats } = useStats();

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
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
              📊 Suas Estatísticas
            </h2>
            <p className="text-slate-400">
              "O que é medido é gerenciado. O que é gerenciado melhora." — James Clear
            </p>
          </div>

          {/* SEÇÃO 1: Métricas em Destaque */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatMetricCard
              icon={<BarChart className="w-6 h-6 text-white" />}
              title="Taxa de Conclusão"
              value={`${Math.round(completionRate)}%`}
              subtitle={completionRate >= 70 ? 'Ótimo desempenho!' : 'Continue se esforçando'}
              trend={completionRate >= 70 ? 'up' : 'neutral'}
              color="violet"
            />
            
            <StatMetricCard
              icon={<Target className="w-6 h-6 text-white" />}
              title="Total de Conclusões"
              value={totalCompletions}
              subtitle={`${totalCompletions} hábitos completados`}
              trend={totalCompletions > 30 ? 'up' : 'neutral'}
              color="emerald"
            />
            
            <StatMetricCard
              icon={<Flame className="w-6 h-6 text-white" />}
              title="Sequência Ativa"
              value={`${activeStreak} dias`}
              subtitle={activeStreak >= 7 ? 'Você está pegando fogo! 🔥' : 'Continue assim!'}
              trend={activeStreak >= 7 ? 'up' : 'neutral'}
              color="amber"
            />
            
            <StatMetricCard
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              title="Progresso Médio"
              value={`${Math.round(completionRate)}%`}
              subtitle="Média diária"
              trend={completionRate >= 75 ? 'up' : 'neutral'}
              color="violet"
            />
            
            <StatMetricCard
              icon={<Award className="w-6 h-6 text-white" />}
              title="Melhor Dia"
              value={bestDay}
              subtitle="Seu dia mais produtivo"
              trend="neutral"
              color="emerald"
            />
            
            <StatMetricCard
              icon={<Clock className="w-6 h-6 text-white" />}
              title="Consistência"
              value={`${Math.round((activeStreak / 30) * 100)}%`}
              subtitle="Score de regularidade"
              trend={(activeStreak / 30) * 100 >= 80 ? 'up' : 'neutral'}
              color="amber"
            />
          </div>

          {/* SEÇÃO 2: Gráfico Semanal */}
          <div>
            <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              Evolução Semanal
            </h3>
            <WeeklyChart />
          </div>

          {/* SEÇÃO 3: Checklist Detalhado */}
          <div>
            <WeeklyChecklist habits={habits || []} />
          </div>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
};

export default StatsPage;
