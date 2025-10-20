import React from 'react';
import { Flame } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Button from './Button';

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

interface FocusCardProps {
  habit: Habit;
  onComplete: () => void;
}

const FocusCard: React.FC<FocusCardProps> = ({ habit, onComplete }) => {
  // Get Lucide icon
  const getIcon = () => {
    const iconName = habit.icon.replace(/[^a-zA-Z]/g, '');
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Circle;
    return IconComponent;
  };
  
  const Icon = getIcon();
  const progress = (habit.goal_current / habit.goal_target) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-violet-900/20 border border-slate-700 rounded-2xl p-8 text-center animate-fade-in">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
          <Icon className="w-12 h-12 text-white" strokeWidth={2} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-3xl font-bold text-slate-50 mb-3">
        {habit.title}
      </h3>

      {/* Metadata */}
      <p className="text-slate-400 mb-8">
        {habit.goal_target} {habit.goal_unit} • {habit.where_location}
      </p>

      {/* CTA Button */}
      <button
        onClick={onComplete}
        className="w-full py-4 text-base font-semibold bg-primary text-white rounded-xl hover:opacity-90 transition-opacity"
      >
        Marcar como Feito
      </button>

      {/* Streak */}
      {habit.streak > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2 text-orange-500">
          <Flame className="w-5 h-5" />
          <span className="text-sm font-semibold">
            Streak Atual: {habit.streak} dias
          </span>
        </div>
      )}
    </div>
  );
};

export default FocusCard;
