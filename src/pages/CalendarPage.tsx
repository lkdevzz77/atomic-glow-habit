import React from 'react';
import { useHabits } from '@/hooks/useHabits';
import { AppLayout } from '@/layouts/AppLayout';
import { PageLoader } from '@/components/PageLoader';
import { NotionCalendar } from '@/components/NotionCalendar';
import { AnimatedPage } from '@/components/AnimatedPage';

const CalendarPage = () => {
  const { data: habits, isLoading } = useHabits();

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  // Buscar todas as completions para o calendário
  const allCompletions = habits?.flatMap(habit => 
    (habit as any).completions?.map((c: any) => ({
      habit_id: habit.id,
      date: c.date,
      percentage: c.percentage || 100
    })) || []
  ) || [];

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
              📅 Calendário de Hábitos
            </h1>
            <p className="text-slate-400">
              "Um pequeno passo por dia, uma jornada transformadora por ano."
            </p>
          </div>

          {/* Calendário */}
          <NotionCalendar 
            habits={habits || []} 
            completions={allCompletions}
            onHabitToggle={() => {}}
          />
        </div>
      </AnimatedPage>
    </AppLayout>
  );
};

export default CalendarPage;
