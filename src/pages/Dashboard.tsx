import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "@/hooks/useHabits";
import { useStats } from "@/hooks/useStats";
import { useAuth } from "@/contexts/AuthContext";
import { Plus } from "lucide-react";
import NewHabitModal from "@/components/NewHabitModal";
import { UserMenu } from "@/components/UserMenu";
import ViewToggle from "@/components/ViewToggle";
import SimpleBanner from "@/components/SimpleBanner";
import FocusView from "@/components/views/FocusView";
import ListView from "@/components/views/ListView";
import KanbanView from "@/components/views/KanbanView";
import confetti from "canvas-confetti";
import WeeklyChart from "@/components/WeeklyChart";
import WeeklyChecklist from "@/components/WeeklyChecklist";
import BadgeScroll from "@/components/BadgeScroll";

type ViewType = 'focus' | 'list' | 'kanban';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: habits, isLoading: habitsLoading, completeHabit } = useHabits();
  const { weeklyStats } = useStats();
  const navigate = useNavigate();
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);
  const [view, setView] = useState<ViewType>(() => {
    return (localStorage.getItem('dashboard-view') as ViewType) || 'focus';
  });

  // Save view preference
  useEffect(() => {
    localStorage.setItem('dashboard-view', view);
  }, [view]);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };

  const handleCompleteHabit = async (habitId: number) => {
    await completeHabit({ habitId, percentage: 100 });
    
    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
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

  const completedToday = habits.filter(h => h.status === "completed").length;
  const totalToday = habits.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const maxStreak = Math.max(...habits.map(h => h.longest_streak || 0), 0);
  
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
              <ViewToggle currentView={view} onViewChange={handleViewChange} />
              <UserMenu points={maxStreak * 100} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
        {/* Banner */}
        <SimpleBanner
          userName={userName}
          dateString={getDateString()}
          completedToday={completedToday}
          totalToday={totalToday}
          completionRate={completionRate}
        />

        {/* View Content */}
        <div className="animate-fade-in">
          {view === 'focus' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Focus Column */}
              <div className="lg:col-span-2">
                <FocusView
                  habits={habits}
                  onComplete={handleCompleteHabit}
                  onAddHabit={() => setIsNewHabitModalOpen(true)}
                  onViewAll={() => setView('list')}
                />
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-6">
                {/* Stats */}
                <div>
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    ESTATÍSTICAS
                  </h2>
                  <div className="space-y-3">
                    <div className="bg-slate-800 px-4 py-3 rounded-xl text-slate-200">
                      🔥 Streak Atual: <span className="font-bold">{maxStreak} dias</span>
                    </div>
                    <div className="bg-slate-800 px-4 py-3 rounded-xl text-slate-200">
                      🏆 Badges: <span className="font-bold">0/6</span>
                    </div>
                  </div>
                </div>

                {/* Coach AI */}
                <div>
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    COACH IA
                  </h2>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">💡</span>
                      <span className="text-white font-semibold">Seu Coach IA</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      1% melhor todo dia é o caminho para a transformação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {view === 'list' && (
            <ListView
              habits={habits}
              onComplete={handleCompleteHabit}
            />
          )}
          
          {view === 'kanban' && (
            <KanbanView
              habits={habits}
              onComplete={handleCompleteHabit}
            />
          )}

        {/* Weekly Chart - Only in list/kanban view */}
        {habits && habits.length > 0 && view !== 'focus' && (
          <div className="mt-12 sm:mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-6 tracking-tight">Estatísticas da Semana</h2>
            {weeklyStats.isLoading ? (
              <div className="glass rounded-2xl sm:rounded-3xl p-8 text-center border border-slate-700/50">
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-700 rounded w-48 mx-auto mb-4"></div>
                  <div className="h-64 bg-slate-700 rounded"></div>
                </div>
              </div>
            ) : weeklyStats.data ? (
              <WeeklyChart weekData={weeklyStats.data.days} />
            ) : (
              <div className="glass rounded-2xl p-6 text-center text-slate-400 border border-slate-700/50">
                Carregando estatísticas...
              </div>
            )}
          </div>
        )}

        {/* Weekly Checklist - Only in list/kanban view */}
        {habits.length > 0 && view !== 'focus' && (
          <div className="mt-12 sm:mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-6 tracking-tight">Checklist Semanal</h2>
            <WeeklyChecklist habits={habits} />
          </div>
        )}

        {/* Badges - Only in list/kanban view */}
        {habits.length > 0 && view !== 'focus' && (
          <div className="mt-12 sm:mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-6 tracking-tight">Conquistas</h2>
            <BadgeScroll />
          </div>
        )}
        </div>
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
    </div>
  );
};

export default Dashboard;
