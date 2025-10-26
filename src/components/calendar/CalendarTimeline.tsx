import React, { useState, useMemo } from 'react';
import { startOfDay, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { PeriodFilter, PeriodType } from './PeriodFilter';
import { DayCard } from './DayCard';
import { triggerHaptic } from '@/utils/haptics';

interface Habit {
  id: number;
  title: string;
  icon: string;
}

interface Completion {
  habit_id: number;
  date: string;
  percentage: number;
}

interface CalendarTimelineProps {
  habits: Habit[];
  completions: Completion[];
}

export const CalendarTimeline = ({ habits, completions }: CalendarTimelineProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('7d');

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
    triggerHaptic('light');
  };

  const days = useMemo(() => {
    const today = startOfDay(new Date());
    
    switch (selectedPeriod) {
      case '7d':
        return eachDayOfInterval({
          start: subDays(today, 6),
          end: today
        });
      case '14d':
        return eachDayOfInterval({
          start: subDays(today, 13),
          end: today
        });
      case '30d':
        return eachDayOfInterval({
          start: subDays(today, 29),
          end: today
        });
      case '1m':
        return eachDayOfInterval({
          start: startOfMonth(today),
          end: endOfMonth(today)
        });
      default:
        return [];
    }
  }, [selectedPeriod]);

  return (
    <div className="space-y-4">
      {/* Period Filter */}
      <PeriodFilter 
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
      />

      {/* Timeline Cards */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-1 pb-4">
          {days.map((day, index) => (
            <DayCard
              key={day.toISOString()}
              date={day}
              habits={habits}
              completions={completions}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator hint */}
      <div className="text-center text-xs text-muted-foreground">
        ← Deslize para ver mais dias →
      </div>
    </div>
  );
};
