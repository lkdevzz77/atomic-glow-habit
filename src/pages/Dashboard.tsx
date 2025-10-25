import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { triggerAtomicAnimation } from "@/utils/atomicParticles";
import { triggerHaptic } from "@/utils/haptics";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/layouts/AppLayout";
import { useHabits } from "@/hooks/useHabits";
import { useStats } from "@/hooks/useStats";
import { useAuth } from "@/contexts/AuthContext";
import { DailyProgressCard } from "@/components/DailyProgressCard";
import NewHabitModal from "@/components/NewHabitModal";
import KanbanView from "@/components/views/KanbanView";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { AnimatedPage } from "@/components/AnimatedPage";
import { PageLoader } from "@/components/PageLoader";
import { Plus, Atom } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { data: habits, isLoading: habitsLoading, completeHabit, undoHabit } = useHabits();
  const { weeklyStats, streakStats } = useStats();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);

  // Get XP earned today from database
  const { data: xpEarnedToday } = useQuery({
    queryKey: ['xp-earned-today', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { data, error } = await supabase
        .rpc('get_user_xp_earned_today', { p_user_id: user.id });
      if (error) {
        console.error('Error fetching XP:', error);
        return 0;
      }
      return data || 0;
    },
    enabled: !!user?.id,
  });

  const dateLocale = i18n.language === 'en' ? enUS : ptBR;

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
          await handleUndoHabit(habitId);
        }
      }
    });
  };

  const handleUndoHabit = async (habitId: number) => {
    undoHabit(habitId);
    toast.info("Conclusão desfeita", {
      duration: 2000
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
  const todayFormatted = format(new Date(), "EEEE, d 'de' MMMM", { locale: dateLocale });
  
  // Calculate daily progress data
  const today = new Date().toISOString().split('T')[0];
  const completedToday = habits?.filter(h => h.completedToday).length || 0;
  
  const activeStreaks = habits?.filter(h => {
    if (!h.streak || h.streak === 0) return false;
    // Verify if habit was completed today or yesterday
    return h.completedToday || h.last_completed;
  }).length || 0;
  
  const xpEarned = xpEarnedToday || 0;
  
  // Prepare weekly data for mini graph
  const weeklyData = weeklyStats?.data?.days?.map(day => ({
    day: day.day.substring(0, 3), // D, S, T, Q, Q, S, S
    percentage: day.percentage
  })) || [];

  return <AppLayout>
      <AnimatedPage>
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
                {todayFormatted}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Atom className="w-8 h-8 md:w-9 md:h-9 text-primary drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]" />
                <span className="text-primary">Olá {userName}</span>
              </h1>
              <p className="text-sm text-muted-foreground/90 mt-2 max-w-xl">
                {i18n.language === 'en' 
                  ? 'Every action is a vote for the person you want to become'
                  : 'Cada ação é um voto para quem você está se tornando'}
              </p>
            </div>
            
            {/* MOBILE: Botão de Novo Hábito sempre visível */}
            <Button 
              onClick={() => setIsNewHabitModalOpen(true)}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow rounded-xl h-11"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('habits.newHabit')}
            </Button>
          </div>

          {/* Kanban View */}
          <KanbanView 
            habits={habits || []} 
            onComplete={handleCompleteHabit} 
            onAddHabit={() => setIsNewHabitModalOpen(true)}
            onUndo={handleUndoHabit}
          />

          {/* Daily Progress Card - PARTE 1: Timeline */}
          <DailyProgressCard
            completedToday={completedToday}
            totalHabits={habits?.length || 0}
            activeStreaks={activeStreaks}
            xpEarned={xpEarned}
            habits={habits?.map(h => ({
              id: h.id,
              title: h.title,
              icon: h.icon,
              completed: h.completedToday || false,
              completedAt: h.last_completed || undefined
            }))}
          />
        </div>

        {/* Modals */}
        <NewHabitModal open={isNewHabitModalOpen} onOpenChange={setIsNewHabitModalOpen} />
      </AnimatedPage>
    </AppLayout>;
};
export default Dashboard;