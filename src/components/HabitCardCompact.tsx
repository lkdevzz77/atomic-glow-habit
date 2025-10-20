import React from 'react';
import { CheckSquare, Square, Flame } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

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

interface HabitCardCompactProps {
  habit: Habit;
  onComplete?: () => void;
}

const HabitCardCompact: React.FC<HabitCardCompactProps> = ({ habit, onComplete }) => {
  const isCompleted = habit.status === 'completed';
  
  // Get Lucide icon
  const getIcon = () => {
    const iconName = habit.icon.replace(/[^a-zA-Z]/g, '');
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Circle;
    return IconComponent;
  };
  
  const Icon = getIcon();
  
  // Category color
  const categoryColors: Record<string, string> = {
    health: 'text-emerald-500',
    exercise: 'text-orange-500',
    meditation: 'text-violet-500',
    read: 'text-blue-500',
    hydration: 'text-cyan-500',
  };
  
  const iconColor = categoryColors[habit.icon] || 'text-slate-400';

  return (
    <div
      className={`
        flex items-center gap-4 px-4 py-4
        bg-slate-800 rounded-xl
        transition-all duration-200
        ${isCompleted ? 'opacity-60' : 'hover:bg-slate-700/50'}
      `}
    >
      {/* Icon */}
      <div className="text-2xl flex-shrink-0">
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-slate-200 ${isCompleted ? 'line-through text-slate-500' : ''}`}>
          {habit.title}
        </h3>
      </div>

      {/* Action */}
      {!isCompleted && onComplete && (
        <button
          onClick={onComplete}
          className="flex-shrink-0 text-slate-400 hover:text-primary transition-colors"
        >
          <Square className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default HabitCardCompact;
