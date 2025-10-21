import React from 'react';
import { User, Sparkles, Star, Zap, Flame, Crown, Award, Trophy, Medal, Atom, Rocket, Brain, Heart, Target, Mountain, Compass, Leaf } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import LevelBadge from './LevelBadge';

const ICON_MAP: Record<string, React.ElementType> = {
  User, Sparkles, Star, Zap, Flame, Crown, Award, Trophy, Medal, Atom, Rocket, Brain, Heart, Target, Mountain, Compass, Leaf
};

const COLOR_MAP: Record<string, string> = {
  violet: 'from-violet-600 to-purple-600',
  blue: 'from-blue-600 to-cyan-600',
  emerald: 'from-emerald-600 to-teal-600',
  amber: 'from-amber-600 to-orange-600',
  rose: 'from-rose-600 to-pink-600',
  indigo: 'from-indigo-600 to-violet-600',
};

interface ProfileButtonProps {
  compact?: boolean;
  user: {
    name: string;
    avatar_type: 'initials' | 'upload' | 'icon';
    avatar_icon?: string;
    avatar_color: string;
    avatar_url?: string;
    xp: number;
    level: number;
  };
  onClick: () => void;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  xpNeededForNext: number;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({
  compact = false,
  user,
  onClick,
  xpForNextLevel,
  xpInCurrentLevel,
  xpNeededForNext,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderAvatar = () => {
    const size = compact ? 'w-10 h-10' : 'w-14 h-14';
    const gradient = COLOR_MAP[user.avatar_color] || COLOR_MAP.violet;

    if (user.avatar_type === 'upload' && user.avatar_url) {
      return (
        <div className={`${size} rounded-full overflow-hidden ring-2 ring-primary/20`}>
          <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
        </div>
      );
    }

    if (user.avatar_type === 'icon' && user.avatar_icon) {
      const Icon = ICON_MAP[user.avatar_icon] || User;
      return (
        <div className={`${size} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center ring-2 ring-primary/20`}>
          <Icon className="text-white" size={compact ? 20 : 28} />
        </div>
      );
    }

    // Iniciais (padrão)
    return (
      <div className={`${size} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center ring-2 ring-primary/20`}>
        <span className="text-white font-bold" style={{ fontSize: compact ? '0.875rem' : '1.125rem' }}>
          {getInitials(user.name)}
        </span>
      </div>
    );
  };

  const progressPercentage = (xpInCurrentLevel / xpNeededForNext) * 100;

  if (compact) {
    return (
      <Button
        variant="ghost"
        onClick={onClick}
        className="relative h-auto p-2 hover:bg-accent/50"
      >
        <div className="relative">
          {renderAvatar()}
          <div className="absolute -bottom-1 -right-1">
            <LevelBadge level={user.level} size="sm" />
          </div>
        </div>
      </Button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-accent/50 transition-colors"
    >
      <div className="relative">
        {renderAvatar()}
        <div className="absolute -bottom-1 -right-1">
          <LevelBadge level={user.level} size="md" />
        </div>
      </div>
      
      <div className="w-full space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{xpInCurrentLevel} XP</span>
          <span>{xpNeededForNext} XP</span>
        </div>
        <Progress value={progressPercentage} className="h-1.5" />
      </div>
    </button>
  );
};
