import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerAtomicAnimation } from '@/utils/atomicParticles';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: string;
  xp_reward: number;
}

interface BadgeUnlockedModalProps {
  badge: Badge | null;
  open: boolean;
  onClose: () => void;
}

const tierGradients = {
  bronze: 'from-amber-700 to-amber-900',
  silver: 'from-slate-400 to-slate-600',
  gold: 'from-yellow-400 to-yellow-600',
  legendary: 'from-purple-500 via-pink-500 to-purple-600',
};

const tierLabels = {
  bronze: 'Bronze',
  silver: 'Prata',
  gold: 'Ouro',
  legendary: 'Lendária',
};

export default function BadgeUnlockedModal({ badge, open, onClose }: BadgeUnlockedModalProps) {
  useEffect(() => {
    if (open && badge) {
      // Delay para animação aparecer após modal abrir
      setTimeout(() => {
        triggerAtomicAnimation(0.5, 0.4);
      }, 300);
    }
  }, [open, badge]);

  if (!badge) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto">
            <div
              className={cn(
                'inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br',
                tierGradients[badge.tier as keyof typeof tierGradients],
                'animate-scale-in shadow-2xl'
              )}
            >
              <span className="text-7xl">{badge.icon}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-violet-500 text-white">
              {tierLabels[badge.tier as keyof typeof tierLabels]}
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              🎉 Conquista Desbloqueada!
            </DialogTitle>
            <DialogDescription className="text-lg font-semibold text-violet-300">
              {badge.name}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-center text-slate-300 text-sm leading-relaxed">
            {badge.description}
          </p>

          {/* XP Reward */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-2 border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <div className="text-center">
                <p className="text-xs text-emerald-300 font-medium uppercase tracking-wide">
                  Recompensa de XP
                </p>
                <p className="text-3xl font-bold text-emerald-400">
                  +{badge.xp_reward} XP
                </p>
              </div>
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            size="lg"
          >
            Continuar Jornada 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
