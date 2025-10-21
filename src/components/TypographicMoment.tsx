import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

interface TypographicMomentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  message: string;
  quote?: string;
  quoteAuthor?: string;
  actionLabel?: string;
  type?: 'identity' | 'celebration' | 'reflection';
}

export const TypographicMoment: React.FC<TypographicMomentProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  message,
  quote,
  quoteAuthor = 'James Clear',
  actionLabel = 'Continuar',
  type = 'identity'
}) => {
  const gradientClass = type === 'identity' 
    ? 'bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent'
    : type === 'celebration'
    ? 'bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="max-w-3xl w-full text-center space-y-8"
            onClick={(e) => e.stopPropagation()}
          >
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground"
              >
                {subtitle}
              </motion.p>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-7xl font-extrabold leading-none tracking-tighter"
            >
              <span className={gradientClass}>
                {title}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto"
            >
              {message}
            </motion.p>

            {quote && (
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-lg md:text-xl italic text-slate-400 border-l-4 border-primary pl-6 py-4 max-w-2xl mx-auto text-left"
              >
                "{quote}"
                <footer className="text-sm text-primary mt-2 not-italic">
                  — {quoteAuthor}
                </footer>
              </motion.blockquote>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                size="lg"
                onClick={onClose}
                className="min-w-[200px] text-lg"
              >
                {actionLabel} →
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
