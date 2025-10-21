import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ProfileButton } from '@/components/ProfileButton';
import { ProfileDrawer } from '@/components/ProfileDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getXPForLevel } from '@/systems/levelSystem';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (!profile || !user) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  const xpForNextLevel = getXPForLevel(profile.level + 1);
  const xpForCurrentLevel = getXPForLevel(profile.level);
  const xpInCurrentLevel = (profile.xp || 0) - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;

  const userWithAvatar = {
    id: user.id,
    name: profile.name || 'Usuário',
    avatar_type: (profile.avatar_type as 'initials' | 'upload' | 'icon') || 'initials',
    avatar_icon: profile.avatar_icon,
    avatar_color: profile.avatar_color || 'violet',
    avatar_url: profile.avatar_url,
    xp: profile.xp || 0,
    level: profile.level || 1,
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />

              <div className="flex-1" />

              <ProfileButton
                compact
                user={userWithAvatar}
                onClick={() => setDrawerOpen(true)}
                xpForNextLevel={xpForNextLevel}
                xpInCurrentLevel={xpInCurrentLevel}
                xpNeededForNext={xpNeededForNext}
              />
            </div>
          </header>

          <main className="flex-1 p-6">
            {children}
          </main>
        </div>

        <ProfileDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          user={userWithAvatar}
          xpForNextLevel={xpForNextLevel}
          xpInCurrentLevel={xpInCurrentLevel}
          xpNeededForNext={xpNeededForNext}
          onAvatarUpdate={refetchProfile}
        />
      </div>
    </SidebarProvider>
  );
}
