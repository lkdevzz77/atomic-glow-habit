import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlight';
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ variant = 'default', className, children, ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        'rounded-xl p-6 bg-[rgba(30,41,59,0.5)] border border-gray-700 shadow-lg',
        variant === 'highlight' && 'bg-gradient-to-br from-brand-900 to-gray-800 shadow-xl',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
