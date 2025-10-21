import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

interface NotionCalendarProps {
  habits: Habit[];
  completions: Completion[];
  onHabitToggle: (habitId: number) => void;
  onDayClick?: (date: Date) => void;
}

const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Circle;
};

export const NotionCalendar: React.FC<NotionCalendarProps> = ({
  habits,
  completions,
  onHabitToggle,
  onDayClick,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getCompletionsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return completions.filter(c => c.date === dateStr);
  };

  const isHabitCompletedOnDay = (habitId: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return completions.some(c => c.habit_id === habitId && c.date === dateStr && c.percentage >= 100);
  };

  const isToday = (date: Date) => isSameDay(date, new Date());
  const isPast = (date: Date) => date < new Date() && !isToday(date);
  const isFuture = (date: Date) => date > new Date();

  return (
    <div className="card-padding neuro-card rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-section-title capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Hoje
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight size={24} />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3 sm:gap-4">
        {/* Day Headers */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((day) => {
          const dayCompletions = getCompletionsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const todayDay = isToday(day);
          const pastDay = isPast(day);
          const futureDay = isFuture(day);
          const completedCount = habits.filter(h => isHabitCompletedOnDay(h.id, day)).length;
          const percentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

          return (
            <button
              key={day.toString()}
              onClick={() => onDayClick?.(day)}
              className={cn(
                'relative min-h-28 sm:min-h-32 p-3 sm:p-4 rounded-xl transition-all duration-200',
                !isCurrentMonth && 'opacity-40',
                futureDay ? 'neuro-flat cursor-not-allowed' : 'neuro-card cursor-pointer',
                todayDay && !futureDay && 'ring-2 ring-violet-400/40 ring-offset-2 ring-offset-background/50',
                percentage === 100 && !futureDay && 'neuro-highlight',
                'flex flex-col gap-2'
              )}
              style={percentage === 100 && !futureDay ? { boxShadow: 'var(--shadow-emerald-glow)' } : undefined}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-base sm:text-lg font-semibold',
                  todayDay && 'text-primary font-bold'
                )}>
                  {format(day, 'd')}
                </span>
                {percentage === 100 && habits.length > 0 && !futureDay && (
                  <span className="text-base animate-bounce">✨</span>
                )}
              </div>

              {/* Habits Dots with Tooltips */}
              <div className="flex flex-wrap gap-1.5 items-start w-full">
                {habits.slice(0, 8).map((habit) => {
                  const Icon = getIconComponent(habit.icon);
                  const isCompleted = isHabitCompletedOnDay(habit.id, day);

                  return (
                    <TooltipProvider key={habit.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              if (todayDay && !futureDay) {
                                onHabitToggle(habit.id);
                              }
                            }}
                            className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200',
                              todayDay && !futureDay && 'cursor-pointer hover:scale-125',
                              futureDay && 'opacity-50 cursor-not-allowed',
                              isCompleted 
                                ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-md shadow-emerald-500/30' 
                                : 'bg-slate-700/50 border border-slate-600'
                            )}
                          >
                            <Icon size={12} className={isCompleted ? 'text-white' : 'text-muted-foreground'} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs font-medium">{habit.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {isCompleted ? 'Completado ✓' : 'Pendente'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
                {habits.length > 8 && (
                  <div className="w-6 h-6 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      +{habits.length - 8}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-green-600" />
          <span>Completado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-slate-700/50 border border-slate-600" />
          <span>Pendente</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base">✨</span>
          <span>Todos completados</span>
        </div>
      </div>
    </div>
  );
};
