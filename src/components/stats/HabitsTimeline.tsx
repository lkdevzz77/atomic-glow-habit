import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
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

interface HabitsTimelineProps {
  habits: Habit[];
  completions: Completion[];
}

const HabitsTimeline = ({ habits, completions }: HabitsTimelineProps) => {
  const [days, setDays] = useState<'7' | '14' | '30'>('14');

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Sparkles;
  };

  const timelineDays = useMemo(() => {
    const today = new Date();
    const numDays = parseInt(days);
    const startDate = subDays(today, numDays - 1);
    const dateRange = eachDayOfInterval({ start: startDate, end: today });

    return dateRange.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayCompletions = completions.filter(
        (c) => c.date === dateStr && c.percentage >= 100
      );
      const uniqueHabits = new Set(dayCompletions.map((c) => c.habit_id));
      const completedCount = uniqueHabits.size;
      const totalHabits = habits.length;
      const percentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

      return {
        date,
        dateStr,
        completedHabits: Array.from(uniqueHabits).map((habitId) => 
          habits.find((h) => h.id === habitId)
        ).filter(Boolean) as Habit[],
        percentage,
        completedCount,
        totalHabits,
        isToday: isSameDay(date, today),
      };
    });
  }, [habits, completions, days]);

  const getIntensityColor = (percentage: number, isToday: boolean) => {
    if (isToday) return 'bg-primary border-primary';
    if (percentage === 0) return 'bg-muted/30 border-border';
    if (percentage < 30) return 'bg-chart-3/30 border-chart-3/50';
    if (percentage < 60) return 'bg-chart-2/50 border-chart-2';
    if (percentage < 100) return 'bg-chart-1/70 border-chart-1';
    return 'bg-chart-1 border-chart-1';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Linha do Tempo</h3>
        </div>
        <Select value={days} onValueChange={(v) => setDays(v as any)}>
          <SelectTrigger className="w-[120px] h-9 bg-background/50 border-border text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 dias</SelectItem>
            <SelectItem value="14">14 dias</SelectItem>
            <SelectItem value="30">30 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto -mx-4 px-4">
        <div className="inline-flex gap-1.5 min-w-full justify-start pb-2">
          <TooltipProvider delayDuration={100}>
            {timelineDays.map((day, idx) => {
              return (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className={`
                        w-10 h-10 rounded-lg border-2 transition-all cursor-pointer
                        hover:scale-110 hover:shadow-lg
                        ${getIntensityColor(day.percentage, day.isToday)}
                        ${day.isToday ? 'ring-2 ring-primary/50 ring-offset-2 ring-offset-background' : ''}
                      `}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[10px] font-bold text-foreground/70">
                          {format(day.date, 'd')}
                        </span>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px]">
                    <div className="space-y-2">
                      <div className="font-semibold text-sm">
                        {format(day.date, "EEE, dd 'de' MMM", { locale: ptBR })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {day.completedCount}/{day.totalHabits} hábitos ({Math.round(day.percentage)}%)
                      </div>
                      {day.completedHabits.length > 0 && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs font-medium mb-1">Completados:</p>
                          <ul className="space-y-1">
                            {day.completedHabits.map((habit) => {
                              const HabitIcon = getIconComponent(habit.icon);
                              return (
                                <li key={habit.id} className="flex items-center gap-1.5 text-xs">
                                  <HabitIcon className="w-3 h-3" />
                                  {habit.title}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-muted/30 border border-border" />
          <span>0%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-chart-3/30 border border-chart-3/50" />
          <span>&lt;30%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-chart-2/50 border border-chart-2" />
          <span>30-60%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-chart-1 border border-chart-1" />
          <span>100%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary border-primary ring-2 ring-primary/30" />
          <span>Hoje</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitsTimeline;
