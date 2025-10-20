import React from 'react';
import { CheckCircle } from 'lucide-react';
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

interface KanbanViewProps {
  habits: Habit[];
  onComplete: (habitId: number) => void;
}

const KanbanView: React.FC<KanbanViewProps> = ({ habits, onComplete }) => {
  const pendingHabits = habits.filter(h => h.status === 'pending' || h.status === 'active');
  const completedHabits = habits.filter(h => h.status === 'completed');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pending Column */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 min-h-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-50">Pendentes</h2>
          <span className="px-2 py-1 bg-slate-700 rounded-full text-xs font-semibold text-slate-300">
            {pendingHabits.length}
          </span>
        </div>
        
        <div className="space-y-2">
          {pendingHabits.length > 0 ? (
            pendingHabits.map((habit) => (
              <HabitCardCompact
                key={habit.id}
                habit={habit}
                onComplete={() => onComplete(habit.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <CheckCircle className="w-12 h-12 mb-2" />
              <p className="text-sm">Nenhum hábito pendente</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Column */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 min-h-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-50">Completados</h2>
          <span className="px-2 py-1 bg-primary/20 rounded-full text-xs font-semibold text-primary">
            {completedHabits.length}
          </span>
        </div>
        
        <div className="space-y-2">
          {completedHabits.length > 0 ? (
            completedHabits.map((habit) => (
              <HabitCardCompact
                key={habit.id}
                habit={habit}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <CheckCircle className="w-12 h-12 mb-2" />
              <p className="text-sm">Nenhum hábito completado ainda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanView;
