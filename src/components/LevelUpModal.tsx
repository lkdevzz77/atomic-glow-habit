import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { getLevelInfo } from '@/systems/levelSystem';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LevelUpModalProps {
  isOpen: boolean;
  oldLevel: number;
  newLevel: number;
  rewards?: string[];
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  oldLevel,
  newLevel,
  rewards = [],
  onClose,
}) => {
  const levelInfo = getLevelInfo(newLevel);
  const Icon = levelInfo.icon;

  useEffect(() => {
    if (isOpen) {
      // Confetti explosion
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 100 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass border-violet-500/50">
        <div className="text-center space-y-6 py-8">
          {/* Icon with glow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/50 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/50">
                <Icon size={64} className="text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              NÍVEL {newLevel} ALCANÇADO!
            </h2>
            <p className="text-2xl font-semibold text-slate-200">
              {levelInfo.title}
            </p>
          </div>

          {/* Description */}
          <p className="text-slate-300 max-w-xs mx-auto">
            Você está entre os top {Math.max(1, 11 - newLevel) * 10}% de usuários mais consistentes!
          </p>

          {/* Rewards */}
          {rewards.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">🎁 RECOMPENSAS</h3>
              <ul className="space-y-2">
                {rewards.map((reward, index) => (
                  <li key={index} className="text-sm text-slate-300 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    {reward}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-6 text-lg"
          >
            Continuar →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LevelUpModal;
