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
      className="rounded-2xl bg-card/30 backdrop-blur-sm p-6 space-y-5"
    >
      {/* Header with mode toggle and period */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex gap-1 p-1 rounded-xl bg-muted/50">
          <button
            onClick={() => setMode('individual')}
            className={cn(
              'px-4 py-1.5 text-sm rounded-lg transition-all font-medium',
              mode === 'individual'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Individual
          </button>
          <button
            onClick={() => setMode('compare')}
            className={cn(
              'px-4 py-1.5 text-sm rounded-lg transition-all font-medium',
              mode === 'compare'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Comparar
          </button>
        </div>

        <div className="inline-flex gap-1 p-1 rounded-xl bg-muted/50">
          {(['7d', '14d', '30d'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg transition-all font-medium',
                period === p
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
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
              <SelectTrigger className="w-full border-0 bg-muted/50 h-11">
                <SelectValue>
                  {habits.find(h => h.id === selectedHabitId) && (
                    <div className="flex items-center gap-2.5">
                      {getIconComponent(habits.find(h => h.id === selectedHabitId)!.icon)}
                      <span className="font-medium">{habits.find(h => h.id === selectedHabitId)!.title}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {habits.map(habit => (
                  <SelectItem key={habit.id} value={habit.id.toString()}>
                    <div className="flex items-center gap-2.5">
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
          >
            <div className="text-xs font-medium text-muted-foreground mb-3">Selecione até 3 hábitos</div>
            <div className="grid gap-1.5 max-h-48 overflow-y-auto pr-1">
              {habits.map((habit, index) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabitForComparison(habit.id)}
                  className={cn(
                    "flex items-center gap-2.5 p-2.5 rounded-xl transition-all cursor-pointer",
                    selectedHabitIds.includes(habit.id)
                      ? 'bg-primary/10'
                      : 'bg-muted/30 hover:bg-muted/50'
                  )}
                >
                  <Checkbox
                    checked={selectedHabitIds.includes(habit.id)}
                    disabled={!selectedHabitIds.includes(habit.id) && selectedHabitIds.length >= 3}
                  />
                  <div 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                    style={{ 
                      backgroundColor: selectedHabitIds.includes(habit.id) 
                        ? HABIT_COLORS[selectedHabitIds.indexOf(habit.id)] 
                        : 'hsl(var(--muted-foreground))',
                      opacity: selectedHabitIds.includes(habit.id) ? 1 : 0.3
                    }}
                  />
                  {getIconComponent(habit.icon)}
                  <span className="text-sm flex-1 font-medium">{habit.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters */}
      <div className="space-y-4">
        {/* Weekday filter */}
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2.5">Filtrar por dia</div>
          <div className="flex gap-1.5 flex-wrap">
            {WEEKDAYS.map((day, index) => (
              <button
                key={index}
                onClick={() => toggleWeekday(index)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-lg transition-all font-medium',
                  selectedWeekdays.includes(index)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {day}
              </button>
            ))}
            {selectedWeekdays.length > 0 && (
              <button
                onClick={() => setSelectedWeekdays([])}
                className="px-3 py-1.5 text-xs rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium transition-all"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Toggle filters */}
        <div className="flex flex-wrap gap-4">
          {mode === 'individual' && (
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={comparePeriods}
                onCheckedChange={(checked) => setComparePeriods(!!checked)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Comparar períodos
              </span>
            </label>
          )}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <Checkbox
              checked={onlyComplete}
              onCheckedChange={(checked) => setOnlyComplete(!!checked)}
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Apenas 100%
            </span>
          </label>
        </div>
      </div>

      {/* Metrics */}
      {mode === 'individual' && 'average' in metrics ? (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{metrics.streak}</div>
            <div className="text-xs text-muted-foreground font-medium">Sequência</div>
          </div>
          <div className="bg-muted/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{metrics.total}</div>
            <div className="text-xs text-muted-foreground font-medium">Completos</div>
          </div>
          <div className="bg-muted/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{metrics.average}%</div>
            <div className="text-xs text-muted-foreground font-medium">Média</div>
          </div>
        </div>
      ) : mode === 'compare' && 'averages' in metrics ? (
        <div className="grid gap-2">
          {selectedHabitIds.map((habitId, index) => {
            const habit = habits.find(h => h.id === habitId);
            return (
              <div key={habitId} className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
                <div 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
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
      <ResponsiveContainer width="100%" height={220}>
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
                <div className="rounded-xl bg-background/98 backdrop-blur-md p-3.5 shadow-xl border border-border/50 min-w-[180px]">
                  <p className="text-sm font-semibold mb-2.5 flex items-center gap-2">
                    {data.fullDate}
                    {data.isToday && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">HOJE</span>}
                  </p>
                  
                  {mode === 'individual' ? (
                    <>
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 bg-muted/50 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all rounded-full"
                            style={{ width: `${Math.min(data.percentage || 0, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {data.percentage || 0}%
                        </span>
                      </div>
                      {data.percentage >= 100 && (
                        <p className="text-xs text-emerald-500 flex items-center gap-1.5 mt-2">
                          <span>✓</span> Completo
                        </p>
                      )}
                      {comparePeriods && data.previousPercentage !== undefined && (
                        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
                          Anterior: {data.previousPercentage}%
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2">
                      {selectedHabitIds.map((habitId, index) => {
                        const habit = habits.find(h => h.id === habitId);
                        const percentage = data[`habit${index}`] || 0;
                        return (
                          <div key={habitId} className="flex items-center gap-2.5">
                            <div 
                              className="w-2 h-2 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: HABIT_COLORS[index] }}
                            />
                            <span className="text-xs flex-1 truncate font-medium">{habit?.title}</span>
                            <span className="text-xs font-bold" style={{ color: HABIT_COLORS[index] }}>{percentage}%</span>
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
        <div className="p-4 rounded-xl bg-primary/5">
          <p className="text-sm text-foreground/90 flex items-center gap-2.5 leading-relaxed">
            <span className="text-base">💡</span>
            {insight}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default HabitDetailChart;