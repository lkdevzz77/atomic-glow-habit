import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { triggerAtomicAnimation } from '@/utils/atomicParticles';
import { cn } from '@/lib/utils';

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
      setTimeout(() => triggerAtomicAnimation(0.5, 0.4), 300);
    }
  }, [open, badge]);

  if (!badge) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900/95 border-2 border-violet-500/50">
        <div className={cn("p-8 bg-gradient-to-br rounded-t-lg", tierGradients[badge.tier as keyof typeof tierGradients])}>
          <div className="text-center space-y-4">
            <div className="text-8xl animate-scale-in">{badge.icon}</div>
            <span className={cn("px-4 py-2 rounded-full text-sm font-bold uppercase inline-block",
              badge.tier === 'legendary' && "bg-purple-500 text-white",
              badge.tier === 'gold' && "bg-yellow-500 text-black",
              badge.tier === 'silver' && "bg-slate-400 text-black",
              badge.tier === 'bronze' && "bg-amber-700 text-white"
            )}>
              {tierLabels[badge.tier as keyof typeof tierLabels]}
            </span>
            <h2 className="text-3xl font-bold text-white">Conquista Desbloqueada!</h2>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">{badge.name}</h3>
            <p className="text-slate-300">{badge.description}</p>
          </div>
          <div className="flex items-center justify-center gap-3 p-6 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/30">
            <Sparkles className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-sm text-emerald-300">Recompensa</p>
              <p className="text-3xl font-bold text-emerald-400">+{badge.xp_reward} XP</p>
            </div>
          </div>
          <Button onClick={onClose} className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
            Continuar Jornada
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
