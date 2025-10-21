import React from 'react';
import { LayoutDashboard, ListChecks, Calendar, BarChart3, Award, User, Settings, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from './ui/sidebar';
import { useLevel } from '@/hooks/useLevel';
import LevelBadge from './LevelBadge';
import { Progress } from './ui/progress';
import { ICON_SIZES } from '@/config/iconSizes';

const mainItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Meus Hábitos', url: '/habits', icon: ListChecks },
  { title: 'Estatísticas', url: '/stats', icon: BarChart3 },
];

const secondaryItems = [
  { title: 'Conquistas', url: '/badges', icon: Award },
  { title: 'Jornada de Nível', url: '/level-journey', icon: Zap },
  { title: 'Perfil', url: '/profile', icon: User },
  { title: 'Configurações', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { level, levelInfo, progress } = useLevel();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <img
            src="/atom-logo.png"
            alt=""
            className="w-10 h-10"
            style={{ filter: 'drop-shadow(0 0 12px rgba(124, 58, 237, 0.6))' }}
          />
          <span className="text-xl font-bold gradient-text">atomicTracker</span>
        </div>

        {/* SPRINT 2: Level Indicator no Sidebar */}
        <Link to="/level-journey">
          <div className="glass-violet card-rounded-sm p-3 hover:border-violet-400 transition-all cursor-pointer group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-3">
              <LevelBadge level={level} size="sm" animated={level >= 7} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-violet-400 font-semibold">NÍVEL {level}</p>
                <p className="text-sm text-slate-400 truncate">{levelInfo.title}</p>
              </div>
            </div>
            <Progress value={progress} className="h-1.5 mt-2" />
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.url;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url} className="text-base">
                        <Icon size={20} />
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
          <SidebarGroupLabel>Extras</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.url;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url} className="text-base">
                        <Icon size={20} />
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
    </Sidebar>
  );
}
