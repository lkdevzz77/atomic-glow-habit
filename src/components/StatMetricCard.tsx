import React from 'react';
import { cn } from '@/lib/utils';

interface StatMetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color: 'violet' | 'emerald' | 'amber' | 'red';
  quote?: string;
}

const StatMetricCard: React.FC<StatMetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color,
  quote
}) => {
  const colorClasses = {
    violet: 'from-violet-600 to-purple-600 border-violet-500/50 shadow-violet-500/30',
    emerald: 'from-emerald-600 to-teal-600 border-emerald-500/50 shadow-emerald-500/30',
    amber: 'from-amber-600 to-orange-600 border-amber-500/50 shadow-amber-500/30',
    red: 'from-red-600 to-rose-600 border-red-500/50 shadow-red-500/30'
  };

  return (
    <div className="glass-violet border-2 border-slate-700/80 rounded-2xl p-6 group hover:border-violet-500/40 transition-all hover:-translate-y-1 duration-300">
      {/* Header com ícone */}
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
          colorClasses[color]
        )}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-semibold",
            trend === 'up' ? 'text-emerald-400' :
            trend === 'down' ? 'text-red-400' : 'text-slate-400'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </div>
        )}
      </div>

      {/* Valor principal */}
      <div className="mb-2">
        <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
          {value}
        </p>
      </div>

      {/* Descrição */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-200">{title}</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>

      {/* Citação (hover reveal) */}
      {quote && (
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="border-l-2 border-violet-500/50 pl-3 py-2 bg-violet-900/10 rounded-r-lg">
            <p className="text-xs italic text-slate-300 leading-relaxed">
              "{quote}"
            </p>
            <p className="text-xs text-violet-400 mt-1">— James Clear</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatMetricCard;
