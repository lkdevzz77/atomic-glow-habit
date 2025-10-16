import React from "react";
import { useNavigate } from "react-router-dom";
import { Flame, CheckCircle2, TrendingUp, Plus, Sparkles } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import Button from "@/components/Button";
import HabitCard from "@/components/HabitCard";
import CoachAI from "@/components/CoachAI";
import Heatmap from "@/components/Heatmap";
import BadgeScroll from "@/components/BadgeScroll";

const Dashboard = () => {
  const { user, habits } = useApp();
  const navigate = useNavigate();

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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-float">⚛️</div>
            <span className="text-2xl font-bold gradient-text">atomicTracker</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              className="text-slate-300 hover:text-violet-400 font-medium transition-colors"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
            <button className="text-slate-300 hover:text-violet-400 font-medium transition-colors">
              Hábitos
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full shadow-lg shadow-violet-500/30 animate-pulse-violet">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white font-bold">{user.points}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-violet-500">
              {user.name[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-violet-900 via-violet-800 to-violet-700 rounded-3xl p-10 mb-8 shadow-2xl shadow-violet-900/50 animate-fade-in">
          <h1 className="text-4xl font-bold text-slate-50 mb-2">
            {getGreeting()}, {user.name}! 👋
          </h1>
          <p className="text-violet-200 text-lg mb-6 capitalize">{getDateString()}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/30 backdrop-blur border border-violet-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-violet-500/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Flame className="w-6 h-6 text-orange-400" />
                <span className="text-violet-300 font-medium">Streak</span>
              </div>
              <div className="text-3xl font-bold text-slate-50">{maxStreak} dias</div>
              <div className="text-sm text-violet-300 mt-1">Continue assim! 🎉</div>
            </div>

            <div className="bg-slate-900/30 backdrop-blur border border-violet-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-violet-500/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="text-violet-300 font-medium">Hoje</span>
              </div>
              <div className="text-3xl font-bold text-slate-50">
                {completedToday}/{totalToday}
              </div>
              <div className="text-sm text-violet-300 mt-1">completos</div>
            </div>

            <div className="bg-slate-900/30 backdrop-blur border border-violet-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-violet-500/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-violet-400" />
                <span className="text-violet-300 font-medium">Semana</span>
              </div>
              <div className="text-3xl font-bold text-slate-50">{completionRate}%</div>
              <div className="text-sm text-violet-300 mt-1">
                {completionRate > 80 ? "↑ Excelente!" : "↑ Melhorando"}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Habits Section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-50">Hábitos de Hoje</h2>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Hábito
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
          <div className="lg:col-span-4 space-y-6">
            <CoachAI />
          </div>
        </div>

        {/* Heatmap */}
        {habits.length > 0 && (
          <div className="mt-8">
            <Heatmap habits={habits} />
          </div>
        )}

        {/* Badges */}
        {habits.length > 0 && (
          <div className="mt-8">
            <BadgeScroll />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
