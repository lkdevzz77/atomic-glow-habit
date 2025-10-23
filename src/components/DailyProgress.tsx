import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Progress } from './ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
interface DailyProgressProps {
  completed: number;
  total: number;
  habits: Array<{
    id: number;
    title: string;
    completed: boolean;
  }>;
}
export const DailyProgress: React.FC<DailyProgressProps> = ({
  completed,
  total,
  habits
}) => {
  if (total === 0) return null;
  const percentage = completed / total * 100;
  return <Popover>
      <PopoverTrigger asChild>
        
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Progresso de Hoje</h4>
            <span className="text-sm text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          </div>

          <div className="space-y-2">
            {habits.map(habit => <div key={habit.id} className="flex items-center gap-2 text-sm">
                {habit.completed ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" /> : <Circle size={16} className="text-muted-foreground flex-shrink-0" />}
                <span className={habit.completed ? 'line-through text-muted-foreground' : ''}>
                  {habit.title}
                </span>
              </div>)}
          </div>
        </div>
      </PopoverContent>
    </Popover>;
};