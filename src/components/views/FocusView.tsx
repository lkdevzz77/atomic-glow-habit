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
  const nextHabit = pendingHabits[0];
  const upcomingHabits = pendingHabits.slice(1, 4);

  if (!nextHabit) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center animate-fade-in">
          <div className="glass p-12 rounded-3xl">
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
      {/* Focus Card */}
      <FocusCard
        habit={nextHabit}
        onComplete={() => onComplete(nextHabit.id)}
      />

      {/* Upcoming Habits */}
      {upcomingHabits.length > 0 && (
        <div className="max-w-[600px] mx-auto">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 px-2">
            Próximos
          </h3>
          <div className="space-y-2">
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

      {/* Footer */}
      <div className="max-w-[600px] mx-auto text-center">
        <button
          onClick={onViewAll}
          className="text-sm text-primary hover:text-primary-light transition-colors"
        >
          Ver Todos →
        </button>
      </div>
    </div>
  );
};

export default FocusView;
