import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DailyProgressCardProps {
  completed: number;
  total: number;
  xpEarned: number;
  habits: Array<{
    id: number;
    title: string;
    completed: boolean;
  }>;
}

export const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
  completed,
  total,
  xpEarned,
  habits
}) => {
  if (total === 0) return null;
  
  const percentage = (completed / total) * 100;
  const isAllCompleted = completed === total;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={cn(
          "neuro-card card-rounded card-padding cursor-pointer",
          isAllCompleted && "neuro-success"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚛️</span>
              <h3 className="text-card-title">Progresso de Hoje</h3>
            </div>
            {isAllCompleted && (
              <span className="text-xl animate-bounce">🎉</span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {completed}/{total} hábitos
              </span>
              <span className={cn(
                "font-bold text-lg",
                isAllCompleted ? "text-success-glow" : "text-foreground"
              )}>
                {Math.round(percentage)}%
              </span>
            </div>

            <Progress value={percentage} className="h-3" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                ⚡ XP ganho:
              </span>
              <span className="font-semibold text-primary-glow">+{xpEarned} XP</span>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-72" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Detalhes</h4>
            <span className="text-sm text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          </div>

          <div className="space-y-2">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center gap-2 text-sm">
                {habit.completed ? (
                  <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                ) : (
                  <Circle size={16} className="text-muted-foreground flex-shrink-0" />
                )}
                <span className={habit.completed ? 'line-through text-muted-foreground' : ''}>
                  {habit.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
