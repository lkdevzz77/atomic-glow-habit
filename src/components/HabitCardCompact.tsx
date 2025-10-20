import React from "react";
import { Icon } from "@/config/icon-map";
import { Habit } from "@/types/habit";
import { Flame, CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardCompactProps {
  habit: Habit;
  onComplete?: () => void;
  showCheckbox?: boolean;
}

const HabitCardCompact: React.FC<HabitCardCompactProps> = ({ 
  habit, 
  onComplete,
  showCheckbox = false 
}) => {
  const isCompleted = habit.status === "completed";
  const progress = habit.goal_target > 0 ? (habit.goal_current / habit.goal_target) * 100 : 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        isCompleted 
          ? "bg-violet-900/30 opacity-60" 
          : "bg-slate-800/50 hover:bg-slate-700/30 hover:scale-[1.01]"
      )}
    >
      {/* Checkbox (optional) */}
      {showCheckbox && (
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className="flex-shrink-0"
        >
          {isCompleted ? (
            <CheckSquare className="w-6 h-6 text-violet-400" />
          ) : (
            <Square className="w-6 h-6 text-slate-500 hover:text-violet-400 transition-colors" />
          )}
        </button>
      )}

      {/* Icon */}
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
        isCompleted ? "bg-slate-700/50" : "bg-violet-600/20"
      )}>
        <Icon 
          name={habit.icon as any} 
          size={20} 
          className={isCompleted ? "text-slate-400" : "text-violet-400"} 
        />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "text-sm font-semibold truncate",
          isCompleted ? "text-slate-400 line-through" : "text-slate-200"
        )}>
          {habit.title}
        </h3>
      </div>

      {/* Metadata */}
      <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
        <span>{habit.where_location}</span>
        <span>•</span>
        <span>{habit.when_time}</span>
      </div>

      {/* Progress */}
      <div className="flex-shrink-0 text-sm font-semibold text-slate-300">
        {habit.goal_current}/{habit.goal_target}
      </div>

      {/* Streak */}
      {habit.streak > 0 && (
        <div className="flex-shrink-0 flex items-center gap-1 text-xs text-orange-400">
          <Flame className="w-4 h-4" />
          <span>{habit.streak}d</span>
        </div>
      )}
    </div>
  );
};

export default HabitCardCompact;