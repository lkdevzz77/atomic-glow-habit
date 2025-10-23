import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatMetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  className?: string;
}

const StatMetricCard = ({ icon, title, value, subtitle, className }: StatMetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      
      <div className="space-y-1">
        <h4 className="text-xs text-muted-foreground font-medium">{title}</h4>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </motion.div>
  );
};

export default StatMetricCard;
