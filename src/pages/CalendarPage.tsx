import React from 'react';
import { useHabits } from '@/hooks/useHabits';
import { AppLayout } from '@/layouts/AppLayout';
import { PageLoader } from '@/components/PageLoader';
import { NotionCalendar } from '@/components/NotionCalendar';
import { AnimatedPage } from '@/components/AnimatedPage';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const CalendarPage = () => {
  const { data: habits, isLoading: habitsLoading } = useHabits();
  
  // Buscar completions direto do banco
  const { data: completions, isLoading: completionsLoading } = useQuery({
    queryKey: ['habit-completions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habit_completions')
        .select('id, habit_id, date, percentage, completed_at')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!habits,
  });

  if (habitsLoading || completionsLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

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
            completions={completions || []}
            onHabitToggle={() => {}}
          />
        </div>
      </AnimatedPage>
    </AppLayout>
  );
};

export default CalendarPage;
