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
    if (isFuture) return 'bg-slate-800/30';
    if (percentage === 100) return 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30';
    if (percentage >= 80) return 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-md shadow-violet-500/20';
    if (percentage >= 50) return 'bg-gradient-to-br from-violet-400 to-purple-500';
    if (percentage >= 1) return 'bg-gradient-to-br from-amber-500 to-orange-500';
    return 'bg-slate-700/50';
  };

  return (
    <div className="neuro-card rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            className="hover:bg-slate-700"
          >
            <ChevronLeft size={24} />
          </Button>
          <h2 className="text-section-title min-w-[200px] text-center capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="hover:bg-slate-700"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="border-slate-600 hover:bg-slate-700"
        >
          <Calendar size={18} className="mr-2" />
          Hoje
        </Button>
      </div>

      {/* Calendar Grid */}
      <div>
        {/* Week Days Headers */}
        <div className="grid grid-cols-7 gap-3 sm:gap-4 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div
              key={day}
              className="text-sm font-semibold text-slate-400 text-center py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-3 sm:gap-4">
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
                      'relative min-h-[48px] sm:min-h-[56px] rounded-xl flex items-center justify-center text-base sm:text-lg font-semibold transition-all duration-200',
                      'hover:scale-105 hover:shadow-xl',
                      dayCell.isFuture ? 'neuro-flat cursor-not-allowed' : dayCell.hasData ? 'neuro-card cursor-pointer' : 'neuro-flat',
                      getCellColor(dayCell.percentage, dayCell.isFuture),
                      dayCell.isToday && 'ring-2 ring-violet-500 shadow-lg shadow-violet-500/50',
                      format(dayCell.date, 'M') !== format(currentMonth, 'M') && 'opacity-40'
                    )}
                  >
                    {/* Mini Progress Ring */}
                    {dayCell.hasData && !dayCell.isFuture && (
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          className="stroke-slate-600/30"
                          strokeWidth="2"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          className={cn(
                            dayCell.percentage === 100 ? 'stroke-emerald-400' : 'stroke-violet-400'
                          )}
                          strokeWidth="2"
                          strokeDasharray={`${(dayCell.percentage / 100) * 100.53} 100.53`}
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    
                    {/* Day Number */}
                    <span className="relative z-10 text-white">
                      {format(dayCell.date, 'd')}
                    </span>
                    
                    {/* Celebration Emoji */}
                    {dayCell.percentage === 100 && !dayCell.isFuture && (
                      <span className="absolute -top-1 -right-1 text-sm animate-bounce">✨</span>
                    )}
                  </button>
                </TooltipTrigger>
                {!dayCell.isFuture && dayCell.hasData && (
                  <TooltipContent className="bg-slate-800 border-slate-700">
                    <div className="space-y-2">
                      <p className="font-semibold capitalize">
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
      <div className="mt-8 pt-6 border-t border-slate-700">
        <p className="text-sm font-semibold text-slate-400 mb-4">Legenda:</p>
        <div className="flex flex-wrap gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-green-600" />
            <span>100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-purple-600" />
            <span>80-99%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-400 to-purple-500" />
            <span>50-79%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-500 to-orange-500" />
            <span>1-49%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-slate-700/50" />
            <span>0%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCalendar;
