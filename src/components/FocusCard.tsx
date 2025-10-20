import React from "react";
import { Icon } from "@/config/icon-map";
import { Habit } from "@/types/habit";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusCardProps {
  habit: Habit;
  onComplete: () => void;
  isCompleting?: boolean;
}

const FocusCard: React.FC<FocusCardProps> = ({ habit, onComplete, isCompleting }) => {
  const progress = habit.goal_target > 0 ? (habit.goal_current / habit.goal_target) * 100 : 0;

  return (
    <div className="glass p-8 sm:p-12 rounded-3xl border border-slate-700 space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
          <Icon name={habit.icon as any} size={48} className="text-white" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 text-center tracking-tight">
        {habit.title}
      </h2>

      {/* Metadata */}
      <div className="flex items-center justify-center gap-2 text-base text-slate-400 flex-wrap">
        <span>{habit.goal_target} {habit.goal_unit}</span>
        <span>•</span>
        <span>{habit.where_location}</span>
        <span>•</span>
        <span>{habit.when_time}</span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-slate-300">
          <span>Progresso</span>
          <span className="font-semibold">{habit.goal_current}/{habit.goal_target} {habit.goal_unit}</span>
        </div>
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onComplete}
        disabled={isCompleting}
        className={cn(
          "w-full py-6 text-xl font-semibold rounded-2xl transition-all duration-200",
          "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700",
          "text-white shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 hover:scale-[1.02]",
          isCompleting && "opacity-50 cursor-not-allowed"
        )}
      >
        {isCompleting ? "Marcando..." : "Marcar como Feito"}
      </button>

      {/* Streak */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <Flame className="w-5 h-5 text-orange-400" />
        <span className="text-slate-300">
          Streak: <span className="font-bold text-orange-400">{habit.streak} dias</span>
        </span>
      </div>
    </div>
  );
};

export default FocusCard;