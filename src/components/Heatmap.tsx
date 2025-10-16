import React from "react";
import { Habit } from "@/types/habit";
import { cn } from "@/lib/utils";

interface HeatmapProps {
  habits: Habit[];
}

const Heatmap = ({ habits }: HeatmapProps) => {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todayIndex = today === 0 ? 6 : today - 1; // Convert to Monday = 0

  // Generate mock data for the week
  const generateWeekData = (habit: Habit) => {
    return days.map((day, index) => {
      if (index < todayIndex) {
        // Past days - random completion
        const completed = Math.random() > 0.2;
        return {
          day,
          status: completed ? "completed" : "missed",
          percentage: completed ? 100 : 0,
        };
      } else if (index === todayIndex) {
        // Today
        return {
          day,
          status: habit.status === "completed" ? "completed" : "pending",
          percentage: habit.status === "completed" ? 100 : 0,
        };
      } else {
        // Future days
        return {
          day,
          status: "future",
          percentage: 0,
        };
      }
    });
  };

  return (
    <div className="glass rounded-2xl p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-50 mb-6">
        Progresso dos últimos 7 dias
      </h2>

      <div className="space-y-6">
        {habits.map((habit, habitIndex) => (
          <div key={habit.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-xl">
                {habitIndex === 0 ? "📚" : habitIndex === 1 ? "💪" : "💧"}
              </div>
              <span className="text-slate-200 font-medium">{habit.title}</span>
            </div>

            <div className="flex gap-2">
              {generateWeekData(habit).map((cell, index) => (
                <div key={index} className="flex-1">
                  <div
                    className={cn(
                      "aspect-square rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer group relative",
                      cell.status === "completed" && "bg-violet-500 shadow-lg shadow-violet-500/50",
                      cell.status === "missed" && "bg-slate-700",
                      cell.status === "pending" && "bg-amber-500/80",
                      cell.status === "future" && "bg-slate-700/30 opacity-50"
                    )}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-violet-500/50 rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      <div className="text-xs text-slate-50 font-medium">{cell.day}</div>
                      <div className="text-xs text-slate-300">
                        {cell.status === "completed" && "✓ Completado"}
                        {cell.status === "missed" && "✗ Não feito"}
                        {cell.status === "pending" && "⏳ Pendente"}
                        {cell.status === "future" && "Futuro"}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-center text-slate-400 mt-1">{cell.day}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
