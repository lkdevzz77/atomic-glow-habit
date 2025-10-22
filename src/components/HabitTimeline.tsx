import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, isSameDay, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/utils/haptics';
import * as LucideIcons from 'lucide-react';
import { Skeleton } from './ui/skeleton';
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

interface HabitTimelineProps {
  habits: Habit[];
  completions: Completion[];
  onHabitToggle: (habitId: number) => void;
  onDayClick?: (date: Date) => void;
}

const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Circle;
};

export const HabitTimeline: React.FC<HabitTimelineProps> = ({
  habits,
  completions,
  onHabitToggle,
  onDayClick,
}) => {
  const [centerDate, setCenterDate] = useState(new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular loading inicial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Gerar 14 dias (7 antes e 7 depois da data central)
  const visibleDays = Array.from({ length: 14 }, (_, i) => {
    return addDays(centerDate, i - 7);
  });

  const isHabitCompletedOnDay = (habitId: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return completions.some(c => c.habit_id === habitId && c.date === dateStr && c.percentage >= 100);
  };

  const getDayCompletionPercentage = (date: Date) => {
    const completedCount = habits.filter(h => isHabitCompletedOnDay(h.id, date)).length;
    return habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  };

  const goToToday = () => {
    setCenterDate(new Date());
    triggerHaptic('medium');
    
    // Scroll suave para o centro
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 120 + 12; // width + gap
      const scrollPosition = (7 * cardWidth) - (container.offsetWidth / 2) + (cardWidth / 2);
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };

  const scrollToNext = () => {
    setCenterDate(addDays(centerDate, 7));
    triggerHaptic('light');
  };

  const scrollToPrev = () => {
    setCenterDate(subDays(centerDate, 7));
    triggerHaptic('light');
  };

  const isToday = (date: Date) => isSameDay(startOfDay(date), startOfDay(new Date()));
  const isPast = (date: Date) => startOfDay(date) < startOfDay(new Date()) && !isToday(date);
  const isFuture = (date: Date) => startOfDay(date) > startOfDay(new Date());

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="min-w-[120px] h-[140px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToPrev}
            className="h-8 w-8"
          >
            <ChevronLeft size={20} />
          </Button>
          <h3 className="text-lg font-semibold">
            {format(centerDate, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToNext}
            className="h-8 w-8"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="h-8"
        >
          Hoje
        </Button>
      </div>

      {/* Timeline horizontal scrollável */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ 
          scrollPaddingLeft: '1rem',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {visibleDays.map((day, index) => {
          const todayDay = isToday(day);
          const pastDay = isPast(day);
          const futureDay = isFuture(day);
          const percentage = getDayCompletionPercentage(day);
          const completedHabits = habits.filter(h => isHabitCompletedOnDay(h.id, day));

          return (
            <button
              key={index}
              onClick={() => {
                onDayClick?.(day);
                triggerHaptic('light');
              }}
              className={cn(
                'min-w-[120px] h-[140px] rounded-xl p-3 snap-center',
                'flex flex-col gap-2 transition-all duration-200',
                'touch-manipulation',
                futureDay ? 'neuro-flat cursor-not-allowed' : 'neuro-card cursor-pointer active:scale-95',
                todayDay && !futureDay && 'ring-2 ring-primary/40 ring-offset-2 ring-offset-background',
                percentage === 100 && !futureDay && 'neuro-highlight'
              )}
              style={percentage === 100 && !futureDay ? { boxShadow: 'var(--shadow-emerald-glow)' } : undefined}
            >
              {/* Data e dia da semana */}
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs text-muted-foreground uppercase">
                  {format(day, 'EEE', { locale: ptBR })}
                </span>
                <span className={cn(
                  'text-2xl font-bold',
                  todayDay && 'text-primary'
                )}>
                  {format(day, 'd')}
                </span>
              </div>

              {/* Barra de progresso */}
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-300 rounded-full",
                    percentage === 100 ? "bg-gradient-to-r from-emerald-500 to-green-600" : "bg-gradient-to-r from-violet-500 to-purple-600"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Percentual */}
              <div className="text-xs font-semibold text-center">
                {percentage}%
              </div>

              {/* Ícones dos hábitos */}
              <div className="flex flex-wrap gap-1 justify-center items-center flex-1">
                {habits.slice(0, 6).map((habit) => {
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
                                triggerHaptic('medium');
                              }
                            }}
                            className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200',
                              'min-h-[20px] min-w-[20px]', // Touch target
                              todayDay && !futureDay && 'cursor-pointer active:scale-110',
                              futureDay && 'opacity-40 cursor-not-allowed',
                              isCompleted 
                                ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm' 
                                : 'bg-muted border border-border'
                            )}
                          >
                            <Icon size={10} className={isCompleted ? 'text-white' : 'text-muted-foreground'} />
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
                {habits.length > 6 && (
                  <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center">
                    <span className="text-[8px] font-medium text-muted-foreground">
                      +{habits.length - 6}
                    </span>
                  </div>
                )}
              </div>

              {/* Emoji de celebração */}
              {percentage === 100 && !futureDay && (
                <div className="text-center text-sm animate-bounce">
                  ✨
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-green-600" />
          <span>Completado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-muted border border-border" />
          <span>Pendente</span>
        </div>
      </div>
    </div>
  );
};