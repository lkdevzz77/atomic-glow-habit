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
    <Card className="relative overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-900/10 via-slate-800/50 to-purple-900/10">
      {/* Subtle particles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-4 w-1 h-1 bg-violet-400 rounded-full animate-pulse" />
        <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-4 left-12 w-1 h-1 bg-violet-300 rounded-full animate-pulse delay-200" />
      </div>

      <div className="relative p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <TrendingUp size={16} className="text-violet-400" />
            Progresso de Hoje
          </h3>
          <Badge 
            variant="outline" 
            className="border-violet-500/30 bg-violet-900/20 text-violet-300 text-xs"
          >
            {Math.round(percentage)}%
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              <span className="font-bold text-violet-400">{completedToday}</span>
              <span className="text-slate-500"> / {totalHabits}</span> hábitos
            </span>
            <span className="text-slate-500 font-mono">{Math.round(percentage)}%</span>
          </div>
          
          <Progress 
            value={percentage} 
            className="h-2 bg-slate-800/60"
          />
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-amber-400" />
            <span className="text-xs text-slate-400">
              <span className="font-bold text-amber-400">+{xpEarned} XP</span> ganhos
            </span>
          </div>

          {nextBadge && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                Próxima: <span className="text-violet-400 font-medium">{nextBadge.name}</span>
                <span className="text-slate-500 ml-1">
                  ({nextBadge.progress}/{nextBadge.total}d)
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
