import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [quoteExpanded, setQuoteExpanded] = useState(false);
  
  const colorClasses = {
    violet: 'from-violet-600 to-purple-600 border-violet-500/50 shadow-violet-500/30',
    emerald: 'from-emerald-600 to-teal-600 border-emerald-500/50 shadow-emerald-500/30',
    amber: 'from-amber-600 to-orange-600 border-amber-500/50 shadow-amber-500/30',
    red: 'from-red-600 to-rose-600 border-red-500/50 shadow-red-500/30'
  };

  return (
    <div className={cn(
      "glass card-rounded group hover:border-violet-500/40 transition-all hover:-translate-y-1 duration-300",
      isMobile ? "p-4 card-padding-mobile" : "p-6"
    )}>
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

      {/* Valor principal - Responsive */}
      <div className="mb-2">
        <p className={cn(
          "font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent",
          isMobile ? "text-3xl" : "text-4xl"
        )}>
          {value}
        </p>
      </div>

      {/* Descrição */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-200">{title}</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>

      {/* Citação - Collapsible on mobile, sempre visível em desktop */}
      {quote && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          {isMobile ? (
            <button
              onClick={() => setQuoteExpanded(!quoteExpanded)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-violet-400 font-medium">
                  💬 Citação inspiradora
                </span>
                <ChevronDown className={cn(
                  "w-4 h-4 text-violet-400 transition-transform",
                  quoteExpanded && "rotate-180"
                )} />
              </div>
              {quoteExpanded && (
                <div className="mt-3 flex items-start gap-2 animate-fade-in">
                  <span className="text-violet-400 text-lg">"</span>
                  <div className="flex-1">
                    <p className="text-xs italic text-slate-300 leading-relaxed">
                      {quote}
                    </p>
                    <p className="text-xs text-violet-400 mt-1">— James Clear</p>
                  </div>
                </div>
              )}
            </button>
          ) : (
            <div className="flex items-start gap-2">
              <span className="text-violet-400 text-lg">"</span>
              <div className="flex-1">
                <p className="text-xs italic text-slate-300 leading-relaxed">
                  {quote}
                </p>
                <p className="text-xs text-violet-400 mt-1">— James Clear</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatMetricCard;
