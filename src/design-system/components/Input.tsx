import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  variant?: 'default' | 'ghost';
}

const Input: React.FC<InputProps> = ({ label, helper, className, variant = 'default', ...props }) => {
  return (
    <div className={cn('w-full', className)}>
      {label && <label className="block text-sm text-gray-300 mb-2">{label}</label>}
      <input
        {...props}
        className={cn(
          'w-full rounded-lg px-4 py-3 bg-gray-800 text-gray-100 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500',
          variant === 'ghost' && 'bg-transparent border-transparent',
        )}
      />
      {helper && <p className="mt-2 text-xs text-gray-500">{helper}</p>}
    </div>
  );
};

export default Input;
