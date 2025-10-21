import React from 'react';
import { cn } from '@/lib/utils';
import { getLevelInfo } from '@/systems/levelSystem';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LevelBadgeProps {
  level: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTooltip?: boolean;
  showProgress?: boolean;
  animated?: boolean;
  xp?: number;
  nextLevelXP?: number;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  level, 
  size = 'md', 
  showTooltip = true,
  showProgress = false,
  animated = false,
  xp,
  nextLevelXP 
}) => {
  const levelInfo = getLevelInfo(level);
  const Icon = levelInfo.icon;
  
  // Cores progressivas por tier
  const getTierGradient = (lvl: number) => {
    if (lvl >= 10) return 'from-violet-500 via-purple-500 to-pink-500';
    if (lvl >= 8) return 'from-yellow-500 to-amber-500';
    if (lvl >= 6) return 'from-purple-500 to-violet-600';
    if (lvl >= 4) return 'from-cyan-500 to-blue-600';
    if (lvl >= 2) return 'from-lime-500 to-emerald-600';
    return 'from-emerald-500 to-teal-600';
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-24 h-24 text-xl',
    xl: 'w-32 h-32 text-2xl',
  };
  
  const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 28,
    xl: 40,
  };

  const gradient = getTierGradient(level);
  const progress = xp && nextLevelXP ? ((xp % nextLevelXP) / nextLevelXP) * 100 : 0;

  const badge = (
    <div className="relative inline-block">
      <div
        className={cn(
          'rounded-full flex items-center justify-center relative overflow-hidden',
          `bg-gradient-to-br ${gradient}`,
          'border-2 border-white/30',
          'shadow-lg',
          'transition-all duration-300',
          !showTooltip && 'hover:scale-110',
          animated && level >= 7 && 'animate-pulse-violet',
          sizeClasses[size]
        )}
      >
        {/* Animação de brilho para níveis altos */}
        {animated && level >= 7 && (
          <div className="absolute inset-0 animate-spin-slow opacity-30">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>
        )}

        <Icon size={iconSizes[size]} className="text-white relative z-10" />
      </div>

      {/* Progress ring ao redor */}
      {showProgress && xp !== undefined && nextLevelXP !== undefined && (
        <svg className="absolute inset-0 -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-white/20"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${progress * 2.83} 283`}
            className="text-violet-400 transition-all duration-500"
          />
        </svg>
      )}
    </div>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-semibold">Nível {level} • {levelInfo.title}</p>
            {xp !== undefined && nextLevelXP !== undefined && (
              <p className="text-xs text-slate-400 mt-1">
                {nextLevelXP - xp} votos para próximo nível
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LevelBadge;
