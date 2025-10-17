import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, CheckCircle2, TrendingUp, Plus, Sparkles } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import Button from "@/components/Button";
import HabitCard from "@/components/HabitCard";
import CoachAI from "@/components/CoachAI";
import WeeklyChart from "@/components/WeeklyChart";
import { mockWeekData } from "@/mock/weekData";
import BadgeScroll from "@/components/BadgeScroll";
import NewHabitModal from "@/components/NewHabitModal";

const Dashboard = () => {
  const { user, habits } = useApp();
  const navigate = useNavigate();
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);

  if (!user) {
    navigate("/onboarding");
    return null;
  }

  const completedToday = habits.filter(h => h.status === "completed").length;
  const totalToday = habits.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const maxStreak = Math.max(...habits.map(h => h.streak), 0);

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
                <span className="text-white text-sm sm:text-base font-bold">{user.points}</span>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white text-sm sm:text-base font-bold border-2 border-violet-500">
                {user.name[0].toUpperCase()}
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
            {getGreeting()}, {user.name}! 👋
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
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsNewHabitModalOpen(true)}
                className="text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Novo Hábito</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </div>

            {habits.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-slate-50 mb-2">
                  Nenhum hábito ainda
                </h3>
                <p className="text-slate-300 mb-6">
                  Complete o onboarding para criar seu primeiro hábito!
                </p>
                <Button onClick={() => navigate("/onboarding")}>
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

        {/* Weekly Checklist */}
        {habits.length > 0 && (
          <div className="mt-8">
            <WeeklyChart weekData={mockWeekData} />
          </div>
        )}

        {/* Badges */}
        {habits.length > 0 && (
          <div className="mt-8">
            <BadgeScroll />
          </div>
        )}
      </div>

      {/* New Habit Modal */}
      <NewHabitModal 
        open={isNewHabitModalOpen} 
        onClose={() => setIsNewHabitModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
