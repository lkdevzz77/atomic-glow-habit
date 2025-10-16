import React from "react";
import { Habit } from "@/types/habit";
import { cn } from "@/lib/utils";

interface WeeklyChecklistProps {
  habits: Habit[];
}

const WeeklyChecklist = ({ habits }: WeeklyChecklistProps) => {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  const generateWeekData = (habit: Habit) => {
    return days.map((day, index) => {
      if (index < todayIndex) {
        const completed = Math.random() > 0.2;
        const partial = !completed && Math.random() > 0.5;
        return {
          day,
          status: completed ? "completed" : partial ? "partial" : "missed",
        };
      } else if (index === todayIndex) {
        return {
          day,
          status: habit.status === "completed" ? "completed" : "pending",
        };
      } else {
        return {
          day,
          status: "future",
        };
      }
    });
  };

  const calculateRate = (weekData: ReturnType<typeof generateWeekData>) => {
    const completed = weekData.filter((d) => d.status === "completed").length;
    const partial = weekData.filter((d) => d.status === "partial").length;
    const total = todayIndex + 1;
    return Math.round(((completed + partial * 0.5) / total) * 100);
  };

  const getRateColor = (rate: number) => {
    if (rate >= 80) return "text-violet-400";
    if (rate >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="text-violet-500 text-xl drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]">✓</span>;
      case "partial":
        return <span className="text-amber-500 text-xl">◐</span>;
      case "missed":
        return <span className="text-slate-600 text-xl">○</span>;
      case "future":
        return <span className="text-slate-700 text-xl opacity-30">○</span>;
      default:
        return <span className="text-slate-700 text-xl">○</span>;
    }
  };

  const totalCompleted = habits.reduce((sum, habit) => {
    const weekData = generateWeekData(habit);
    return sum + weekData.filter((d) => d.status === "completed").length;
  }, 0);

  const totalPossible = habits.length * (todayIndex + 1);
  const overallRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  return (
    <div className="glass rounded-2xl p-6 md:p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-50 mb-6">📋 Checklist Semanal</h2>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="grid grid-cols-[200px_repeat(7,1fr)_80px] gap-2 mb-3 pb-3 border-b border-slate-700">
            <div className="text-xs font-medium text-slate-400"></div>
            {days.map((day, index) => (
              <div
                key={day}
                className={cn(
                  "text-xs font-medium text-center",
                  index === todayIndex ? "text-violet-400" : "text-slate-400"
                )}
              >
                {day}
              </div>
            ))}
            <div className="text-xs font-medium text-slate-400 text-right">Taxa</div>
          </div>

          {/* Habit Rows */}
          {habits.map((habit) => {
            const weekData = generateWeekData(habit);
            const rate = calculateRate(weekData);

            return (
              <div
                key={habit.id}
                className="grid grid-cols-[200px_repeat(7,1fr)_80px] gap-2 py-3 hover:bg-slate-700/30 rounded-lg transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{habit.icon}</span>
                  <span className="text-sm font-medium text-slate-200 truncate">
                    {habit.title}
                  </span>
                </div>

                {weekData.map((cell, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center transition-transform hover:scale-125 cursor-pointer"
                    title={`${cell.day}: ${
                      cell.status === "completed"
                        ? "Completado"
                        : cell.status === "partial"
                        ? "Parcial"
                        : cell.status === "missed"
                        ? "Não feito"
                        : "Futuro"
                    }`}
                  >
                    {getStatusIcon(cell.status)}
                  </div>
                ))}

                <div className={cn("text-sm font-semibold text-right", getRateColor(rate))}>
                  {rate}%
                </div>
              </div>
            );
          })}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-600 bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-300">Total:</span>
              <span className="text-sm font-semibold text-slate-300">
                {totalCompleted}/{totalPossible} ({overallRate}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
                style={{ width: `${overallRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChecklist;
