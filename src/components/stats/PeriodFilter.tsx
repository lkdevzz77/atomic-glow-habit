import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type PeriodType = '7d' | '14d' | '1m' | '3m' | '6m' | '1y';

interface PeriodFilterProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

const PERIODS = [
  { value: '7d' as const, label: '1 semana' },
  { value: '14d' as const, label: '2 semanas' },
  { value: '1m' as const, label: '1 mês' },
  { value: '3m' as const, label: '3 meses' },
  { value: '6m' as const, label: '6 meses' },
  { value: '1y' as const, label: '1 ano' },
];

const PeriodFilter = ({ selectedPeriod, onPeriodChange }: PeriodFilterProps) => {
  return (
    <Select value={selectedPeriod} onValueChange={onPeriodChange}>
      <SelectTrigger className="w-[140px] h-9 bg-background/50 border-border text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PERIODS.map((period) => (
          <SelectItem key={period.value} value={period.value}>
            {period.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodFilter;
