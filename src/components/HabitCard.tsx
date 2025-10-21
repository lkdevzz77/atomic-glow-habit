import React from "react";
import { Check, Clock } from "lucide-react";
import { Habit } from "@/types/habit";
import { useHabits } from "@/hooks/useHabits";
import { cn } from "@/lib/utils";
import { Icon } from "@/config/icon-map";
import { SkeletonCard } from "./LoadingStates";
import { triggerHabitConfetti } from "@/utils/confettiAnimation";
import { supabase } from "@/integrations/supabase/client";

interface HabitCardProps {
  habit: Habit;
  isLoading?: boolean;
}

const HabitCard = ({ habit, isLoading }: HabitCardProps) => {
  const { completeHabit, isCompleting } = useHabits();

  if (isLoading) {
    return <SkeletonCard />;
  }

  const isCompleted = habit.completedToday || false; // ⚡ FASE 1: Usar completedToday
  const progress = habit.goal_target > 0 ? (habit.goal_current / habit.goal_target) * 100 : 0;

  const handleComplete = async () => {
    if (isCompleted) {
      return;
    }
    
    // ⚡ FASE 4: Validação dupla antes de completar
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from('habit_completions')
      .select('id')
      .eq('habit_id', habit.id)
      .eq('date', today)
      .gte('percentage', 100)
      .maybeSingle();
    
    if (existing) {
      console.warn('⚠️ Hábito já completado detectado na validação');
      return;
    }
    
    completeHabit({
      habitId: habit.id,
      percentage: 100,
      habitTitle: habit.title
    });

    // Trigger confetti animation
    triggerHabitConfetti();
  };

  return (
    <div
      className={cn(
        "glass card-rounded card-padding transition-all duration-300 hover-scale-sm",
        isCompleted 
          ? "border-2 border-violet-500/70 bg-gradient-to-br from-violet-900/30 to-slate-800/90 shadow-xl shadow-violet-500/30" 
          : "border-2 border-slate-700/80 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/15"
      )}
    >
      <div className="flex items-start gap-3 mb-3 sm:mb-4">
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg">
          <Icon
            name={habit.icon as any}
            size={20}
            className="text-white"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold heading-sub text-slate-50 mb-1 truncate">{habit.title}</h3>
          <div className="space-y-1 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-2 text-xs sm:text-sm text-slate-300/70">
            <span className="block sm:inline">⏰ {habit.when_time}</span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span className="block sm:inline">📍 {habit.where_location}</span>
            {habit.trigger_activity && (
              <>
                <span className="hidden sm:inline text-slate-600">·</span>
                <span className="block sm:inline">⚡ Após {habit.trigger_activity}</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={cn(
            "flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200",
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
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-400 font-semibold flex items-center gap-2">
                ✨ Completado
              </span>
              <span className="text-accent font-bold flex items-center gap-1">
                +1 voto
              </span>
            </div>
            {habit.last_completed && (
              <div className="flex items-center gap-1 text-xs text-slate-400/60">
                <Clock className="w-3 h-3" />
                {new Date(habit.last_completed).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Meta: {habit.goal_current}/{habit.goal_target} {habit.goal_unit}</span>
            <span className="text-slate-400/60">{Math.round(progress)}%</span>
          </div>
        )}

        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out",
              isCompleted 
                ? "bg-gradient-to-r from-violet-600 to-purple-600" 
                : "bg-slate-600"
            )}
            style={{ width: `${isCompleted ? 100 : progress}%` }}
          />
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/80">
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
