import React, { useState, useEffect } from "react";
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
import KanbanView from "@/components/views/KanbanView";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatedPage } from "@/components/AnimatedPage";
import { PageLoader } from "@/components/PageLoader";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: habits, isLoading: habitsLoading, completeHabit } = useHabits();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);

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
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('habit_completions').delete().eq('habit_id', habitId).eq('date', today);
    queryClient.invalidateQueries({
      queryKey: ['habits']
    });
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
  return <AppLayout>
      <AnimatedPage>
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Olá, {userName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Cada ação é um voto para quem você está se tornando
            </p>
          </div>

          {/* Kanban View */}
          <KanbanView 
            habits={habits || []} 
            onComplete={handleCompleteHabit} 
            onAddHabit={() => setIsNewHabitModalOpen(true)}
            onUndo={handleUndoHabit}
          />
        </div>

        {/* Modals */}
        <NewHabitModal open={isNewHabitModalOpen} onOpenChange={setIsNewHabitModalOpen} />
      </AnimatedPage>
    </AppLayout>;
};
export default Dashboard;