import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "@/hooks/useHabits";
import { useStats } from "@/hooks/useStats";
import { useAuth } from "@/contexts/AuthContext";
import { useLevel } from "@/hooks/useLevel";
import { Plus } from "lucide-react";
import NewHabitModal from "@/components/NewHabitModal";
import { UserMenu } from "@/components/UserMenu";
import KanbanView from "@/components/views/KanbanView";
import HabitCalendar from "@/components/HabitCalendar";
import DayDetailModal from "@/components/DayDetailModal";
import LevelBadge from "@/components/LevelBadge";
import LevelUpModal from "@/components/LevelUpModal";
import confetti from "canvas-confetti";
import WeeklyChart from "@/components/WeeklyChart";
import WeeklyChecklist from "@/components/WeeklyChecklist";
import WeeklyComparison from "@/components/WeeklyComparison";
import BadgeScroll from "@/components/BadgeScroll";
import { XP_REWARDS } from "@/systems/levelSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: habits, isLoading: habitsLoading, completeHabit } = useHabits();
  const { weeklyStats } = useStats();
  const { level, levelInfo, xp, currentLevelXP, nextLevelXP, progress, awardXP } = useLevel();
  const navigate = useNavigate();
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<any>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number; rewards: string[] }>({
    oldLevel: 1,
    newLevel: 1,
    rewards: [],
  });

  const handleCompleteHabit = async (habitId: number) => {
    const habit = habits?.find(h => h.id === habitId);
    if (!habit) return;
    
    await completeHabit({ habitId, percentage: 100, habitTitle: habit.title });
    
    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleDayClick = (date: Date, dayData: any) => {
    setSelectedDate(date);
    setSelectedDayData(dayData);
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (habitsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900/10 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/atom-logo.png" 
            alt="Loading" 
            className="w-16 h-16 mx-auto mb-4"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(124, 58, 237, 0.8))',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
          <p className="text-slate-300">Carregando seus hábitos...</p>
        </div>
      </div>
    );
  }

  const completedToday = habits?.filter(h => h.completedToday).length || 0;
  const totalToday = habits?.length || 0;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const maxStreak = Math.max(...(habits?.map(h => h.longest_streak || 0) || []), 0);
  
  // Get user name from metadata
  const userName = user.user_metadata?.name || 'Usuário';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getDateString = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-violet border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src="/atom-logo.png" 
                alt="atomicTracker" 
                className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 hover:scale-110 hover:rotate-12"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.6))'
                }}
              />
              <span className="text-base sm:text-xl md:text-2xl font-extrabold tracking-tighter gradient-text">atomicTracker</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-200">Nível {level}</p>
                  <p className="text-xs text-slate-400">{currentLevelXP} / {nextLevelXP} XP</p>
                </div>
                <LevelBadge 
                  level={level} 
                  size="md"
                  xp={currentLevelXP}
                  nextLevelXP={nextLevelXP}
                />
              </div>
              <UserMenu points={maxStreak * 100} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
        {/* Banner */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-2">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-slate-400 mb-4">{getDateString()}</p>
        </div>

        {/* Main Content - Kanban View */}
        <div className="animate-fade-in">
          <KanbanView
            habits={habits || []}
            onComplete={handleCompleteHabit}
            onAddHabit={() => setIsNewHabitModalOpen(true)}
          />
        </div>

        {/* Tabs Section */}
        {habits && habits.length > 0 && (
          <div className="mt-12">
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
                <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                <TabsTrigger value="calendar">Calendário</TabsTrigger>
                <TabsTrigger value="badges">Conquistas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="mt-8">
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
                      <div className="text-3xl mb-2">🔥</div>
                      <p className="text-slate-400 text-sm mb-1">Streak Atual</p>
                      <p className="text-2xl font-bold text-slate-50">{maxStreak} dias</p>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
                      <div className="text-3xl mb-2">⚡</div>
                      <p className="text-slate-400 text-sm mb-1">XP Total</p>
                      <p className="text-2xl font-bold text-slate-50">{xp}</p>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
                      <div className="text-3xl mb-2">🏆</div>
                      <p className="text-slate-400 text-sm mb-1">{levelInfo.title}</p>
                      <p className="text-2xl font-bold text-slate-50">Nível {level}</p>
                    </div>
                  </div>

                  {/* Weekly Chart */}
                  <WeeklyChart />

                  {/* Weekly Comparison */}
                  <WeeklyComparison />

                  {/* Weekly Checklist */}
                  <WeeklyChecklist habits={habits} />
                </div>
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-8">
                <HabitCalendar
                  habits={habits.map(h => ({ id: h.id, title: h.title, icon: h.icon }))}
                  completions={[]}
                  onDayClick={handleDayClick}
                />
              </TabsContent>
              
              <TabsContent value="badges" className="mt-8">
                <BadgeScroll />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsNewHabitModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full shadow-2xl shadow-violet-500/50 hover:shadow-violet-500/70 hover:scale-105 transition-all duration-200 flex items-center justify-center"
        aria-label="Adicionar novo hábito"
      >
        <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* New Habit Modal */}
      <NewHabitModal 
        open={isNewHabitModalOpen} 
        onClose={() => setIsNewHabitModalOpen(false)} 
      />

      {/* Level Up Modal */}
      {showLevelUp && (
        <LevelUpModal
          isOpen={showLevelUp}
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          rewards={levelUpData.rewards}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      {/* Day Detail Modal */}
      {selectedDate && selectedDayData && (
        <DayDetailModal
          date={selectedDate}
          habits={habits?.map(h => ({ 
            id: h.id, 
            title: h.title, 
            icon: h.icon,
            goal_target: h.goal_target,
            goal_unit: h.goal_unit
          })) || []}
          completions={selectedDayData.completions || []}
          onClose={() => {
            setSelectedDate(null);
            setSelectedDayData(null);
          }}
          onToggleCompletion={handleCompleteHabit}
        />
      )}
    </div>
  );
};

export default Dashboard;
