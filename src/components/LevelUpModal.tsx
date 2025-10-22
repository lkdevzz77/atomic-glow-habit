import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, Check, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { getLevelInfo, getNextLevelRewards } from "@/systems/levelSystem";

interface LevelUpModalProps {
  isOpen: boolean;
  oldLevel: number;
  newLevel: number;
  rewards?: string[];
  onClose: () => void;
}

const LevelUpModal = ({ isOpen, oldLevel, newLevel, rewards, onClose }: LevelUpModalProps) => {
  const levelInfo = getLevelInfo(newLevel);
  const nextRewards = getNextLevelRewards(newLevel);
  const LevelIcon = levelInfo.icon;

  useEffect(() => {
    if (isOpen) {
      // Confetti animation quando abrir
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-center space-y-4">
            {/* Ícone do Nível */}
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full animate-pulse blur-xl opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                <LevelIcon className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                +{newLevel - oldLevel}
              </div>
            </div>

            {/* Título */}
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Nível {newLevel}!
              </h2>
              <p className="text-xl text-violet-400 mt-1">{levelInfo.title}</p>
            </div>
          </DialogTitle>

          <DialogDescription className="text-center text-slate-300">
            Você subiu de nível! Continue assim para desbloquear mais conquistas.
          </DialogDescription>
        </DialogHeader>

        {/* Recompensas Desbloqueadas */}
        {rewards && rewards.length > 0 && (
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Recompensas Desbloqueadas
            </h3>
            <ul className="space-y-2">
              {rewards.map((reward, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{reward}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Próximos Objetivos */}
        {nextRewards && nextRewards.length > 0 && (
          <div className="bg-slate-800/30 p-4 rounded-lg space-y-2 border border-slate-700">
            <h3 className="font-semibold text-slate-400 text-sm flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Próximo Nível ({newLevel + 1})
            </h3>
            <ul className="space-y-1">
              {nextRewards.map((reward, i) => (
                <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-1 h-1 bg-violet-500 rounded-full" />
                  {reward}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botão de Fechar */}
        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-3 shadow-lg"
        >
          <Trophy className="w-5 h-5 mr-2" />
          Continuar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LevelUpModal;
