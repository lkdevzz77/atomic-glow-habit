import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Flame, User, TrendingUp } from 'lucide-react';
import { ICON_SIZES } from '@/config/iconSizes';

export default function BadgesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: stats } = useQuery({
    queryKey: ['badges-stats', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_badges')
        .select('unlocked')
        .eq('user_id', user?.id);

      if (error) throw error;

      const total = data.length;
      const unlocked = data.filter(b => b.unlocked).length;
      const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;

      return { total, unlocked, percentage };
    },
    enabled: !!user?.id,
  });

  return (
    <div className="container max-w-7xl py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-page-title flex items-center gap-3">
          <Trophy className="text-amber-500" size={ICON_SIZES['2xl']} />
          Suas Conquistas
        </h1>
        <p className="text-subtitle">
          Acompanhe seu progresso e desbloqueie novas conquistas
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-rounded card-padding bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/30">
            <div className="flex items-center gap-3">
              <Trophy className="text-amber-500" size={ICON_SIZES.xl} />
              <div>
                <p className="text-label">Conquistadas</p>
                <p className="text-stat-value text-amber-400">{stats.unlocked}</p>
              </div>
            </div>
          </div>

          <div className="card-rounded card-padding bg-card border-2 border-border">
            <div className="flex items-center gap-3">
              <Target className="text-violet-400" size={ICON_SIZES.xl} />
              <div>
                <p className="text-label">Total</p>
                <p className="text-stat-value">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card-rounded card-padding bg-card border-2 border-border">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-emerald-400" size={ICON_SIZES.xl} />
              <div>
                <p className="text-label">Progresso</p>
                <p className="text-stat-value text-emerald-400">{stats.percentage}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 lg:w-auto">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="unlocked">Conquistadas</TabsTrigger>
          <TabsTrigger value="locked">Bloqueadas</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
          <TabsTrigger value="habits">Hábitos</TabsTrigger>
          <TabsTrigger value="identity">Identidade</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <BadgeDisplay mode="grid" filter="all" />
        </TabsContent>

        <TabsContent value="unlocked" className="mt-6">
          <BadgeDisplay mode="grid" filter="unlocked" />
        </TabsContent>

        <TabsContent value="locked" className="mt-6">
          <BadgeDisplay mode="grid" filter="locked" />
        </TabsContent>

        <TabsContent value="streaks" className="mt-6">
          <p className="text-muted-foreground text-sm mb-4">
            Conquistas relacionadas a sequências e consistência
          </p>
          <BadgeDisplay mode="grid" filter="all" />
        </TabsContent>

        <TabsContent value="habits" className="mt-6">
          <p className="text-muted-foreground text-sm mb-4">
            Conquistas relacionadas à criação e conclusão de hábitos
          </p>
          <BadgeDisplay mode="grid" filter="all" />
        </TabsContent>

        <TabsContent value="identity" className="mt-6">
          <p className="text-muted-foreground text-sm mb-4">
            Conquistas relacionadas à construção de identidade
          </p>
          <BadgeDisplay mode="grid" filter="all" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
