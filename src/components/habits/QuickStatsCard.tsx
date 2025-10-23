import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap } from 'lucide-react';

interface QuickStatsCardProps {
  completedToday: number;
  totalHabits: number;
  xpEarned: number;
  nextBadge?: {
    name: string;
    progress: number;
    total: number;
  };
}

export const QuickStatsCard = ({
  completedToday,
  totalHabits,
  xpEarned,
  nextBadge,
}: QuickStatsCardProps) => {
  const percentage = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  return (
    <Card className="bg-card border-border">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">
              Progresso de Hoje
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">{Math.round(percentage)}%</span>
        </div>

        {/* Progress Bar */}
        <Progress value={percentage} className="h-2" />

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {completedToday}/{totalHabits} hábitos
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            +{xpEarned} XP
          </span>
        </div>

        {/* Next Badge */}
        {nextBadge && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Próxima conquista</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{nextBadge.name}</span>
              <span className="text-xs text-muted-foreground">
                {nextBadge.progress}/{nextBadge.total}d
              </span>
            </div>
            <Progress value={(nextBadge.progress / nextBadge.total) * 100} className="h-1.5" />
          </div>
        )}
      </div>
    </Card>
  );
};
