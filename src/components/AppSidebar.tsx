import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router-dom';
import { useLevel } from '@/hooks/useLevel';
import { Target, Home, Award, User, Settings, Calendar, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/utils/haptics';
import LevelBadge from '@/components/LevelBadge';

const mainItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Meus Hábitos', url: '/habits', icon: Target },
  { title: 'Calendário', url: '/calendar', icon: Calendar },
  { title: 'Estatísticas', url: '/stats', icon: BarChart },
];

const secondaryItems = [
  { title: 'Conquistas', url: '/badges', icon: Award },
  { title: 'Perfil', url: '/profile', icon: User },
  { title: 'Configurações', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { levelInfo, progress, xp, currentLevelXP, nextLevelXP } = useLevel();
  const { open } = useSidebar();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar 
      collapsible="offcanvas"
      className="sidebar-dark border-none"
    >
      <SidebarHeader className="p-4 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full" />
            <img 
              src="/atom-logo.png" 
              alt="Logo" 
              className="relative w-8 h-8"
              style={{ filter: 'brightness(1.1) saturate(1.3) hue-rotate(280deg) drop-shadow(0 0 8px rgba(139,92,246,0.6))' }}
            />
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-slate-200">atomicTracker</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-neuro">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 text-xs uppercase tracking-wider">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={active}
                      className={cn(
                        "relative transition-all duration-200 touch-target-comfortable",
                        active && [
                          "bg-slate-800/70 text-slate-100",
                          "before:absolute before:left-0 before:top-0 before:bottom-0",
                          "before:w-1 before:bg-primary before:rounded-r"
                        ],
                        !active && "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                      )}
                    >
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-3"
                        onClick={() => triggerHaptic('light')}
                      >
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 text-xs uppercase tracking-wider">
            Extras
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={active}
                      className={cn(
                        "relative transition-all duration-200 touch-target-comfortable",
                        active && [
                          "bg-slate-800/70 text-slate-100",
                          "before:absolute before:left-0 before:top-0 before:bottom-0",
                          "before:w-1 before:bg-primary before:rounded-r"
                        ],
                        !active && "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                      )}
                    >
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-3"
                        onClick={() => triggerHaptic('light')}
                      >
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-800/50">
        {open ? (
          <div className="flex items-center gap-3">
            <LevelBadge 
              level={levelInfo?.level || 1}
              size="sm"
              showProgress={true}
              showTooltip={false}
              xp={currentLevelXP}
              nextLevelXP={nextLevelXP}
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-200">
                Nível {levelInfo?.level || 1}
              </span>
              <span className="text-xs text-slate-400">
                {currentLevelXP !== undefined && nextLevelXP !== undefined 
                  ? `${Math.round((currentLevelXP / nextLevelXP) * 100)}% para próximo nível`
                  : '0% para próximo nível'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <LevelBadge 
              level={levelInfo?.level || 1}
              size="sm"
              showProgress={true}
              showTooltip={true}
              xp={currentLevelXP}
              nextLevelXP={nextLevelXP}
            />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
