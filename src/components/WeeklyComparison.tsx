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
  const {
    user
  } = useAuth();
  const {
    data,
    isLoading
  } = useQuery({
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
      const {
        data: currentCompletions
      } = await supabase.from('habit_completions').select('percentage').eq('user_id', user?.id).gte('date', currentWeekStart.toISOString().split('T')[0]).lte('date', currentWeekEnd.toISOString().split('T')[0]).gte('percentage', 100);

      // Fetch previous week completions
      const {
        data: previousCompletions
      } = await supabase.from('habit_completions').select('percentage').eq('user_id', user?.id).gte('date', previousWeekStart.toISOString().split('T')[0]).lte('date', previousWeekEnd.toISOString().split('T')[0]).gte('percentage', 100);
      const currentCount = currentCompletions?.length || 0;
      const previousCount = previousCompletions?.length || 0;
      const change = previousCount === 0 ? currentCount > 0 ? 100 : 0 : Math.round((currentCount - previousCount) / previousCount * 100);
      let trend: 'up' | 'down' | 'stable';
      if (change > 5) trend = 'up';else if (change < -5) trend = 'down';else trend = 'stable';
      return {
        currentWeek: currentCount,
        previousWeek: previousCount,
        change,
        trend
      } as WeeklyData;
    },
    enabled: !!user?.id
  });
  if (isLoading) {
    return <div className="mt-8">
        <div className="glass rounded-xl p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-slate-700 rounded w-48"></div>
            <div className="h-16 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>;
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
        return 'text-emerald-400 bg-emerald-900/20 border border-emerald-500/30';
      case 'down':
        return 'text-amber-400 bg-amber-900/20 border border-amber-500/30';
      default:
        return 'text-slate-400 bg-slate-800/40 border border-slate-500/30';
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
    <div className="glass card-rounded card-padding-lg animate-fade-in transition-colors duration-300">
      <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <span>📈</span>
        Resumo da Semana
      </h3>

      <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/80 space-y-6">
        {/* Badge de tendência */}
        <div className="flex items-center justify-end mb-4">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
            getTrendColor()
          )}>
            {getTrendIcon()}
            <span className="font-bold text-lg">
              {data.change > 0 ? '+' : ''}{data.change}%
            </span>
          </div>
        </div>

        {/* Grid de comparação */}
        <div className="grid grid-cols-2 gap-4">
          {/* Semana Anterior */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
              Semana Passada
            </p>
            <p className="text-4xl font-bold text-slate-300">
              {data.previousWeek}
            </p>
            <p className="text-xs text-slate-500 mt-1">hábitos concluídos</p>
          </div>

          {/* Semana Atual */}
          <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-500/30 rounded-xl p-5 text-center">
            <p className="text-xs text-violet-400 uppercase tracking-wider mb-2">
              Esta Semana
            </p>
            <p className="text-4xl font-bold text-violet-300">
              {data.currentWeek}
            </p>
            <p className="text-xs text-violet-400/80 mt-1">hábitos concluídos</p>
          </div>
        </div>

        {/* Mensagem motivacional */}
        <div className="pt-4 border-t border-slate-700/50">
          <p className="text-sm text-slate-300 text-center leading-relaxed flex items-center justify-center gap-2">
            <span className="text-xl">
              {data.trend === 'up' ? '🎉' : data.trend === 'down' ? '💪' : '👍'}
            </span>
            {getTrendMessage()}
          </p>
        </div>
      </div>
    </div>
  );
};
export default WeeklyComparison;