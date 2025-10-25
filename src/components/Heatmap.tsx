import React from "react";
import { Habit } from "@/types/habit";
import { cn } from "@/lib/utils";

interface HeatmapProps {
  habits: Habit[];
}

const Heatmap = ({ habits }: HeatmapProps) => {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  // Generate week data
  const generateWeekData = (habit: Habit) => {
    return days.map((day, index) => {
      if (index < todayIndex) {
        const completed = Math.random() > 0.2;
        return {
          day,
          status: completed ? "completed" : "missed",
          percentage: completed ? 100 : 0,
        };
      } else if (index === todayIndex) {
        const isFullyCompleted = habit.completedToday;
        return {
          day,
          status: isFullyCompleted ? "completed-100" : habit.completedToday ? "completed" : "pending",
          percentage: habit.completedToday ? 100 : 0,
        };
      } else {
        return {
          day,
          status: "future",
          percentage: 0,
        };
      }
    });
  };

  return (
    <div className="neuro-card rounded-2xl p-4 sm:p-6 animate-fade-in">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
        Progresso dos últimos 7 dias
      </h2>

      {/* Mobile: Scroll horizontal */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[500px] sm:min-w-0 space-y-6">
          {habits.map((habit, habitIndex) => (
            <div key={habit.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xl">
                  {habitIndex === 0 ? "📚" : habitIndex === 1 ? "💪" : "💧"}
                </div>
                <span className="text-foreground font-medium text-sm sm:text-base">{habit.title}</span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {generateWeekData(habit).map((cell, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "w-full aspect-square rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer group relative",
                        // FEEDBACK VISUAL ESPECIAL para 100% completo
                        cell.status === "completed-100" && "bg-primary animate-pulse shadow-lg shadow-primary/50",
                        cell.status === "completed" && "bg-primary/80 shadow-md shadow-primary/30",
                        cell.status === "missed" && "bg-muted/50",
                        cell.status === "pending" && "bg-amber-500/80",
                        cell.status === "future" && "bg-muted/20 opacity-50"
                      )}
                    >
                      {/* GLOW EFFECT para dia 100% */}
                      {cell.status === "completed-100" && (
                        <div className="absolute inset-0 bg-primary/50 blur-xl rounded-lg animate-pulse" />
                      )}

                      {/* Tooltip */}
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        <div className="text-xs text-popover-foreground font-medium">{cell.day}</div>
                        <div className="text-xs text-muted-foreground">
                          {cell.status === "completed-100" && "🎉 100% Completado!"}
                          {cell.status === "completed" && "✓ Completado"}
                          {cell.status === "missed" && "✗ Não feito"}
                          {cell.status === "pending" && "⏳ Pendente"}
                          {cell.status === "future" && "Futuro"}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-center text-muted-foreground">{cell.day}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
