import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

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
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
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
            <ChevronLeft size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
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

          return (
            <button
              key={day.toString()}
              onClick={() => onDayClick?.(day)}
              className={cn(
                'min-h-24 p-2 rounded-lg border transition-all hover:border-primary/50',
                !isCurrentMonth && 'opacity-40',
                todayDay && 'ring-2 ring-primary',
                'flex flex-col gap-1'
              )}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-sm font-medium',
                  todayDay && 'text-primary font-bold'
                )}>
                  {format(day, 'd')}
                </span>
                {dayCompletions.length === habits.length && habits.length > 0 && (
                  <span className="text-xs">✨</span>
                )}
              </div>

              {/* Habits Checklist */}
              <div className="flex flex-col gap-0.5 items-start w-full">
                {habits.slice(0, 4).map((habit) => {
                  const Icon = getIconComponent(habit.icon);
                  const isCompleted = isHabitCompletedOnDay(habit.id, day);

                  return (
                    <div
                      key={habit.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (todayDay && !futureDay) {
                          onHabitToggle(habit.id);
                        }
                      }}
                      className={cn(
                        'flex items-center gap-1 text-xs w-full rounded px-1',
                        todayDay && !futureDay && 'cursor-pointer hover:bg-accent/50',
                        futureDay && 'opacity-50 cursor-not-allowed'
                      )}
                      title={habit.title}
                    >
                      {isCompleted ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-muted-foreground">○</span>
                      )}
                      <Icon size={12} className={isCompleted ? 'text-green-500' : 'text-muted-foreground'} />
                      <span className={cn(
                        'truncate flex-1 text-left',
                        isCompleted && 'line-through text-muted-foreground'
                      )}>
                        {habit.title}
                      </span>
                    </div>
                  );
                })}
                {habits.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{habits.length - 4}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="text-green-500">✓</span>
          <span>Completado</span>
        </div>
        <div className="flex items-center gap-1">
          <span>○</span>
          <span>Pendente</span>
        </div>
        <div className="flex items-center gap-1">
          <span>✨</span>
          <span>Todos completados</span>
        </div>
      </div>
    </Card>
  );
};
