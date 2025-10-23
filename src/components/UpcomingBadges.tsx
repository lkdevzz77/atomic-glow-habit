import React from "react";
import { Trophy, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import * as LucideIcons from 'lucide-react';

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
  badges: Badge;
}

const UpcomingBadges = () => {
  const { user } = useAuth();

  const { data: userBadges, isLoading } = useQuery({
    queryKey: ['user-badges', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          badge_id,
          progress,
          unlocked,
          badges (
            id,
            name,
            description,
            icon,
            target,
            category,
            tier,
            xp_reward
          )
        `)
        .eq('user_id', user?.id)
        .eq('unlocked', false)
        .order('progress', { ascending: false })
        .limit(3);

      if (error) throw error;
      
      // Filtrar badges ocultas
      return (data as UserBadge[]).filter(ub => !ub.badges.hidden);
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="glass rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-40"></div>
          <div className="h-20 bg-slate-700 rounded"></div>
          <div className="h-20 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!userBadges || userBadges.length === 0) return null;

  return (
    <div className="glass rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-bold text-slate-50">Próximas Conquistas</h3>
      </div>

      <div className="space-y-4">
        {userBadges.map((ub) => {
          const badge = ub.badges;
          const progress = Math.min((ub.progress / badge.target) * 100, 100);
          const remaining = Math.max(badge.target - ub.progress, 0);

          return (
            <div key={badge.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {(() => {
                    const IconComponent = LucideIcons[badge.icon as keyof typeof LucideIcons] as React.ComponentType<{ size?: number; className?: string }>;
                    return IconComponent ? <IconComponent size={24} className="text-violet-400" /> : <span className="text-2xl">{badge.icon}</span>;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-200 truncate">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {badge.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="text-violet-400 font-medium">
                      {ub.progress}/{badge.target}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">
                      Faltam {remaining}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-500",
                    progress > 75 && "animate-pulse"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <button className="w-full text-center text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors flex items-center justify-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Ver Todas as Conquistas
        </button>
      </div>
    </div>
  );
};

export default UpcomingBadges;
