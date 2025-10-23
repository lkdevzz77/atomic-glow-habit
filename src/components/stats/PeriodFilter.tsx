import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

export type PeriodType = '14d' | '1m' | '3m' | '6m' | '1y' | 'custom';

interface PeriodFilterProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

const PERIODS = [
  { value: '14d' as const, label: '14 dias' },
  { value: '1m' as const, label: '1 mês' },
  { value: '3m' as const, label: '3 meses' },
  { value: '6m' as const, label: '6 meses' },
  { value: '1y' as const, label: '1 ano' },
];

const PeriodFilter = ({ selectedPeriod, onPeriodChange }: PeriodFilterProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-[140px] bg-slate-800/60 border-slate-700">
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
  }

  return (
    <Tabs value={selectedPeriod} onValueChange={onPeriodChange}>
      <TabsList className="bg-slate-800/60 border border-slate-700">
        {PERIODS.map((period) => (
          <TabsTrigger 
            key={period.value} 
            value={period.value}
            className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400"
          >
            {period.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default PeriodFilter;
