import React from 'react';
import { Habit } from '@/types/habit';
import { format, subDays, isToday as dateIsToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import * as LucideIcons from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HabitsTimelineProps {
  habits: Habit[];
  completions: any[];
  days?: number;
  compact?: boolean;
}

const HabitsTimeline = ({ habits, completions, days = 14, compact = false }: HabitsTimelineProps) => {
  const isMobile = useIsMobile();

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Circle;
  };

  // Gerar array de datas
  const timelineDays = Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayCompletions = completions.filter((c) => c.date === dateStr);

    return {
      date,
      dateStr,
      dayCompletions,
      isToday: dateIsToday(date),
    };
  });

  const iconSize = compact ? (isMobile ? 8 : 10) : 10;

  return (
    <div className={cn(
      "neuro-card rounded-2xl",
      compact ? "p-4" : "p-6"
    )}>
      <h3 className={cn(
        "font-bold text-violet-400 mb-4 flex items-center gap-2",
        compact ? "text-base" : "text-lg"
      )}>
        <LucideIcons.TrendingUp size={compact ? 16 : 20} />
        Linha do Tempo - Últimos {days} dias
      </h3>

      <div className={cn(
        "space-y-2",
        isMobile && "overflow-x-auto -mx-4 px-4"
      )}>
        <div className={cn(isMobile && "min-w-[600px]")}>
          {timelineDays.map(({ date, dateStr, dayCompletions, isToday }) => {
            const completedCount = dayCompletions.filter((c) => c.percentage >= 100).length;
            const percentage = habits.length > 0 
              ? Math.round((completedCount / habits.length) * 100) 
              : 0;

            return (
              <div
                key={dateStr}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-all",
                  isToday && "bg-violet-900/20 ring-2 ring-violet-500/40",
                  compact ? "gap-2" : "gap-3"
                )}
              >
                {/* Data */}
                <div className={cn(
                  "text-xs",
                  compact ? "w-16" : "w-20"
                )}>
                  <div className={cn(
                    "font-semibold",
                    isToday && "text-violet-400"
                  )}>
                    {format(date, 'EEE', { locale: ptBR })}
                  </div>
                  <div className="text-xs text-slate-500">
                    {format(date, 'dd/MM')}
                  </div>
                </div>

                {/* Hábitos */}
                <div className="flex-1 flex flex-wrap gap-1.5">
                  {habits.map((habit) => {
                    const isCompleted = dayCompletions.some(
                      (c) => c.habit_id === habit.id && c.percentage >= 100
                    );
                    const Icon = getIconComponent(habit.icon);

                    return (
                      <TooltipProvider key={habit.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "rounded-lg flex items-center justify-center transition-all duration-200",
                                compact ? "w-8 h-8" : "w-10 h-10",
                                isCompleted
                                  ? "bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/40 scale-105"
                                  : "bg-slate-700/30 border border-slate-600 opacity-40"
                              )}
                            >
                              <Icon
                                size={iconSize * 1.8}
                                className={isCompleted ? 'text-white' : 'text-slate-500'}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs font-medium">{habit.title}</p>
                            <p className="text-xs text-slate-400">
                              {isCompleted ? 'Completado ✓' : 'Não completado'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>

                {/* Progress */}
                <div className={cn(
                  compact ? "w-20" : "w-28"
                )}>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-violet-400 min-w-[32px]">
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HabitsTimeline;
