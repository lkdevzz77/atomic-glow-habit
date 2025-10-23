import React, { useState } from 'react';
import { CheckCircle, Square, Flame, Clock, MapPin, Trash2, Undo2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/utils/haptics';
import { useIsMobile } from '@/hooks/use-mobile';

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
  onDelete?: () => void;
  onUndo?: () => void;
}

const HabitCardCompact: React.FC<HabitCardCompactProps> = ({ habit, onComplete, onDelete, onUndo }) => {
  const completedToday = (habit as any).completedToday || false;
  const isMobile = useIsMobile();
  const [showActions, setShowActions] = useState(false);
  
  // Swipe gesture state
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['rgba(239, 68, 68, 0.2)', 'transparent', 'rgba(16, 185, 129, 0.2)']
  );
  
  // Get Lucide icon component directly from icon name
  const getIcon = () => {
    const IconComponent = (LucideIcons as any)[habit.icon];
    return IconComponent || LucideIcons.Circle;
  };
  
  const Icon = getIcon();

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (!isMobile || completedToday) return;

    // Swipe right to complete (>100px)
    if (info.offset.x > 100 && onComplete) {
      triggerHaptic('success');
      onComplete();
    }
    // Swipe left to delete (<-100px)
    else if (info.offset.x < -100 && onDelete) {
      triggerHaptic('warning');
      onDelete();
    }
    
    // Reset position
    x.set(0);
  };

  return (
    <motion.div
      layout
      drag={isMobile && !completedToday ? "x" : false}
      dragConstraints={{ left: -150, right: 150 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ x, background }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: 100 }}
      transition={{ duration: 0.3 }}
      whileHover={!completedToday && !isMobile ? { scale: 1.02, y: -2 } : {}}
      whileTap={!completedToday ? { scale: 0.98 } : {}}
      className={cn(
        "group relative flex items-center gap-4 px-5 py-4",
        "bg-gradient-to-r from-slate-800 to-slate-800/50",
        "border-l-2 rounded-xl",
        "transition-all duration-200",
        "touch-target-comfortable", // Mobile touch target
        completedToday && "opacity-60 border-l-emerald-500",
        !completedToday && "border-l-violet-500 hover:border-l-violet-400 hover:shadow-lg hover:shadow-violet-500/15"
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

      {/* Complete button - Touch optimized for mobile */}
      {!completedToday && onComplete && (
        <button
          onClick={() => {
            triggerHaptic('medium');
            onComplete();
          }}
          className={cn(
            "relative rounded-full border-2 border-violet-500 hover:bg-violet-500/20 transition-all group-hover:scale-110 flex-shrink-0",
            isMobile ? "w-12 h-12 touch-target-comfortable" : "w-10 h-10" // Larger on mobile
          )}
        >
          <CheckCircle className={cn(
            "text-violet-400 mx-auto",
            isMobile ? "w-6 h-6" : "w-5 h-5"
          )} />
        </button>
      )}
      
      {completedToday && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {onUndo && (
            <button
              onClick={() => {
                triggerHaptic('light');
                onUndo();
              }}
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-2 hover:bg-slate-700/50",
                isMobile && "opacity-100" // Always visible on mobile
              )}
              title="Desfazer"
            >
              <Undo2 className="w-4 h-4 text-slate-400 hover:text-slate-300" />
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HabitCardCompact;
