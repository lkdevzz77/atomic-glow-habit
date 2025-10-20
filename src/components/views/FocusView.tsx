import React from 'react';
import { Plus } from 'lucide-react';
import FocusCard from '../FocusCard';
import HabitCardCompact from '../HabitCardCompact';

interface Habit {
  id: number;
  title: string;
  icon: string;
  status: string;
  streak: number;
  where_location: string;
  when_time: string;
  goal_current: number;
  goal_target: number;
  goal_unit: string;
}

interface FocusViewProps {
  habits: Habit[];
  onComplete: (habitId: number) => void;
  onAddHabit: () => void;
  onViewAll: () => void;
}

const FocusView: React.FC<FocusViewProps> = ({ habits, onComplete, onAddHabit, onViewAll }) => {
  const pendingHabits = habits.filter(h => h.status === 'pending' || h.status === 'active');
  const completedHabits = habits.filter(h => h.status === 'completed');
  const nextHabit = pendingHabits[0];
  const upcomingHabits = pendingHabits.slice(1);

  if (!nextHabit) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center animate-fade-in">
          <div className="glass p-12 rounded-3xl border border-slate-700">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-slate-50 mb-2">
              Parabéns!
            </h2>
            <p className="text-slate-400 mb-8">
              Todos os hábitos foram concluídos hoje
            </p>
            <button
              onClick={onAddHabit}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Adicionar mais hábitos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Focus Now */}
      <div>
        <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">
          FOCO AGORA
        </h2>
        <FocusCard
          habit={nextHabit}
          onComplete={() => onComplete(nextHabit.id)}
        />
      </div>

      {/* Upcoming Habits */}
      {upcomingHabits.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            PRÓXIMOS ({upcomingHabits.length})
          </h2>
          <div className="space-y-3">
            {upcomingHabits.map((habit) => (
              <HabitCardCompact
                key={habit.id}
                habit={habit}
                onComplete={() => onComplete(habit.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Today */}
      {completedHabits.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4">
            CONCLUÍDOS HOJE ({completedHabits.length}) ✅
          </h2>
          <div className="space-y-3">
            {completedHabits.map((habit) => (
              <HabitCardCompact
                key={habit.id}
                habit={habit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusView;
