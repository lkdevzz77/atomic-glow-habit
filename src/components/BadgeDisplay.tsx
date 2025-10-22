import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Lock, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  category: string;
  tier: string;
  xp_reward: number;
  hidden?: boolean;
}

interface UserBadge {
  badge_id: string;
  progress: number;
  unlocked: boolean;
  unlocked_at?: string;
  badges: Badge;
}

interface BadgeDisplayProps {
  mode?: 'grid' | 'upcoming' | 'scroll';
  filter?: 'all' | 'unlocked' | 'locked' | 'streak' | 'habits' | 'identity' | 'mastery' | 'special';
  limit?: number;
}

const BadgeDisplay = ({ mode = 'grid', filter = 'all', limit }: BadgeDisplayProps) => {
  const { user } = useAuth();

  const { data: userBadges, isLoading } = useQuery({
    queryKey: ['user-badges', user?.id, filter, limit],
    queryFn: async () => {
      let query = supabase
        .from('user_badges')
        .select(`
          badge_id,
          progress,
          unlocked,
          unlocked_at,
          badges (
            id,
            name,
            description,
            icon,
            target,
            category,
            tier,
            xp_reward,
            hidden
          )
        `)
        .eq('user_id', user?.id)
        .order('unlocked', { ascending: false });

      // Aplicar filtros
      if (filter === 'unlocked') {
        query = query.eq('unlocked', true);
      } else if (filter === 'locked') {
        query = query.eq('unlocked', false).order('progress', { ascending: false });
      } else if (filter !== 'all') {
        // Filtrar por categoria específica (streak, habits, identity, mastery, special)
        query = query.eq('badges.category', filter);
      }

      // Aplicar limite se for modo "upcoming"
      if (mode === 'upcoming' && limit) {
        query = query.eq('unlocked', false).limit(limit);
      } else if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Filtrar badges ocultas se não estiverem desbloqueadas
      return (data as UserBadge[]).filter(ub => 
        !ub.badges.hidden || ub.unlocked
      );
    },
    enabled: !!user?.id,
  });

  // Gradientes por tier
  const tierGradients = {
    bronze: 'from-amber-700 to-amber-900',
    silver: 'from-slate-400 to-slate-600',
    gold: 'from-yellow-400 to-yellow-600',
    legendary: 'from-purple-500 via-pink-500 to-purple-600',
  };

  const tierBorders = {
    bronze: 'border-amber-700',
    silver: 'border-slate-400',
    gold: 'border-yellow-500',
    legendary: 'border-purple-500',
  };

  const tierLabels = {
    bronze: 'Bronze',
    silver: 'Prata',
    gold: 'Ouro',
    legendary: 'Lendária',
  };

  const renderBadge = (ub: UserBadge) => {
    const badge = ub.badges;
    const progress = Math.min((ub.progress / badge.target) * 100, 100);
    const remaining = Math.max(badge.target - ub.progress, 0);
    const isUnlocked = ub.unlocked;

    return (
      <TooltipProvider key={badge.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "relative p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer group",
                isUnlocked
                  ? `bg-gradient-to-br ${tierGradients[badge.tier as keyof typeof tierGradients]} ${tierBorders[badge.tier as keyof typeof tierBorders]} shadow-lg hover:shadow-xl hover:scale-105`
                  : "bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 hover:border-slate-600"
              )}
            >
              {/* Tier Badge */}
              <div className="absolute top-2 right-2">
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                    badge.tier === 'legendary' && "bg-purple-500 text-white",
                    badge.tier === 'gold' && "bg-yellow-500 text-black",
                    badge.tier === 'silver' && "bg-slate-400 text-black",
                    badge.tier === 'bronze' && "bg-amber-700 text-white"
                  )}
                >
                  {tierLabels[badge.tier as keyof typeof tierLabels]}
                </span>
              </div>

              {/* Badge Icon */}
              <div className="text-center mb-3">
                <div className={cn(
                  "text-5xl mb-2 transition-all duration-300",
                  isUnlocked ? "filter-none" : "grayscale opacity-40"
                )}>
                  {isUnlocked ? badge.icon : <Lock className="w-12 h-12 mx-auto text-slate-600" />}
                </div>
              </div>

              {/* Badge Info */}
              <div className="text-center space-y-1">
                <h3 className={cn(
                  "font-bold text-base",
                  isUnlocked ? "text-white" : "text-slate-300"
                )}>
                  {badge.name}
                </h3>
                <p className={cn(
                  "text-xs leading-relaxed",
                  isUnlocked ? "text-white/80" : "text-slate-400"
                )}>
                  {badge.description}
                </p>
              </div>

              {/* Progress Bar (only for locked badges) */}
              {!isUnlocked && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{ub.progress}/{badge.target}</span>
                    <span className="font-medium text-violet-400">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500",
                        progress > 75 && "animate-pulse"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-slate-500">
                    Faltam {remaining}
                  </p>
                </div>
              )}

              {/* XP Reward (only for unlocked badges) */}
              {isUnlocked && (
                <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>+{badge.xp_reward} XP</span>
                </div>
              )}

              {/* Unlocked Date */}
              {isUnlocked && ub.unlocked_at && (
                <div className="mt-2 text-xs text-center text-white/60">
                  Desbloqueada em {new Date(ub.unlocked_at).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs space-y-1">
              <p className="font-semibold">{badge.name}</p>
              <p className="text-sm">{badge.description}</p>
              <p className="text-xs text-violet-400">
                {isUnlocked ? `Concedeu +${badge.xp_reward} XP` : `Recompensa: +${badge.xp_reward} XP`}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-800/50 h-52 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!userBadges || userBadges.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>Nenhuma conquista encontrada nesta categoria.</p>
      </div>
    );
  }

  // Diferentes layouts baseado no mode
  if (mode === 'scroll') {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        {userBadges.map(renderBadge)}
      </div>
    );
  }

  if (mode === 'upcoming') {
    return (
      <div className="space-y-3">
        {userBadges.map(renderBadge)}
      </div>
    );
  }

  // Default: grid layout
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {userBadges.map(renderBadge)}
    </div>
  );
};

export default BadgeDisplay;
