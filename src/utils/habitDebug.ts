// ⚡ FASE 6: Utilitário de debug detalhado
import type { Habit } from '@/types/habit';

export const logHabitState = (context: string, habit: Habit, extra?: any) => {
  const timestamp = new Date().toISOString();
  console.group(`🔍 [${context}] ${timestamp}`);
  console.log('Habit ID:', habit.id);
  console.log('Title:', habit.title);
  console.log('Status:', habit.status);
  console.log('CompletedToday:', habit.completedToday);
  console.log('Streak:', habit.streak);
  console.log('Last Completed:', habit.last_completed);
  if (extra) console.log('Extra:', extra);
  console.groupEnd();
};

export const logCompletionAttempt = (habitId: number, habitTitle: string) => {
  const timestamp = new Date().toISOString();
  console.group(`⚡ [COMPLETION ATTEMPT] ${timestamp}`);
  console.log('Habit ID:', habitId);
  console.log('Title:', habitTitle);
  console.log('Client Date:', new Date().toISOString().split('T')[0]);
  console.log('Client Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
  console.groupEnd();
};

export const logCacheInvalidation = (queryKeys: string[]) => {
  const timestamp = new Date().toISOString();
  console.group(`♻️ [CACHE INVALIDATION] ${timestamp}`);
  console.log('Invalidating queries:', queryKeys);
  console.groupEnd();
};
