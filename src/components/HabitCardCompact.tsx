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
        "bg-card border border-border rounded-lg",
        "transition-all duration-200",
        "touch-target-comfortable", // Mobile touch target
        completedToday && "opacity-60",
        !completedToday && "hover:border-primary/50"
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-medium text-sm text-foreground mb-1",
          completedToday && "line-through text-muted-foreground"
        )}>
          {habit.title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="font-semibold text-foreground">{habit.streak}</span>
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
            "relative rounded-full border-2 border-border hover:border-primary hover:bg-accent transition-all flex-shrink-0",
            isMobile ? "w-12 h-12 touch-target-comfortable" : "w-10 h-10"
          )}
        >
          <CheckCircle className={cn(
            "text-muted-foreground hover:text-foreground mx-auto",
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
                "opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-2 hover:bg-accent",
                isMobile && "opacity-100"
              )}
              title="Desfazer"
            >
              <Undo2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HabitCardCompact;
