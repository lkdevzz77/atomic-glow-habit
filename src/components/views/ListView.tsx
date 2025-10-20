import React from 'react';
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

interface ListViewProps {
  habits: Habit[];
  onComplete: (habitId: number) => void;
}

const ListView: React.FC<ListViewProps> = ({ habits, onComplete }) => {
  const pendingHabits = habits.filter(h => h.status === 'pending' || h.status === 'active');
  const completedHabits = habits.filter(h => h.status === 'completed');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Pending Section */}
      {pendingHabits.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-50 mb-4">
            Pendentes ({pendingHabits.length})
          </h2>
          <div className="space-y-2">
            {pendingHabits.map((habit) => (
              <HabitCardCompact
                key={habit.id}
                habit={habit}
                onComplete={() => onComplete(habit.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Section */}
      {completedHabits.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-50 mb-4">
            Completados ({completedHabits.length})
          </h2>
          <div className="space-y-2">
            {completedHabits.map((habit) => (
              <HabitCardCompact
                key={habit.id}
                habit={habit}
              />
            ))}
          </div>
        </div>
      )}

      {habits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">Nenhum hábito encontrado</p>
        </div>
      )}
    </div>
  );
};

export default ListView;
