import React from "react";
import { Check } from "lucide-react";
import { Habit } from "@/types/habit";
import { useHabits } from "@/hooks/useHabits";
import { cn } from "@/lib/utils";
import { Icon } from "@/config/icon-map";
import { SkeletonCard } from "./LoadingStates";
import confetti from "canvas-confetti";

interface HabitCardProps {
  habit: Habit;
  isLoading?: boolean;
}

const HabitCard = ({ habit, isLoading }: HabitCardProps) => {
  const { completeHabit, isCompleting } = useHabits();

  if (isLoading) {
    return <SkeletonCard />;
  }

  const isCompleted = habit.status === "completed";
  const progress = habit.goal_target > 0 ? (habit.goal_current / habit.goal_target) * 100 : 0;

  const handleComplete = () => {
    if (isCompleted) return;
    
    completeHabit({
      habitId: habit.id,
      percentage: 100,
      habitTitle: habit.title
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
    <div
      className={cn(
        "glass rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover-scale-sm",
        isCompleted 
          ? "border-2 border-violet-500 bg-gradient-to-br from-violet-900/30 to-slate-800/90 shadow-xl shadow-violet-500/30" 
          : "border-2 border-slate-700 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20"
      )}
    >
      <div className="flex items-start gap-3 mb-3 sm:mb-4">
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg">
          <Icon
            name={habit.icon as any}
            size={24}
            className="text-white"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-xl font-bold heading-sub text-slate-50 mb-1 truncate">{habit.title}</h3>
          <div className="space-y-1 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-2 text-xs sm:text-sm text-slate-400">
            <span className="block sm:inline">⏰ {habit.when_time}</span>
            <span className="hidden sm:inline">·</span>
            <span className="block sm:inline">📍 {habit.where_location}</span>
            {habit.trigger_activity && (
              <>
                <span className="hidden sm:inline">·</span>
                <span className="block sm:inline">⚡ Após {habit.trigger_activity}</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={cn(
            "flex-shrink-0 w-10 h-10 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            isCompleted
              ? "bg-violet-600 border-violet-500 shadow-lg shadow-violet-500/50"
              : "border-slate-600 hover:border-violet-500 hover:scale-110",
            isCompleting && "animate-scale-in"
          )}
        >
          {isCompleted && <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        {isCompleted ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-400 font-semibold flex items-center gap-2">
              ✨ Completado
              {habit.last_completed && new Date(habit.last_completed).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
              <span className="text-accent font-bold flex items-center gap-1">
                +1 voto de identidade
              </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Meta: {habit.goal_current}/{habit.goal_target} {habit.goal_unit}</span>
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
