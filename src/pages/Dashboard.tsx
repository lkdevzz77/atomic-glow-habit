import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, CheckCircle2, TrendingUp, Plus, Sparkles } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { useStats } from "@/hooks/useStats";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Button";
import HabitCard from "@/components/HabitCard";
import CoachAI from "@/components/CoachAI";
import WeeklyChart from "@/components/WeeklyChart";
import BadgeScroll from "@/components/BadgeScroll";
import NewHabitModal from "@/components/NewHabitModal";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: habits, isLoading: habitsLoading } = useHabits(); // Busca todos os hábitos
  const { weeklyStats } = useStats();
  const navigate = useNavigate();
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900/10 to-slate-900">
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
            
            <nav className="hidden md:flex items-center gap-6">
              <button 
                className="text-slate-300 hover:text-violet-400 font-medium transition-colors"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
              <button className="text-slate-300 hover:text-violet-400 font-medium transition-colors">
                Hábitos
              </button>
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full shadow-lg shadow-violet-500/30">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                <span className="text-white text-sm sm:text-base font-bold">{maxStreak * 100}</span>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white text-sm sm:text-base font-bold border-2 border-violet-500">
                {userName[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-violet-900 via-violet-800 to-violet-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 mb-6 sm:mb-8 shadow-2xl shadow-violet-900/50 animate-fade-in overflow-hidden">
          {/* Decorative logo */}
          <img 
            src="/atom-logo.svg" 
            alt=""
            className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 opacity-10 pointer-events-none"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))',
              animation: 'float 6s ease-in-out infinite'
            }}
          />
          
          <h1 className="relative z-10 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tighter text-slate-50 mb-1 sm:mb-2">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="relative z-10 text-violet-200 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 capitalize">{getDateString()}</p>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-slate-900/30 backdrop-blur border border-violet-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg hover:shadow-violet-500/30 transition-all">
              <div className="flex items-center justify-between sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 sm:gap-3 sm:mb-2">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                  <span className="text-violet-300 text-sm sm:text-base font-medium">Streak</span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold metric-number text-slate-50">{maxStreak} dias</div>
                  <div className="text-xs sm:text-sm text-violet-300 mt-0.5 sm:mt-1">Continue assim! 🎉</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/30 backdrop-blur border border-violet-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg hover:shadow-violet-500/30 transition-all">
              <div className="flex items-center justify-between sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 sm:gap-3 sm:mb-2">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  <span className="text-violet-300 text-sm sm:text-base font-medium">Hoje</span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold metric-number text-slate-50">
                    {completedToday}/{totalToday}
                  </div>
                  <div className="text-xs sm:text-sm text-violet-300 mt-0.5 sm:mt-1">completos</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/30 backdrop-blur border border-violet-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg hover:shadow-violet-500/30 transition-all">
              <div className="flex items-center justify-between sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 sm:gap-3 sm:mb-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
                  <span className="text-violet-300 text-sm sm:text-base font-medium">Semana</span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold metric-number text-slate-50">{completionRate}%</div>
                  <div className="text-xs sm:text-sm text-violet-300 mt-0.5 sm:mt-1">
                    {completionRate > 80 ? "↑ Excelente!" : "↑ Melhorando"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Habits Section */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold heading-section text-slate-50">Hábitos de Hoje</h2>
            </div>

            {habits.length === 0 ? (
              <div className="glass rounded-2xl p-8 sm:p-12 text-center">
                <img 
                  src="/atom-logo.png"
                  alt=""
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 animate-float"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(124, 58, 237, 0.5))'
                  }}
                />
                <h3 className="text-lg sm:text-xl font-bold text-slate-50 mb-2">
                  Nenhum hábito ainda
                </h3>
                <p className="text-sm sm:text-base text-slate-400 mb-6">
                  Complete o onboarding para criar seu primeiro hábito!
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate("/onboarding")}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-200"
                >
                  Começar Agora
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {habits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <div className="lg:sticky lg:top-24">
              <CoachAI />
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        {habits && habits.length > 0 && (
          <div className="mt-8">
            {weeklyStats.isLoading ? (
              <div className="glass rounded-xl sm:rounded-2xl p-8 text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-700 rounded w-48 mx-auto mb-4"></div>
                  <div className="h-64 bg-slate-700 rounded"></div>
                </div>
              </div>
            ) : weeklyStats.data ? (
              <WeeklyChart weekData={weeklyStats.data.days} />
            ) : (
              <div className="glass rounded-xl p-6 text-center text-slate-400">
                Carregando estatísticas...
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        {habits.length > 0 && (
          <div className="mt-8">
            <BadgeScroll />
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
    </div>
  );
};

export default Dashboard;
