import React from 'react';
import { Card } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import { Habit } from '@/types/habit';
import { calculateCompletionRate } from '@/utils/habitMetrics';
import { HabitActionsMenu } from './HabitActionsMenu';

interface HabitCardProps {
  habit: Habit;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Atom;
};

export const HabitCard = ({ habit, onEdit, onDelete }: HabitCardProps) => {
  const Icon = getIconComponent(habit.icon);
  const completionRate = calculateCompletionRate(habit);
  const isCompleted = habit.completedToday;
  const isPending = habit.status === 'pending';
  const isActive = habit.status === 'active';

  return (
    <Card className="p-4 transition-colors hover:bg-muted/30">
      <div className="flex items-start justify-between gap-3">
        {/* Left: Icon + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div 
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              ${isCompleted 
                ? 'bg-emerald-500/10 ring-2 ring-emerald-500/50' 
                : 'bg-muted'
              }
            `}
          >
            <Icon 
              size={20} 
              className={isCompleted ? 'text-emerald-500' : 'text-muted-foreground'} 
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-foreground truncate">
              {habit.title}
            </h3>
            
            {/* PARTE 7: Mostrar detalhes apenas se PENDING */}
            {isPending && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {habit.when_time} • {habit.where_location}
              </p>
            )}
            
            {/* PARTE 7: Hábitos ACTIVE mostram apenas info mínima */}
            {isActive && habit.when_time && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {habit.when_time}
              </p>
            )}
          </div>
        </div>

        {/* Right: Stats + Menu */}
        <div className="flex items-start gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 text-sm">
            {habit.streak > 0 && (
              <div 
                className={`
                  flex items-center gap-1 font-semibold
                  ${habit.streak >= 7 ? 'text-amber-500' : 'text-foreground'}
                `}
              >
                🔥 {habit.streak}
              </div>
            )}
            {isActive && (
              <div className="text-muted-foreground font-medium">
                {completionRate}%
              </div>
            )}
          </div>

          <HabitActionsMenu
            onEdit={() => onEdit(habit.id)}
            onDelete={() => onDelete(habit.id)}
          />
        </div>
      </div>
    </Card>
  );
};
