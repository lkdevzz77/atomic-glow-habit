import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-800/50',
        className
      )}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: height ? (typeof height === 'number' ? `${height}px` : height) : '20px',
      }}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('p-6 rounded-lg bg-slate-800/30 backdrop-blur-sm space-y-4', className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-2" />
        <Skeleton className="h-2 w-4/5" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

interface SkeletonChartProps {
  className?: string;
  bars?: number;
}

export function SkeletonChart({ className, bars = 7 }: SkeletonChartProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-end h-32 gap-2">
        {Array.from({ length: bars }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-t-md"
            height={Math.random() * 100 + 20}
          />
        ))}
      </div>
      <div className="flex justify-between gap-2">
        {Array.from({ length: bars }).map((_, i) => (
          <Skeleton key={`label-${i}`} className="w-full h-4" />
        ))}
      </div>
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-slate-600',
        'border-t-violet-500',
        sizeClass,
        className
      )}
    />
  );
}

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 space-y-4',
        className
      )}
    >
      {/* O componente Icon já é passado como prop, então podemos usá-lo diretamente */}
      <Icon className="w-12 h-12 text-slate-600" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
        <p className="text-sm text-slate-400 max-w-sm">{description}</p>
      </div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}