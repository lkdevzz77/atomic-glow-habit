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
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  xp?: number;
  nextLevelXP?: number;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  level, 
  size = 'md', 
  showTooltip = true,
  xp,
  nextLevelXP 
}) => {
  const levelInfo = getLevelInfo(level);
  const Icon = levelInfo.icon;
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
  };
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const badge = (
    <div
      className={cn(
        'rounded-full flex items-center justify-center',
        'bg-gradient-to-br from-violet-500 to-purple-600',
        'border-2 border-violet-400',
        'shadow-lg shadow-violet-500/30',
        'transition-transform hover:scale-110',
        sizeClasses[size]
      )}
    >
      <Icon size={iconSizes[size]} className="text-white" />
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
                {nextLevelXP - xp} XP para próximo nível
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LevelBadge;
