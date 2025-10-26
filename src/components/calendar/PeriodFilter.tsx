import React from 'react';
import { cn } from '@/lib/utils';

export type PeriodType = '7d' | '14d' | '30d' | '1m';

interface PeriodFilterProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

const PERIODS = [
  { value: '7d' as const, label: '7 dias' },
  { value: '14d' as const, label: '14 dias' },
  { value: '30d' as const, label: '30 dias' },
  { value: '1m' as const, label: 'Este mês' },
];

export const PeriodFilter = ({ selectedPeriod, onPeriodChange }: PeriodFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      {PERIODS.map((period) => (
        <button
          key={period.value}
          onClick={() => onPeriodChange(period.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all min-h-[44px]",
            selectedPeriod === period.value
              ? "bg-primary/20 text-primary border border-primary/50"
              : "bg-card/30 text-muted-foreground border border-border/30 hover:bg-card/50"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};
