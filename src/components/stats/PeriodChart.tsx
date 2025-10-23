import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePeriodStats } from '@/hooks/usePeriodStats';
import type { PeriodType } from '@/components/stats/PeriodFilter';
import PeriodFilter from '@/components/stats/PeriodFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const PeriodChart = () => {
  const [period, setPeriod] = useState<PeriodType>('7d');
  const { data: stats, isLoading } = usePeriodStats(period);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4">
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!stats) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{data.label}</p>
          <p className="text-xs text-muted-foreground">
            {data.completed}/{data.total} hábitos ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
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
          <h3 className="text-sm font-semibold text-foreground">Evolução no Tempo</h3>
        </div>
        <PeriodFilter selectedPeriod={period} onPeriodChange={setPeriod} />
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={stats.data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="label" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
          <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
            {stats.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.isToday
                    ? '#EC4899'
                    : entry.percentage >= 80
                    ? '#8B5CF6'
                    : entry.percentage >= 60
                    ? '#A78BFA'
                    : entry.percentage >= 40
                    ? '#C4B5FD'
                    : entry.percentage >= 20
                    ? '#DDD6FE'
                    : '#E9D5FF'
                }
                className={entry.isToday ? 'animate-pulse' : ''}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Média</p>
          <p className="text-lg font-bold text-foreground">{stats.averagePercentage}%</p>
        </div>
        <div className="text-center border-x border-border">
          <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" /> Melhor
          </p>
          <p className="text-lg font-bold" style={{ color: '#8B5CF6' }}>{stats.bestPeriod.percentage}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
            <TrendingDown className="w-3 h-3" /> Menor
          </p>
          <p className="text-lg font-bold" style={{ color: '#DDD6FE' }}>{stats.worstPeriod.percentage}%</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PeriodChart;
