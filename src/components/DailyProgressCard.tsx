import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from './ui/progress';
import { CheckCircle2, Flame, Zap, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';

interface DailyProgressCardProps {
  completedToday: number;
  totalHabits: number;
  activeStreaks: number;
  xpEarned: number;
  weeklyData?: Array<{ day: string; percentage: number }>;
}

export const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
  completedToday,
  totalHabits,
  activeStreaks,
  xpEarned,
  weeklyData = []
}) => {
  const progressPercentage = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
  const maxPercentage = Math.max(...weeklyData.map(d => d.percentage), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Progresso do Dia</h2>
          <span className="text-2xl font-bold text-primary">
            {Math.round(progressPercentage)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {completedToday} de {totalHabits} hábitos completados
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center p-3 rounded-lg bg-primary/5 border border-primary/10"
          >
            <CheckCircle2 className="w-5 h-5 text-primary mb-2" />
            <span className="text-xl font-bold text-foreground">{completedToday}</span>
            <span className="text-xs text-muted-foreground">Completados</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center p-3 rounded-lg bg-orange-500/5 border border-orange-500/10"
          >
            <Flame className="w-5 h-5 text-orange-500 mb-2" />
            <span className="text-xl font-bold text-foreground">{activeStreaks}</span>
            <span className="text-xs text-muted-foreground">Streaks</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center p-3 rounded-lg bg-primary/5 border border-primary/10"
          >
            <Zap className="w-5 h-5 text-primary mb-2" />
            <span className="text-xl font-bold text-foreground">{xpEarned}</span>
            <span className="text-xs text-muted-foreground">XP</span>
          </motion.div>
        </div>

        {/* Mini Weekly Graph */}
        {weeklyData.length > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Semana
              </span>
            </div>
            <div className="flex items-end justify-between gap-1 h-16">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-secondary/20 rounded-sm overflow-hidden relative h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.percentage / maxPercentage) * 100}%` }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="w-full bg-primary absolute bottom-0 rounded-sm"
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {data.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
