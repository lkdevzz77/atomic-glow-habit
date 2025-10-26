import React from 'react';
import { format, isToday, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getIconComponent } from '@/config/icon-map';
import { Check } from 'lucide-react';

interface Habit {
  id: number;
  title: string;
  icon: string;
}

interface Completion {
  habit_id: number;
  date: string;
  percentage: number;
}

interface DayCardProps {
  date: Date;
  habits: Habit[];
  completions: Completion[];
}

export const DayCard = ({ date, habits, completions }: DayCardProps) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const isDayToday = isToday(date);
  const isDayFuture = isFuture(date);
  
  // Get completions for this specific day
  const dayCompletions = completions.filter(c => c.date === dateStr);
  const completedHabitIds = new Set(
    dayCompletions
      .filter(c => c.percentage >= 100)
      .map(c => c.habit_id)
  );
  
  const completedCount = completedHabitIds.size;
  const totalHabits = habits.length;
  const percentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;
  const is100Percent = percentage === 100 && totalHabits > 0;

  return (
    <div
      className={cn(
        "w-[280px] flex-shrink-0 snap-center rounded-xl border p-4 transition-all",
        is100Percent && "bg-gradient-to-br from-primary/20 to-purple-600/20 border-primary/50 shadow-lg shadow-primary/30 ring-2 ring-primary/40",
        !is100Percent && percentage > 0 && "bg-card/50 border-primary/30",
        !is100Percent && percentage === 0 && "bg-card/30 border-border/50",
        isDayFuture && "opacity-40 pointer-events-none",
        isDayToday && !is100Percent && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {format(date, 'EEE', { locale: ptBR })}
          </div>
          <div className="text-3xl font-bold text-foreground">
            {format(date, 'd')}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDayToday && (
            <div className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
              Hoje
            </div>
          )}
          {is100Percent && (
            <div className="text-2xl animate-bounce">🎉</div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-muted/30 rounded-full overflow-hidden mb-4">
        <div 
          className={cn(
            "h-full transition-all duration-500",
            is100Percent 
              ? "bg-gradient-to-r from-primary to-purple-600" 
              : "bg-gradient-to-r from-primary/80 to-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Habits List */}
      <div className="space-y-2 mb-3">
        {habits.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            Nenhum hábito ativo
          </div>
        ) : (
          habits.map(habit => {
            const isCompleted = completedHabitIds.has(habit.id);
            const Icon = getIconComponent(habit.icon);
            
            return (
              <div 
                key={habit.id}
                className={cn(
                  "flex items-center gap-2.5 p-2 rounded-lg transition-all",
                  isCompleted 
                    ? "bg-emerald-500/10 border border-emerald-500/30" 
                    : "bg-muted/20 border border-border/30"
                )}
              >
                {/* Status icon */}
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                  isCompleted 
                    ? "bg-emerald-500 text-white" 
                    : "bg-muted border-2 border-border"
                )}>
                  {isCompleted ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                
                {/* Habit icon */}
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center",
                  isCompleted ? "bg-emerald-500/20" : "bg-muted/50"
                )}>
                  <Icon className={cn(
                    "w-4 h-4",
                    isCompleted ? "text-emerald-500" : "text-muted-foreground"
                  )} />
                </div>
                
                {/* Habit title */}
                <span className={cn(
                  "text-sm font-medium flex-1",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {habit.title}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {totalHabits > 0 && (
        <div className="pt-2 border-t border-border/30">
          <div className="text-xs text-muted-foreground text-center">
            <span className={cn(
              "font-semibold",
              is100Percent ? "text-emerald-500" : "text-foreground"
            )}>
              {completedCount}/{totalHabits}
            </span>
            {" completados"}
            {is100Percent && " ✨"}
          </div>
        </div>
      )}
    </div>
  );
};
