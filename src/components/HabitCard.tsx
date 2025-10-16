import React, { useState } from "react";
import { BookOpen, Dumbbell, Droplet, Brain, Heart, Star, Check } from "lucide-react";
import { Habit } from "@/types/habit";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
}

const HabitCard = ({ habit }: HabitCardProps) => {
  const { completeHabit } = useApp();
  const [isCompleting, setIsCompleting] = useState(false);

  const icons: Record<string, React.ComponentType<any>> = {
    BookOpen,
    Dumbbell,
    Droplet,
    Brain,
    Heart,
    Star
  };

  const Icon = icons[habit.icon] || Star;
  const isCompleted = habit.status === "completed";
  const progress = habit.goal.target > 0 ? (habit.goal.current / habit.goal.target) * 100 : 0;

  const handleComplete = () => {
    if (isCompleted) return;
    
    setIsCompleting(true);
    
    // Animation
    setTimeout(() => {
      completeHabit(habit.id, habit.goal.target);
      setIsCompleting(false);
    }, 300);
  };

  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300 hover-scale-sm",
        isCompleted 
          ? "border-2 border-violet-500 bg-gradient-to-br from-violet-900/30 to-slate-800/90 shadow-xl shadow-violet-500/30" 
          : "border-2 border-slate-700 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shrink-0">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-50 mb-1">{habit.title}</h3>
            <div className="flex flex-wrap gap-2 text-sm text-slate-400">
              <span>⏰ {habit.when}</span>
              <span>·</span>
              <span>📍 {habit.where}</span>
              {habit.trigger && (
                <>
                  <span>·</span>
                  <span>⚡ Após {habit.trigger}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={cn(
            "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0",
            isCompleted
              ? "bg-violet-600 border-violet-500 shadow-lg shadow-violet-500/50"
              : "border-slate-600 hover:border-violet-500 hover:scale-110",
            isCompleting && "animate-scale-in"
          )}
        >
          {isCompleted && <Check className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        {isCompleted ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-400 font-semibold flex items-center gap-2">
              ✨ Completado
              {habit.lastCompleted && new Date(habit.lastCompleted).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <span className="text-violet-400 font-bold flex items-center gap-1">
              +10 pts 🎉
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Meta: {habit.goal.current}/{habit.goal.target} {habit.goal.unit}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        )}

        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500",
              isCompleted 
                ? "bg-gradient-to-r from-violet-600 to-purple-600" 
                : "bg-slate-600"
            )}
            style={{ width: `${isCompleted ? 100 : progress}%` }}
          />
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700">
        <span className="text-2xl">🔥</span>
        <span className="text-slate-300">
          Streak: <span className="font-bold text-violet-400">{habit.streak}</span> 
          {isCompleted && habit.streak > 0 && (
            <span className="ml-2 text-sm text-emerald-400">→ {habit.streak + 1} dias 🎊</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default HabitCard;
