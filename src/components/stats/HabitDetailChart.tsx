import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Habit } from '@/types/habit';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  BookOpen, Dumbbell, Droplet, Brain, Heart, Target, Zap,
  CheckCircle2, Clock, Calendar, TrendingUp, Activity, Award,
  Flame, Sun, Moon, Coffee, Home, Music, Smartphone, Book,
  Utensils, Bed, type LucideIcon
} from 'lucide-react';

interface Completion {
  id: number;
  habit_id: number;
  date: string;
  percentage: number;
  completed_at: string;
}

interface HabitDetailChartProps {
  habits: Habit[];
  completions: Completion[];
}

const iconMap: Record<string, LucideIcon> = {
  read: BookOpen,
  exercise: Dumbbell,
  hydration: Droplet,
  meditation: Brain,
  health: Heart,
  focus: Target,
  energy: Zap,
  completed: CheckCircle2,
  pending: Clock,
  calendar: Calendar,
  trending: TrendingUp,
  activity: Activity,
  badge: Award,
  streak: Flame,
  sun: Sun,
  moon: Moon,
  coffee: Coffee,
  home: Home,
  music: Music,
  smartphone: Smartphone,
  book: Book,
  utensils: Utensils,
  bed: Bed,
};

const getIconComponent = (iconName: string) => {
  const IconComponent = iconMap[iconName] || Target;
  return <IconComponent className="w-4 h-4" />;
};

const HabitDetailChart = ({ habits, completions }: HabitDetailChartProps) => {
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [period, setPeriod] = useState<'7d' | '14d' | '30d'>('14d');

  useEffect(() => {
    if (habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0].id);
    }
  }, [habits, selectedHabitId]);

  const chartData = useMemo(() => {
    if (!selectedHabitId) return [];

    const days = period === '7d' ? 7 : period === '14d' ? 14 : 30;
    const dateRange = eachDayOfInterval({
      start: subDays(new Date(), days - 1),
      end: new Date()
    });

    return dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const completion = completions.find(
        c => c.habit_id === selectedHabitId && c.date === dateStr
      );

      return {
        date: dateStr,
        label: format(date, 'EEE', { locale: ptBR }),
        percentage: completion?.percentage || 0,
        isToday: isSameDay(date, new Date())
      };
    });
  }, [selectedHabitId, period, completions]);

  const selectedHabit = habits.find(h => h.id === selectedHabitId);
  const habitCompletions = completions.filter(
    c => c.habit_id === selectedHabitId && c.percentage >= 100
  );

  const metrics = {
    streak: selectedHabit?.streak || 0,
    total: habitCompletions.length,
    average: chartData.length > 0
      ? Math.round(chartData.reduce((sum, d) => sum + d.percentage, 0) / chartData.length)
      : 0
  };

  const insight = useMemo(() => {
    const bestDay = chartData.reduce((best, curr) =>
      curr.percentage > best.percentage ? curr : best
      , chartData[0] || { label: '', percentage: 0 });

    if (metrics.average >= 80) {
      return `Excelente consistência! Melhor dia: ${bestDay.label} (${bestDay.percentage}%)`;
    } else if (metrics.average >= 50) {
      return `Bom progresso! Tente manter a regularidade aos ${bestDay.label}s`;
    } else {
      return `Continue tentando! Pequenos passos levam longe 💪`;
    }
  }, [chartData, metrics.average]);

  if (habits.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Análise Individual</h3>

        <div className="flex gap-2">
          {(['7d', '14d', '30d'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1 text-xs rounded-lg transition-all',
                period === p
                  ? 'bg-violet-500 text-white'
                  : 'bg-accent text-muted-foreground hover:bg-accent/80'
              )}
            >
              {p === '7d' ? '7d' : p === '14d' ? '14d' : '30d'}
            </button>
          ))}
        </div>
      </div>

      <Select
        value={selectedHabitId?.toString()}
        onValueChange={(value) => setSelectedHabitId(parseInt(value))}
      >
        <SelectTrigger className="w-full mb-4">
          <SelectValue>
            {selectedHabit && (
              <div className="flex items-center gap-2">
                {getIconComponent(selectedHabit.icon)}
                <span className="font-medium">{selectedHabit.title}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {habits.map(habit => (
            <SelectItem key={habit.id} value={habit.id.toString()}>
              <div className="flex items-center gap-2">
                {getIconComponent(habit.icon)}
                <span>{habit.title}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-accent/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-violet-400">{metrics.streak}</div>
          <div className="text-xs text-muted-foreground">dias seguidos</div>
        </div>
        <div className="bg-accent/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400">{metrics.total}</div>
          <div className="text-xs text-muted-foreground">conclusões</div>
        </div>
        <div className="bg-accent/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{metrics.average}%</div>
          <div className="text-xs text-muted-foreground">média</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="label"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div className="rounded-lg border border-border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
                  <p className="text-sm font-medium mb-1">
                    {format(new Date(data.date), "dd 'de' MMM", { locale: ptBR })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {data.percentage}% completado
                    {data.percentage >= 100 && ' ✅'}
                  </p>
                </div>
              );
            }}
          />

          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={payload.isToday ? 6 : 4}
                  fill={payload.percentage >= 100 ? '#10B981' : '#8B5CF6'}
                  stroke="#fff"
                  strokeWidth={2}
                  className={payload.isToday ? 'animate-pulse' : ''}
                />
              );
            }}
            activeDot={{ r: 8, fill: '#EC4899' }}
          />

          <Area
            type="monotone"
            dataKey="percentage"
            stroke="none"
            fill="url(#lineGradient)"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 rounded-lg bg-violet-900/10 border border-violet-500/20">
        <p className="text-sm text-foreground flex items-center gap-2">
          <span className="text-lg">💡</span>
          {insight}
        </p>
      </div>
    </motion.div>
  );
};

export default HabitDetailChart;
