import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/utils/haptics';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

/**
 * Floating Action Button for primary actions (mobile only)
 * 
 * UX: Always accessible, positioned in thumb zone
 * Material Design: Primary action button should be always visible
 */
export function FloatingActionButton({ 
  onClick, 
  className,
  label = 'Novo Hábito'
}: FloatingActionButtonProps) {
  const handleClick = () => {
    triggerHaptic('medium');
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        'md:hidden fixed bottom-20 right-4 z-50',
        'w-14 h-14 rounded-full',
        'bg-gradient-to-br from-violet-500 to-purple-600',
        'shadow-lg shadow-violet-500/50',
        'flex items-center justify-center',
        'transition-all',
        className
      )}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      aria-label={label}
    >
      <Plus className="text-white" size={24} />
    </motion.button>
  );
}
