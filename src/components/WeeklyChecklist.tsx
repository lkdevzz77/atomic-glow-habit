import React from "react";
import { Habit } from "@/types/habit";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useWeeklyData } from "@/hooks/useWeeklyData";

interface WeeklyChecklistProps {
  habits: Habit[];
}

const WeeklyChecklist = ({ habits }: WeeklyChecklistProps) => {
  const { data, isLoading } = useWeeklyData();

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || !habits.length) return null;

  const days = data.days;
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Circle;
  };

  // Calculate completion map from weekly data
  const completionsMap: Record<number, Record<string, boolean>> = {};
  data.completions.forEach((completion) => {
    if (!completionsMap[completion.habit_id]) {
      completionsMap[completion.habit_id] = {};
    }
    completionsMap[completion.habit_id][completion.date] = completion.percentage >= 100;
  });

  const totalCompleted = days.slice(0, todayIndex + 1).reduce((sum, day) => sum + day.completed, 0);
  const totalPossible = habits.length * (todayIndex + 1);
  const overallRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 animate-fade-in">
      <h2 className="text-xl sm:text-2xl font-bold heading-section text-slate-50 mb-4 sm:mb-6">📋 Visão Semanal</h2>

      {/* Compact grid view */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((day, index) => {
          const dayHabits = habits.map(h => {
            const IconComponent = getIconComponent(h.icon);
            return {
              ...h,
              IconComponent,
              completed: completionsMap[h.id]?.[day.date] || false
            };
          });

          const completed = day.completed;
          const percentage = day.percentage;

          return (
            <motion.div
              key={day.date}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "p-3 rounded-xl border-2 cursor-pointer transition-all",
                day.isToday && "border-violet-500 bg-violet-900/20",
                percentage >= 80 && !day.isToday && "border-emerald-500/50 bg-emerald-900/10",
                percentage < 80 && percentage > 0 && !day.isToday && "border-amber-500/50 bg-amber-900/10",
                percentage === 0 && !day.isToday && "border-slate-700 opacity-50"
              )}
            >
              <div className="text-center">
                <div className="text-xs text-slate-400 mb-1">{day.day}</div>
                <div className="text-2xl font-bold text-slate-100 mb-2">
                  {completed}/{habits.length}
                </div>

                {/* Mini progress ring */}
                <div className="relative w-10 h-10 mx-auto mb-2">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="text-slate-700"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 16}`}
                      strokeDashoffset={`${2 * Math.PI * 16 * (1 - percentage / 100)}`}
                      className={cn(
                        "transition-all duration-500",
                        percentage >= 80 ? "text-emerald-500" : percentage >= 50 ? "text-violet-500" : percentage > 0 ? "text-amber-500" : "text-slate-600"
                      )}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-300">{percentage}%</span>
                  </div>
                </div>

                {/* Habit icons */}
                <div className="flex justify-center gap-1 flex-wrap">
                  {dayHabits.map(h => (
                    <h.IconComponent
                      key={h.id}
                      className={cn(
                        "w-3 h-3",
                        h.completed ? "text-violet-400" : "text-slate-600"
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="pt-4 border-t border-slate-600 bg-slate-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-300">Progresso Total da Semana:</span>
          <span className="text-sm font-semibold text-slate-300">
            {totalCompleted}/{totalPossible} ({overallRate}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${overallRate}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyChecklist;
