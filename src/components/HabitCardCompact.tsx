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
        flex flex-col sm:flex-row items-start sm:items-center gap-3
        h-auto sm:h-[60px] px-4 py-3
        bg-slate-800/50 hover:bg-slate-700/30 
        border border-slate-700 rounded-lg
        transition-all duration-200 hover:scale-[1.01]
        ${isCompleted ? 'opacity-60' : ''}
      `}
    >
      {/* Checkbox */}
      <button
        onClick={onComplete}
        className="flex-shrink-0 transition-colors"
        disabled={isCompleted}
      >
        {isCompleted ? (
          <CheckSquare className="w-6 h-6 text-primary" />
        ) : (
          <Square className="w-6 h-6 text-slate-400 hover:text-primary" />
        )}
      </button>

      {/* Icon */}
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-medium text-slate-200 truncate ${isCompleted ? 'line-through' : ''}`}>
          {habit.title}
        </h3>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>{habit.where_location} • {habit.when_time}</span>
      </div>

      {/* Progress */}
      <div className="text-sm font-semibold text-slate-300">
        {habit.goal_current}/{habit.goal_target}
      </div>

      {/* Streak */}
      {habit.streak > 0 && (
        <div className="flex items-center gap-1 text-xs text-orange-500">
          <Flame className="w-4 h-4" />
          <span>{habit.streak}d</span>
        </div>
      )}
    </div>
  );
};

export default HabitCardCompact;
