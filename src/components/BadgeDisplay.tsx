import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Lock, Sparkles } from 'lucide-react';
import { ICON_SIZES } from '@/config/iconSizes';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  category: string;
}

interface UserBadge {
  badge_id: string;
  progress: number;
  unlocked: boolean;
  unlocked_at: string | null;
  badges: Badge;
}

interface BadgeDisplayProps {
  mode?: 'grid' | 'upcoming' | 'scroll';
  filter?: 'all' | 'unlocked' | 'locked';
  limit?: number;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  mode = 'grid',
  filter = 'all',
  limit,
}) => {
  const { user } = useAuth();

  const { data: userBadges, isLoading } = useQuery({
    queryKey: ['badge-display', user?.id, filter],
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
            category
          )
        `)
        .eq('user_id', user?.id);

      if (filter === 'unlocked') {
        query = query.eq('unlocked', true);
      } else if (filter === 'locked') {
        query = query.eq('unlocked', false);
      }

      if (mode === 'upcoming') {
        query = query
          .eq('unlocked', false)
          .order('progress', { ascending: false })
          .limit(limit || 3);
      } else if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as UserBadge[];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className={cn(
        'grid gap-4',
        mode === 'grid' && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        mode === 'scroll' && 'flex overflow-x-auto scrollbar-violet pb-4',
        mode === 'upcoming' && 'grid-cols-1'
      )}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="card-rounded bg-card h-48"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!userBadges || userBadges.length === 0) {
    return (
      <div className="text-center card-padding text-muted-foreground">
        Nenhuma conquista encontrada
      </div>
    );
  }

  const renderBadge = (ub: UserBadge) => {
    const badge = ub.badges;
    const progress = Math.min((ub.progress / badge.target) * 100, 100);
    const remaining = Math.max(badge.target - ub.progress, 0);
    const isAlmostThere = progress > 75 && !ub.unlocked;

    return (
      <TooltipProvider key={badge.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'card-rounded card-padding-sm transition-all duration-300 cursor-pointer',
                mode === 'scroll' && 'min-w-[180px]',
                ub.unlocked && [
                  'relative overflow-hidden',
                  'bg-gradient-to-br from-amber-500/20 to-yellow-500/20',
                  'border-2 border-amber-500/50',
                  'shadow-lg shadow-amber-500/20',
                  'hover:shadow-xl hover:shadow-amber-500/30',
                  'hover:scale-[1.02]'
                ],
                !ub.unlocked && ub.progress > 0 && [
                  'relative border-2 border-violet-500/50',
                  'bg-card',
                  'hover:border-violet-400',
                  'hover:scale-[1.02]',
                  isAlmostThere && 'animate-pulse-violet'
                ],
                !ub.unlocked && ub.progress === 0 && [
                  'bg-card/50 opacity-40',
                  'border-2 border-border',
                  'hover:opacity-60'
                ]
              )}
            >
              {/* Badge Desbloqueado */}
              {ub.unlocked && (
                <>
                  <div className="absolute top-2 right-2">
                    <span className="text-xs px-2 py-1 bg-amber-500/90 rounded-full text-white font-semibold flex items-center gap-1">
                      <Sparkles size={ICON_SIZES.xs} />
                      CONQUISTADO
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 pointer-events-none" />
                </>
              )}

              {/* Badge Quase Lá */}
              {isAlmostThere && (
                <div className="absolute -top-1 -right-1">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                  </span>
                </div>
              )}

              {/* Badge Bloqueado */}
              {!ub.unlocked && ub.progress === 0 && (
                <div className="absolute top-2 right-2">
                  <Lock size={ICON_SIZES.sm} className="text-muted-foreground/50" />
                </div>
              )}

              <div className="flex flex-col items-center gap-3 text-center">
                <div className={cn(
                  'text-5xl',
                  !ub.unlocked && ub.progress === 0 && 'grayscale blur-sm'
                )}>
                  {badge.icon}
                </div>

                <div className="space-y-1">
                  <h4 className={cn(
                    'font-bold',
                    ub.unlocked ? 'text-amber-100' : 'text-foreground'
                  )}>
                    {!ub.unlocked && ub.progress === 0 ? '???' : badge.name}
                  </h4>
                  <p className={cn(
                    'text-xs line-clamp-2',
                    ub.unlocked ? 'text-amber-200/80' : 'text-muted-foreground'
                  )}>
                    {!ub.unlocked && ub.progress === 0 ? 'Bloqueado' : badge.description}
                  </p>
                </div>

                {/* Progress para badges em andamento */}
                {!ub.unlocked && ub.progress > 0 && (
                  <div className="w-full space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-violet-400">{ub.progress}</span>
                      <span>{badge.target}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    {isAlmostThere && (
                      <p className="text-xs text-violet-400 font-bold animate-pulse">
                        Faltam apenas {remaining}!
                      </p>
                    )}
                  </div>
                )}

                {/* Data de desbloqueio */}
                {ub.unlocked && ub.unlocked_at && (
                  <p className="text-xs text-amber-300/70">
                    {new Date(ub.unlocked_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-semibold">{badge.name}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
              {!ub.unlocked && (
                <p className="text-xs text-violet-400">
                  Progresso: {ub.progress}/{badge.target}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className={cn(
      mode === 'grid' && 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4',
      mode === 'scroll' && 'flex gap-4 overflow-x-auto scrollbar-violet pb-4',
      mode === 'upcoming' && 'space-y-4'
    )}>
      {userBadges.map(renderBadge)}
    </div>
  );
};
