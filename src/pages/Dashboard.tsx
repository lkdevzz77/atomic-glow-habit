import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { useAuth } from "@/contexts/AuthContext";
import NewHabitModal from "@/components/NewHabitModal";
import { UserMenu } from "@/components/UserMenu";
import FocusView from "@/components/views/FocusView";
import confetti from "canvas-confetti";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: habits, isLoading: habitsLoading, completeHabit, isCompleting } = useHabits();
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

  const maxStreak = Math.max(...habits.map(h => h.longest_streak || 0), 0);
  
  const handleCompleteHabit = (habitId: number) => {
    completeHabit({
      habitId,
      percentage: 100
    });

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE']
    });
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

            <UserMenu points={maxStreak * 100} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
        {/* Focus View */}
        <FocusView
          habits={habits}
          onComplete={handleCompleteHabit}
          onAddHabit={() => setIsNewHabitModalOpen(true)}
          isCompleting={isCompleting}
        />
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
