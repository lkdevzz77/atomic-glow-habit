import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface WeeklyData {
  currentWeek: number;
  previousWeek: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

const WeeklyComparison = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['weekly-comparison', user?.id],
    queryFn: async () => {
      // Get current week dates
      const today = new Date();
      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() - today.getDay());
      
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

      // Get previous week dates
      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(currentWeekStart.getDate() - 7);
      
      const previousWeekEnd = new Date(previousWeekStart);
      previousWeekEnd.setDate(previousWeekStart.getDate() + 6);

      // Fetch current week completions
      const { data: currentCompletions } = await supabase
        .from('habit_completions')
        .select('percentage')
        .eq('user_id', user?.id)
        .gte('date', currentWeekStart.toISOString().split('T')[0])
        .lte('date', currentWeekEnd.toISOString().split('T')[0])
        .gte('percentage', 100);

      // Fetch previous week completions
      const { data: previousCompletions } = await supabase
        .from('habit_completions')
        .select('percentage')
        .eq('user_id', user?.id)
        .gte('date', previousWeekStart.toISOString().split('T')[0])
        .lte('date', previousWeekEnd.toISOString().split('T')[0])
        .gte('percentage', 100);

      const currentCount = currentCompletions?.length || 0;
      const previousCount = previousCompletions?.length || 0;
      
      const change = previousCount === 0 
        ? currentCount > 0 ? 100 : 0
        : Math.round(((currentCount - previousCount) / previousCount) * 100);

      let trend: 'up' | 'down' | 'stable';
      if (change > 5) trend = 'up';
      else if (change < -5) trend = 'down';
      else trend = 'stable';

      return {
        currentWeek: currentCount,
        previousWeek: previousCount,
        change,
        trend
      } as WeeklyData;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="glass rounded-xl p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-slate-700 rounded w-48"></div>
            <div className="h-16 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5" />;
      case 'down':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <Minus className="w-5 h-5" />;
    }
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'up':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20';
      case 'down':
        return 'text-red-400 border-red-500/30 bg-red-900/20';
      default:
        return 'text-slate-400 border-slate-500/30 bg-slate-900/20';
    }
  };

  const getTrendMessage = () => {
    if (data.trend === 'up') {
      return `Você está ${Math.abs(data.change)}% melhor que a semana passada! 🎉`;
    } else if (data.trend === 'down') {
      return `${Math.abs(data.change)}% abaixo da semana passada. Vamos recuperar! 💪`;
    } else {
      return 'Performance estável. Continue assim! 👍';
    }
  };

  return (
    <div className="mt-8">
      <div className={cn(
        "glass rounded-xl p-6 border-2 transition-all duration-300",
        getTrendColor()
      )}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-50 mb-2">
              Comparação Semanal
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              {getTrendMessage()}
            </p>

            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-slate-400 mb-1">Esta Semana</div>
                <div className="text-2xl font-bold text-slate-50">
                  {data.currentWeek}
                </div>
              </div>

              <div className="h-12 w-px bg-slate-700" />

              <div>
                <div className="text-xs text-slate-400 mb-1">Semana Passada</div>
                <div className="text-2xl font-bold text-slate-400">
                  {data.previousWeek}
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "flex-shrink-0 w-16 h-16 rounded-2xl border-2 flex items-center justify-center",
            getTrendColor()
          )}>
            <div className="flex flex-col items-center">
              {getTrendIcon()}
              <span className="text-sm font-bold mt-1">
                {data.change > 0 ? '+' : ''}{data.change}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyComparison;
