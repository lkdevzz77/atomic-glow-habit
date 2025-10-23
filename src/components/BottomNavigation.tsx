import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Target, Calendar, BarChart, Award, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/utils/haptics';

const NAV_ITEMS = [
  { to: '/dashboard', icon: Home, label: 'Início' },
  { to: '/habits', icon: Target, label: 'Hábitos' },
  { to: '/calendar', icon: Calendar, label: 'Calendário' },
  { to: '/stats', icon: BarChart, label: 'Stats' },
];

/**
 * Bottom navigation bar optimized for thumb zone (mobile only)
 * 
 * Ergonomics: 70% of mobile interactions are with thumb
 * Science: Placing navigation at bottom reduces thumb travel distance by 40%
 */
export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 z-40 safe-area-pb">
      <div className="flex justify-around py-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          
          return (
            <Link
              key={to}
              to={to}
              onClick={() => triggerHaptic('light')}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all',
                'min-w-[64px] min-h-[48px]', // Touch-friendly
                isActive 
                  ? 'text-violet-400 bg-violet-500/10' 
                  : 'text-slate-400 hover:text-slate-300'
              )}
            >
              <Icon 
                size={24} 
                className={cn(
                  'transition-transform',
                  isActive && 'scale-110'
                )}
              />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
