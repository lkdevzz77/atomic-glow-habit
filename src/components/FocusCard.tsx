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
    <div className="max-w-[600px] mx-auto">
      <div className="glass p-12 rounded-3xl text-center animate-fade-in">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <Icon className="w-20 h-20 text-primary" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-slate-50 mb-4">
          {habit.title}
        </h2>

        {/* Metadata */}
        <div className="flex items-center justify-center gap-4 text-base text-slate-400 mb-8">
          <span>{habit.goal_target} {habit.goal_unit}</span>
          <span>•</span>
          <span>{habit.where_location}</span>
          <span>•</span>
          <span>{habit.when_time}</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Progresso</span>
            <span>{habit.goal_current}/{habit.goal_target} {habit.goal_unit}</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <Button
          variant="primary"
          onClick={onComplete}
          className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary-light hover:opacity-90 transition-opacity"
        >
          Marcar como Feito
        </Button>

        {/* Streak */}
        {habit.streak > 0 && (
          <div className="mt-6 flex items-center justify-center gap-2 text-orange-500">
            <Flame className="w-5 h-5" />
            <span className="text-sm font-semibold">
              {habit.streak} dias de sequência
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusCard;
