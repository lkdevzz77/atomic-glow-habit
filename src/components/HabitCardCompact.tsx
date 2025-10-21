import React from 'react';
import { CheckCircle, Square, Flame, Clock, MapPin } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  const completedToday = (habit as any).completedToday || false;
  
  // Get Lucide icon component directly from icon name
  const getIcon = () => {
    const IconComponent = (LucideIcons as any)[habit.icon];
    return IconComponent || LucideIcons.Circle;
  };
  
  const Icon = getIcon();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: 100 }}
      transition={{ duration: 0.3 }}
      whileHover={!completedToday ? { scale: 1.02, y: -2 } : {}}
      whileTap={!completedToday ? { scale: 0.98 } : {}}
      className={cn(
        "group relative flex items-center gap-4 px-5 py-4",
        "bg-gradient-to-r from-slate-800 to-slate-800/50",
        "border-l-4 rounded-xl",
        "transition-all duration-200",
        completedToday && "opacity-60 border-l-emerald-500",
        !completedToday && "border-l-violet-500 hover:border-l-violet-400 hover:shadow-lg hover:shadow-violet-500/20"
      )}
    >
      {/* Icon with glow effect */}
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg blur opacity-50" />
        <div className="relative w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-violet-400" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-semibold text-lg text-slate-100 mb-1",
          completedToday && "line-through text-slate-500"
        )}>
          {habit.title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {habit.when_time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {habit.when_time}
            </span>
          )}
          {habit.where_location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {habit.where_location}
            </span>
          )}
          {habit.streak > 0 && (
            <span className="flex items-center gap-1 text-orange-500 font-semibold">
              <Flame className="w-3 h-3" />
              {habit.streak}d
            </span>
          )}
        </div>
      </div>

      {/* Complete button */}
      {!completedToday && onComplete && (
        <button
          onClick={onComplete}
          className="relative w-10 h-10 rounded-full border-2 border-violet-500 hover:bg-violet-500/20 transition-all group-hover:scale-110 flex-shrink-0"
        >
          <CheckCircle className="w-5 h-5 text-violet-400 mx-auto" />
        </button>
      )}
      
      {completedToday && (
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
        </div>
      )}
    </motion.div>
  );
};

export default HabitCardCompact;
