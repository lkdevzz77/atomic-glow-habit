import React, { useState, useEffect } from "react";
import { Plus, Calendar, Target, BarChart, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { triggerAtomicAnimation } from "@/utils/atomicParticles";
import { triggerHaptic } from "@/utils/haptics";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/layouts/AppLayout";
import { useHabits } from "@/hooks/useHabits";
import { useStats } from "@/hooks/useStats";
import { useAuth } from "@/contexts/AuthContext";
import NewHabitModal from "@/components/NewHabitModal";
import DayDetailModal from "@/components/DayDetailModal";
import KanbanView from "@/components/views/KanbanView";
import WeeklyChart from "@/components/WeeklyChart";
import WeeklyChecklist from "@/components/WeeklyChecklist";
import WeeklyComparison from "@/components/WeeklyComparison";
import { NotionCalendar } from "@/components/NotionCalendar";
import { HabitTimeline } from "@/components/HabitTimeline";
import { useIsMobile } from "@/hooks/use-mobile";
import BadgeScroll from "@/components/BadgeScroll";
import UpcomingBadges from "@/components/UpcomingBadges";
import StatMetricCard from "@/components/StatMetricCard";
import HabitInsights from "@/components/HabitInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trophy, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatedPage } from "@/components/AnimatedPage";
import { PageLoader } from "@/components/PageLoader";
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const {
    data: habits,
    isLoading: habitsLoading,
    completeHabit
  } = useHabits();
  const {
    weeklyStats
  } = useStats();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'n' || e.key === 'N') {
        setIsNewHabitModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  const handleCompleteHabit = async (habitId: number) => {
    const habit = habits?.find(h => h.id === habitId);
    if (!habit) return;
    await completeHabit({
      habitId,
      percentage: 100,
      habitTitle: habit.title
    });

    // Atomic animation
    triggerAtomicAnimation();

    // Toast with undo
    toast.success(`${habit.title} concluído!`, {
      description: "Ótimo trabalho! Continue assim 🚀",
      duration: 5000,
      action: {
        label: "Desfazer",
        onClick: async () => {
          const today = new Date().toISOString().split('T')[0];
          await supabase.from('habit_completions').delete().eq('habit_id', habitId).eq('date', today);
          queryClient.invalidateQueries({
            queryKey: ['habits']
          });
          toast.info("Conclusão desfeita", {
            duration: 2000
          });
        }
      }
    });
  };
  if (!user) {
    navigate("/auth");
    return null;
  }
  if (habitsLoading) {
    return <AppLayout>
        <PageLoader />
      </AppLayout>;
  }
  const userName = user.user_metadata?.name || 'Usuário';

  // Buscar todas as completions para o calendário
  const allCompletions = habits?.flatMap(habit => (habit as any).completions?.map((c: any) => ({
    habit_id: habit.id,
    date: c.date,
    percentage: c.percentage || 100
  })) || []) || [];
  return <AppLayout>
      <AnimatedPage>
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            {userName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Cada ação é um voto para quem você está se tornando
          </p>
        </div>

          {/* Main Content */}
          <Tabs defaultValue="kanban" className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="kanban" onClick={() => triggerHaptic('light')} className="relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-violet-500 data-[state=active]:after:rounded-full">
                <Target className="w-4 h-4" />
                <span>Hábitos</span>
              </TabsTrigger>
              
              <TabsTrigger value="calendar" onClick={() => triggerHaptic('light')} className="relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-violet-500 data-[state=active]:after:rounded-full">
                <Calendar className="w-4 h-4" />
                <span>Calendário</span>
              </TabsTrigger>
              
              <TabsTrigger value="stats" onClick={() => triggerHaptic('light')} className="relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-violet-500 data-[state=active]:after:rounded-full">
                <BarChart className="w-4 h-4" />
                <span>Estatísticas</span>
              </TabsTrigger>
              
              <TabsTrigger value="badges" onClick={() => triggerHaptic('light')} className="relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-violet-500 data-[state=active]:after:rounded-full">
                <Award className="w-4 h-4" />
                <span>Conquistas</span>
              </TabsTrigger>
            </TabsList>

          {/* Kanban View */}
          <TabsContent value="kanban" className="mt-6">
            <KanbanView habits={habits || []} onComplete={handleCompleteHabit} onAddHabit={() => setIsNewHabitModalOpen(true)} />
          </TabsContent>

          {/* Calendar View */}
          <TabsContent value="calendar" className="mt-6">
            {isMobile ? <HabitTimeline habits={habits?.map(h => ({
              id: h.id,
              title: h.title,
              icon: h.icon
            })) || []} completions={allCompletions} onHabitToggle={handleCompleteHabit} onDayClick={date => {
              setSelectedDate(date);
              setIsDayDetailModalOpen(true);
            }} /> : <NotionCalendar habits={habits?.map(h => ({
              id: h.id,
              title: h.title,
              icon: h.icon
            })) || []} completions={allCompletions} onHabitToggle={handleCompleteHabit} onDayClick={date => {
              setSelectedDate(date);
              setIsDayDetailModalOpen(true);
            }} />}
          </TabsContent>

          {/* Stats View */}
          <TabsContent value="stats" className="space-y-8 mt-6">
            {/* Header da Seção */}
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Suas Estatísticas
              </h2>
              <p className="text-slate-400">
                "O que é medido é gerenciado. O que é gerenciado melhora." — James Clear
              </p>
            </div>

            {/* SEÇÃO 1: Métricas em Destaque */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatMetricCard title="Taxa Média de Conclusão" value={`${weeklyStats?.data?.averageCompletion || 0}%`} subtitle="Esta semana" icon={<BarChart className="w-6 h-6" />} />

              {weeklyStats?.data?.bestDay && <StatMetricCard title="Melhor Dia" value={format(new Date(weeklyStats.data.bestDay.date), "EEEE", {
                locale: ptBR
              })} subtitle={`${weeklyStats.data.bestDay.percentage}% concluído`} icon={<Trophy className="w-6 h-6" />} />}

              {weeklyStats?.data?.worstDay && <StatMetricCard title="Dia Precisando Atenção" value={format(new Date(weeklyStats.data.worstDay.date), "EEEE", {
                locale: ptBR
              })} subtitle={`${weeklyStats.data.worstDay.percentage}% concluído`} icon={<AlertCircle className="w-6 h-6" />} />}
            </div>

            {/* SEÇÃO 2: Desempenho */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-100 mb-4">
                Desempenho da Semana
              </h3>
              <WeeklyChart />
              <WeeklyComparison />
            </div>

            {/* SEÇÃO 3: Progresso Detalhado */}
            <div>
              <WeeklyChecklist habits={habits || []} />
            </div>

            {/* SEÇÃO 4: Insights */}
            <HabitInsights habits={habits || []} />
          </TabsContent>

          {/* Badges View */}
          <TabsContent value="badges" className="space-y-6 mt-6">
            <BadgeScroll />
            <UpcomingBadges />
            </TabsContent>
          </Tabs>

          {/* Floating Action Button */}
          
        </div>

        {/* Modals */}
        <NewHabitModal open={isNewHabitModalOpen} onOpenChange={setIsNewHabitModalOpen} />

        {isDayDetailModalOpen && selectedDate && <DayDetailModal date={selectedDate} habits={habits || []} completions={allCompletions} onClose={() => setIsDayDetailModalOpen(false)} />}
      </AnimatedPage>
    </AppLayout>;
};
export default Dashboard;