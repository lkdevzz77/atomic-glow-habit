import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { triggerHabitConfetti } from "@/utils/confettiAnimation";
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
import BadgeScroll from "@/components/BadgeScroll";
import UpcomingBadges from "@/components/UpcomingBadges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: habits, isLoading: habitsLoading, completeHabit } = useHabits();
  const { weeklyStats } = useStats();
  const navigate = useNavigate();
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);

  const handleCompleteHabit = async (habitId: number) => {
    const habit = habits?.find(h => h.id === habitId);
    if (!habit) return;
    
    await completeHabit({ habitId, percentage: 100, habitTitle: habit.title });
    
    // Confetti animation
    triggerHabitConfetti();
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (habitsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/atom-logo.png" 
            alt="Loading" 
            className="w-16 h-16 mx-auto mb-4 animate-pulse"
            style={{ filter: 'drop-shadow(0 0 30px rgba(124, 58, 237, 0.8))' }}
          />
          <p className="text-muted-foreground">Reorganizando átomos...</p>
        </div>
      </div>
    );
  }

  const userName = user.user_metadata?.name || 'Usuário';

  // Buscar todas as completions para o calendário
  const allCompletions = habits?.flatMap(habit => 
    (habit as any).completions?.map((c: any) => ({
      habit_id: habit.id,
      date: c.date,
      percentage: c.percentage || 100
    })) || []
  ) || [];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {userName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Cada ação é um voto para quem você está se tornando
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="kanban" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto">
            <TabsTrigger value="kanban">Hábitos</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="badges">Conquistas</TabsTrigger>
          </TabsList>

          {/* Kanban View */}
          <TabsContent value="kanban" className="mt-6">
            <KanbanView
              habits={habits || []}
              onComplete={handleCompleteHabit}
              onAddHabit={() => setIsNewHabitModalOpen(true)}
            />
          </TabsContent>

          {/* Calendar View */}
          <TabsContent value="calendar" className="mt-6">
            <NotionCalendar
              habits={habits?.map(h => ({ id: h.id, title: h.title, icon: h.icon })) || []}
              completions={allCompletions}
              onHabitToggle={handleCompleteHabit}
              onDayClick={(date) => {
                setSelectedDate(date);
                setIsDayDetailModalOpen(true);
              }}
            />
          </TabsContent>

          {/* Stats View */}
          <TabsContent value="stats" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeeklyChart />
              <WeeklyComparison />
            </div>
            <WeeklyChecklist habits={habits || []} />
          </TabsContent>

          {/* Badges View */}
          <TabsContent value="badges" className="space-y-6 mt-6">
            <BadgeScroll />
            <UpcomingBadges />
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <Button
          onClick={() => setIsNewHabitModalOpen(true)}
          size="lg"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-2xl z-40"
        >
          <Plus size={24} />
        </Button>
      </div>

      {/* Modals */}
      <NewHabitModal
        open={isNewHabitModalOpen}
        onOpenChange={setIsNewHabitModalOpen}
      />

      {isDayDetailModalOpen && selectedDate && (
        <DayDetailModal
          date={selectedDate}
          habits={habits || []}
          completions={allCompletions}
          onClose={() => setIsDayDetailModalOpen(false)}
        />
      )}
    </AppLayout>
  );
};

export default Dashboard;
