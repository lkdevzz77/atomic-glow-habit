import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isFuture, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
  id: number;
  habit_id: number;
  date: string;
  completed_at: string;
  percentage: number;
}

interface DayCell {
  date: Date;
  habitsCompleted: number;
  habitsTotal: number;
  percentage: number;
  isToday: boolean;
  isFuture: boolean;
  hasData: boolean;
  completions: Completion[];
}

interface HabitCalendarProps {
  habits: Habit[];
  completions: Completion[];
  onDayClick?: (date: Date, dayData: DayCell) => void;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ habits, completions, onDayClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    return days.map((date): DayCell => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayCompletions = completions.filter(c => c.date === dateStr);
      const uniqueHabits = new Set(dayCompletions.map(c => c.habit_id));
      
      return {
        date,
        habitsCompleted: uniqueHabits.size,
        habitsTotal: habits.length,
        percentage: habits.length > 0 ? (uniqueHabits.size / habits.length) * 100 : 0,
        isToday: isToday(date),
        isFuture: isFuture(date),
        hasData: dayCompletions.length > 0,
        completions: dayCompletions,
      };
    });
  }, [currentMonth, habits, completions]);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const getCellColor = (percentage: number, isFuture: boolean) => {
    if (isFuture) return 'bg-slate-800 opacity-30';
    if (percentage === 100) return 'bg-violet-600 shadow-lg shadow-violet-500/50';
    if (percentage >= 80) return 'bg-violet-500';
    if (percentage >= 50) return 'bg-violet-400';
    if (percentage >= 1) return 'bg-amber-500';
    return 'bg-slate-700';
  };

  return (
    <div className="glass rounded-2xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            className="hover:bg-slate-700"
          >
            <ChevronLeft size={20} />
          </Button>
          <h2 className="text-xl font-semibold text-slate-200 min-w-[200px] text-center">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="hover:bg-slate-700"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="border-slate-600 hover:bg-slate-700"
        >
          <Calendar size={16} className="mr-2" />
          Hoje
        </Button>
      </div>

      {/* Calendar Grid */}
      <div>
        {/* Week Days Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div
              key={day}
              className="text-xs font-semibold text-slate-400 text-center py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayCell, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onDayClick?.(dayCell.date, dayCell)}
                    onMouseEnter={() => setHoveredDate(dayCell.date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    disabled={dayCell.isFuture}
                    className={cn(
                      'h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all',
                      'hover:scale-105 hover:shadow-lg',
                      getCellColor(dayCell.percentage, dayCell.isFuture),
                      dayCell.isToday && 'ring-2 ring-blue-400',
                      dayCell.isFuture && 'cursor-not-allowed',
                      !dayCell.isFuture && 'cursor-pointer',
                      format(dayCell.date, 'M') !== format(currentMonth, 'M') && 'opacity-50'
                    )}
                  >
                    <span className="text-white">
                      {format(dayCell.date, 'd')}
                    </span>
                  </button>
                </TooltipTrigger>
                {!dayCell.isFuture && dayCell.hasData && (
                  <TooltipContent className="bg-slate-800 border-slate-700">
                    <div className="space-y-2">
                      <p className="font-semibold">
                        {format(dayCell.date, "EEEE, d 'de' MMMM", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-slate-300">
                        {dayCell.habitsCompleted}/{dayCell.habitsTotal} hábitos ({Math.round(dayCell.percentage)}%)
                      </p>
                      <div className="text-xs text-slate-400 space-y-1 mt-2 pt-2 border-t border-slate-700">
                        {dayCell.completions.slice(0, 3).map((completion) => {
                          const habit = habits.find(h => h.id === completion.habit_id);
                          return habit ? (
                            <div key={completion.id} className="flex items-center gap-1">
                              <span>✓</span>
                              <span>{habit.title}</span>
                            </div>
                          ) : null;
                        })}
                        {dayCell.completions.length > 3 && (
                          <p className="text-slate-500">+{dayCell.completions.length - 3} mais...</p>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <p className="text-xs font-semibold text-slate-400 mb-3">Legenda:</p>
        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-violet-600" />
            <span>100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-violet-400" />
            <span>50-99%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span>1-49%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-700" />
            <span>0%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCalendar;
