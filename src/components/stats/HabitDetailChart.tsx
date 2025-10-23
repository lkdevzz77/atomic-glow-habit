import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { format, subDays, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Habit } from '@/types/habit';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HABIT_COLORS = ['#8B5CF6', '#10B981', '#F59E0B'];

const HabitDetailChart = ({ habits, completions }: HabitDetailChartProps) => {
  const [mode, setMode] = useState<'individual' | 'compare'>('individual');
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [selectedHabitIds, setSelectedHabitIds] = useState<number[]>([]);
  const [period, setPeriod] = useState<'7d' | '14d' | '30d'>('14d');
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const [comparePeriods, setComparePeriods] = useState(false);
  const [onlyComplete, setOnlyComplete] = useState(false);

  useEffect(() => {
    if (habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0].id);
      setSelectedHabitIds([habits[0].id]);
    }
  }, [habits, selectedHabitId]);

  const toggleWeekday = (day: number) => {
    setSelectedWeekdays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleHabitForComparison = (habitId: number) => {
    setSelectedHabitIds(prev => {
      if (prev.includes(habitId)) {
        return prev.filter(id => id !== habitId);
      } else if (prev.length < 3) {
        return [...prev, habitId];
      }
      return prev;
    });
  };

  // Base data generation
  const baseChartData = useMemo(() => {
    const days = period === '7d' ? 7 : period === '14d' ? 14 : 30;
    const dateRange = eachDayOfInterval({
      start: subDays(new Date(), days - 1),
      end: new Date()
    });

    return dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayOfWeek = getDay(date);
      const isToday = isSameDay(date, new Date());
      
      return {
        date: dateStr,
        label: period === '7d' 
          ? format(date, 'EEEE', { locale: ptBR }).substring(0, 3)
          : format(date, 'dd/MM'),
        fullDate: format(date, "dd 'de' MMMM", { locale: ptBR }),
        dayOfWeek,
        isToday
      };
    });
  }, [period]);

  // Previous period data for comparison
  const previousPeriodData = useMemo(() => {
    if (!comparePeriods) return [];
    
    const days = period === '7d' ? 7 : period === '14d' ? 14 : 30;
    const dateRange = eachDayOfInterval({
      start: subDays(new Date(), days * 2 - 1),
      end: subDays(new Date(), days)
    });

    return dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return { date: dateStr };
    });
  }, [period, comparePeriods]);

  // Apply filters and add completion data
  const chartData = useMemo(() => {
    let data = baseChartData;

    // Filter by weekday
    if (selectedWeekdays.length > 0) {
      data = data.filter(d => selectedWeekdays.includes(d.dayOfWeek));
    }

    // Add completion data based on mode
    if (mode === 'individual') {
      data = data.map(d => {
        const completion = completions.find(
          c => c.habit_id === selectedHabitId && c.date === d.date
        );
        const percentage = completion?.percentage || 0;
        
        return {
          ...d,
          percentage
        };
      });

      // Add previous period data for comparison
      if (comparePeriods && selectedHabitId) {
        const prevData = previousPeriodData.map((pd, index) => {
          const completion = completions.find(
            c => c.habit_id === selectedHabitId && c.date === pd.date
          );
          return completion?.percentage || 0;
        });

        data = data.map((d, index) => ({
          ...d,
          previousPercentage: prevData[index] || 0
        }));
      }
    } else {
      // Compare mode: add data for each selected habit
      data = data.map(d => {
        const dataPoint: any = { ...d };
        
        selectedHabitIds.forEach((habitId, index) => {
          const completion = completions.find(
            c => c.habit_id === habitId && c.date === d.date
          );
          dataPoint[`habit${index}`] = completion?.percentage || 0;
        });
        
        return dataPoint;
      });
    }

    // Filter only 100% complete days
    if (onlyComplete) {
      if (mode === 'individual') {
        data = data.filter((d: any) => d.percentage >= 100);
      } else {
        data = data.filter((d: any) => 
          selectedHabitIds.some((_, index) => d[`habit${index}`] >= 100)
        );
      }
    }

    return data;
  }, [baseChartData, mode, selectedHabitId, selectedHabitIds, completions, selectedWeekdays, comparePeriods, previousPeriodData, onlyComplete]);

  // Metrics calculation
  const metrics = useMemo(() => {
    if (mode === 'individual') {
      const selectedHabit = habits.find(h => h.id === selectedHabitId);
      const habitCompletions = completions.filter(
        c => c.habit_id === selectedHabitId && c.percentage >= 100
      );
      const average = chartData.length > 0
        ? Math.round(chartData.reduce((sum: number, d: any) => sum + (d.percentage || 0), 0) / chartData.length)
        : 0;

      return {
        streak: selectedHabit?.streak || 0,
        total: habitCompletions.length,
        average
      };
    } else {
      // Compare mode: show average across selected habits
      const totals = selectedHabitIds.map((habitId, index) => {
        const sum = chartData.reduce((acc: number, d: any) => acc + (d[`habit${index}`] || 0), 0);
        return chartData.length > 0 ? Math.round(sum / chartData.length) : 0;
      });

      return {
        averages: totals,
        habitsCount: selectedHabitIds.length
      };
    }
  }, [mode, selectedHabitId, selectedHabitIds, habits, completions, chartData]);

  const insight = useMemo(() => {
    if (mode === 'individual' && 'average' in metrics && chartData.length > 0) {
      const bestDay = chartData.reduce((best: any, curr: any) =>
        ((curr as any).percentage || 0) > ((best as any).percentage || 0) ? curr : best
      , chartData[0] || { label: '', percentage: 0 });

      if (metrics.average >= 80) {
        return `Excelente consistência! Melhor dia: ${bestDay.label} (${(bestDay as any).percentage}%)`;
      } else if (metrics.average >= 50) {
        return `Bom progresso! Continue mantendo a regularidade`;
      } else {
        return `Continue tentando! Pequenos passos levam longe 💪`;
      }
    } else if (mode === 'compare' && 'averages' in metrics) {
      const bestHabitIndex = metrics.averages.indexOf(Math.max(...metrics.averages));
      const bestHabit = habits.find(h => h.id === selectedHabitIds[bestHabitIndex]);
      return `Melhor desempenho: ${bestHabit?.title || 'N/A'} com ${metrics.averages[bestHabitIndex]}% de média`;
    }
    return '';
  }, [chartData, metrics, mode, habits, selectedHabitIds]);

  if (habits.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4"
    >
      {/* Header with mode toggle */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('individual')}
            className={cn(
              'px-3 py-1.5 text-xs rounded-lg transition-all font-medium',
              mode === 'individual'
                ? 'bg-violet-500 text-white'
                : 'bg-accent text-muted-foreground hover:bg-accent/80'
            )}
          >
            Individual
          </button>
          <button
            onClick={() => setMode('compare')}
            className={cn(
              'px-3 py-1.5 text-xs rounded-lg transition-all font-medium',
              mode === 'compare'
                ? 'bg-violet-500 text-white'
                : 'bg-accent text-muted-foreground hover:bg-accent/80'
            )}
          >
            Comparar
          </button>
        </div>

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
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Habit selector based on mode */}
      <AnimatePresence mode="wait">
        {mode === 'individual' ? (
          <motion.div
            key="individual-select"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Select
              value={selectedHabitId?.toString()}
              onValueChange={(value) => setSelectedHabitId(parseInt(value))}
            >
              <SelectTrigger className="w-full mb-4">
                <SelectValue>
                  {habits.find(h => h.id === selectedHabitId) && (
                    <div className="flex items-center gap-2">
                      {getIconComponent(habits.find(h => h.id === selectedHabitId)!.icon)}
                      <span className="font-medium">{habits.find(h => h.id === selectedHabitId)!.title}</span>
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
          </motion.div>
        ) : (
          <motion.div
            key="compare-select"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <div className="text-xs text-muted-foreground mb-2">Selecione até 3 hábitos para comparar:</div>
            <div className="grid gap-2 max-h-48 overflow-y-auto pr-2">
              {habits.map((habit, index) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabitForComparison(habit.id)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer",
                    selectedHabitIds.includes(habit.id)
                      ? 'bg-violet-500/10 border-violet-500/50'
                      : 'bg-accent/50 border-transparent hover:bg-accent'
                  )}
                >
                  <Checkbox
                    checked={selectedHabitIds.includes(habit.id)}
                    disabled={!selectedHabitIds.includes(habit.id) && selectedHabitIds.length >= 3}
                  />
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ 
                      backgroundColor: selectedHabitIds.includes(habit.id) 
                        ? HABIT_COLORS[selectedHabitIds.indexOf(habit.id)] 
                        : 'transparent',
                      border: selectedHabitIds.includes(habit.id) ? 'none' : '2px solid hsl(var(--muted-foreground))'
                    }}
                  />
                  {getIconComponent(habit.icon)}
                  <span className="text-sm flex-1">{habit.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters */}
      <div className="mb-4 space-y-3">
        {/* Weekday filter */}
        <div>
          <div className="text-xs text-muted-foreground mb-2">Filtrar por dia da semana:</div>
          <div className="flex gap-1 flex-wrap">
            {WEEKDAYS.map((day, index) => (
              <button
                key={index}
                onClick={() => toggleWeekday(index)}
                className={cn(
                  'px-2 py-1 text-xs rounded-md transition-all',
                  selectedWeekdays.includes(index)
                    ? 'bg-violet-500 text-white'
                    : 'bg-accent text-muted-foreground hover:bg-accent/80'
                )}
              >
                {day}
              </button>
            ))}
            {selectedWeekdays.length > 0 && (
              <button
                onClick={() => setSelectedWeekdays([])}
                className="px-2 py-1 text-xs rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Toggle filters */}
        <div className="flex flex-wrap gap-3">
          {mode === 'individual' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={comparePeriods}
                onCheckedChange={(checked) => setComparePeriods(!!checked)}
              />
              <span className="text-xs text-muted-foreground">Comparar com período anterior</span>
            </label>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={onlyComplete}
              onCheckedChange={(checked) => setOnlyComplete(!!checked)}
            />
            <span className="text-xs text-muted-foreground">Apenas dias 100% completos</span>
          </label>
        </div>
      </div>

      {/* Metrics */}
      {mode === 'individual' && 'average' in metrics ? (
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
      ) : mode === 'compare' && 'averages' in metrics ? (
        <div className="grid gap-2 mb-4">
          {selectedHabitIds.map((habitId, index) => {
            const habit = habits.find(h => h.id === habitId);
            return (
              <div key={habitId} className="flex items-center gap-2 bg-accent/50 rounded-lg p-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: HABIT_COLORS[index] }}
                />
                <div className="flex-1 flex items-center gap-2">
                  {getIconComponent(habit?.icon || 'target')}
                  <span className="text-sm font-medium truncate">{habit?.title}</span>
                </div>
                <div className="text-lg font-bold" style={{ color: HABIT_COLORS[index] }}>
                  {metrics.averages[index]}%
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
            {mode === 'compare' && selectedHabitIds.map((_, index) => (
              <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={HABIT_COLORS[index]} stopOpacity={0.3} />
                <stop offset="100%" stopColor={HABIT_COLORS[index]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            opacity={0.3}
            horizontal={true}
            vertical={false}
          />

          <XAxis
            dataKey="label"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
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
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    {data.fullDate}
                    {data.isToday && <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded">HOJE</span>}
                  </p>
                  
                  {mode === 'individual' ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-accent rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-violet-500 transition-all"
                            style={{ width: `${Math.min(data.percentage || 0, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {data.percentage || 0}%
                        </span>
                      </div>
                      {data.percentage >= 100 && (
                        <p className="text-xs text-emerald-400 flex items-center gap-1">
                          <span>✅</span> Completado
                        </p>
                      )}
                      {comparePeriods && data.previousPercentage !== undefined && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Período anterior: {data.previousPercentage}%
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="space-y-1">
                      {selectedHabitIds.map((habitId, index) => {
                        const habit = habits.find(h => h.id === habitId);
                        const percentage = data[`habit${index}`] || 0;
                        return (
                          <div key={habitId} className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: HABIT_COLORS[index] }}
                            />
                            <span className="text-xs flex-1 truncate">{habit?.title}</span>
                            <span className="text-xs font-medium">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }}
          />

          {mode === 'individual' ? (
            <>
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#8B5CF6"
                strokeWidth={3}
                fill="url(#lineGradient)"
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isComplete = payload.percentage >= 100;
                  const isToday = payload.isToday;
                  
                  return (
                    <g>
                      {isToday && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={8}
                          fill="none"
                          stroke="#EC4899"
                          strokeWidth={2}
                          className="animate-pulse"
                        />
                      )}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isToday ? 5 : 4}
                        fill={isComplete ? '#10B981' : '#8B5CF6'}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    </g>
                  );
                }}
                activeDot={{ r: 8, fill: '#EC4899' }}
              />
              {comparePeriods && (
                <Line
                  type="monotone"
                  dataKey="previousPercentage"
                  stroke="#6B7280"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </>
          ) : (
            selectedHabitIds.map((habitId, index) => (
              <Line
                key={habitId}
                type="monotone"
                dataKey={`habit${index}`}
                stroke={HABIT_COLORS[index]}
                strokeWidth={3}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const percentage = payload[`habit${index}`] || 0;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={percentage >= 100 ? 5 : 4}
                      fill={percentage >= 100 ? '#10B981' : HABIT_COLORS[index]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 8, fill: HABIT_COLORS[index] }}
              />
            ))
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Insight */}
      {insight && (
        <div className="mt-4 p-3 rounded-lg bg-violet-900/10 border border-violet-500/20">
          <p className="text-sm text-foreground flex items-center gap-2">
            <span className="text-lg">💡</span>
            {insight}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default HabitDetailChart;