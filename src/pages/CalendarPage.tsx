import React from 'react';
import { useHabits } from '@/hooks/useHabits';
import { AppLayout } from '@/layouts/AppLayout';
import { PageLoader } from '@/components/PageLoader';
import { NotionCalendar } from '@/components/NotionCalendar';
import { AnimatedPage } from '@/components/AnimatedPage';
import { FeatureLock } from '@/components/FeatureLock';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Calendário de Hábitos
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Um pequeno passo por dia, uma jornada transformadora por ano
              </p>
            </div>
          </div>

          {/* Calendário com bloqueio */}
          <FeatureLock feature="calendar">
            <NotionCalendar 
              habits={habits || []} 
              completions={completions || []}
              onHabitToggle={() => {}}
            />
          </FeatureLock>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
};

export default CalendarPage;
