import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { subDays, format, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Habit } from '@/types/habit';

interface Completion {
  id: number;
  habit_id: number;
  date: string;
  percentage: number;
  user_id: string;
  completed_at: string;
}

interface WeeklyHeatmapProps {
  habits: Habit[];
  completions: Completion[];
  weeks?: number;
}

const WeeklyHeatmap = ({ habits, completions, weeks = 4 }: WeeklyHeatmapProps) => {
  const heatmapData = useMemo(() => {
    const today = new Date();
    const days = weeks * 7;
    const startDate = subDays(today, days - 1);
    const dateRange = eachDayOfInterval({ start: startDate, end: today });
    
    const weekGrid = [];
    for (let i = 0; i < weeks; i++) {
      const weekDays = dateRange.slice(i * 7, (i + 1) * 7);
      weekGrid.push(weekDays.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayCompletions = completions.filter(
          c => c.date === dateStr && c.percentage >= 100
        );
        const uniqueHabits = new Set(dayCompletions.map(c => c.habit_id));
        const percentage = habits.length > 0 
          ? (uniqueHabits.size / habits.length) * 100 
          : 0;
        return { 
          date, 
          percentage, 
          completed: uniqueHabits.size,
          total: habits.length 
        };
      }));
    }
    return weekGrid;
  }, [habits, completions, weeks]);
  
  const getHeatColor = (percentage: number) => {
    if (percentage === 0) return 'bg-slate-800/40 border-slate-700/50';
    if (percentage < 25) return 'bg-violet-500/20 border-violet-500/30';
    if (percentage < 50) return 'bg-violet-500/40 border-violet-500/50';
    if (percentage < 75) return 'bg-violet-500/60 border-violet-500/70';
    if (percentage < 100) return 'bg-violet-500/80 border-violet-500/90';
    return 'bg-violet-600 border-violet-500 shadow-lg shadow-violet-500/30';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Heatmap de Conclusões
        </h3>
        <div className="text-xs text-muted-foreground">
          Últimas {weeks} semanas
        </div>
      </div>
      
      <div className="space-y-1.5">
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-xs text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {heatmapData.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1.5">
            {week.map((day, dayIdx) => (
              <TooltipProvider key={dayIdx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (weekIdx * 7 + dayIdx) * 0.01 }}
                      className={cn(
                        'aspect-square rounded-md border-2 transition-all cursor-pointer',
                        'hover:scale-110 hover:shadow-xl',
                        getHeatColor(day.percentage),
                        isSameDay(day.date, new Date()) && 'ring-2 ring-pink-500 ring-offset-2 ring-offset-background'
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <div className="font-semibold mb-1">
                        {format(day.date, "dd 'de' MMM", { locale: ptBR })}
                      </div>
                      <div className="text-muted-foreground">
                        {day.completed}/{day.total} hábitos ({Math.round(day.percentage)}%)
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">Menos</span>
        {[
          'bg-slate-800/40 border-slate-700/50',
          'bg-violet-500/20 border-violet-500/30',
          'bg-violet-500/40 border-violet-500/50',
          'bg-violet-500/60 border-violet-500/70',
          'bg-violet-500/80 border-violet-500/90',
          'bg-violet-600 border-violet-500'
        ].map((color, i) => (
          <div key={i} className={cn('w-3 h-3 rounded border', color)} />
        ))}
        <span className="text-xs text-muted-foreground">Mais</span>
      </div>
    </motion.div>
  );
};

export default WeeklyHeatmap;
