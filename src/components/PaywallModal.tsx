import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import atomLogo from '@/assets/atom-logo.png';

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emphasize?: 'calendar' | 'stats' | 'habits';
  trigger?: string;
  onUpgrade?: () => void;
}

const PRO_FEATURES = [
  {
    title: "Hábitos Ilimitados",
    detail: "vs 3 no Free"
  },
  {
    title: "Calendário Visual Completo",
    detail: "Bloqueado no Free"
  },
  {
    title: "Estatísticas Avançadas",
    detail: "Padrões e tendências"
  },
  {
    title: "Insights de IA",
    detail: "Previsões personalizadas"
  }
];

export const PaywallModal: React.FC<PaywallModalProps> = ({ 
  open, 
  onOpenChange, 
  onUpgrade 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    if (!open) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpgrade = () => {
    onUpgrade?.();
    // TODO: Integrar com Stripe quando implementado
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Logo Átomo Animada */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full animate-pulse" />
              
              {/* Logo */}
              <motion.img
                src={atomLogo}
                alt="atomicTracker Pro"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative z-10"
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  opacity: 1
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  duration: 0.6
                }}
              />
            </div>
          </div>
          
          {/* Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-2">
              Destrave Todo o Potencial
            </h2>
            <p className="text-sm text-slate-400">
              Usuários Pro mantêm hábitos 3x mais tempo
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-3 text-left">
            {PRO_FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-200">{feature.title}</p>
                  <p className="text-xs text-slate-400">{feature.detail}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pricing */}
          <div className="p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20">
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-4xl font-bold text-violet-400">R$ 11,99</span>
              <span className="text-slate-400">/mês</span>
            </div>
            <p className="text-sm text-slate-400 text-center">
              ou R$ 99/ano (economize 31%)
            </p>
          </div>
          
          {/* Urgency Timer */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            <span>Oferta expira em: {formatTime(timeRemaining)}</span>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-base font-semibold"
              size="lg"
            >
              Começar Trial de 7 Dias
            </Button>
            
            <button 
              className="text-sm text-slate-500 hover:text-slate-400 transition-colors w-full underline"
              onClick={() => onOpenChange(false)}
            >
              Continuar no Free
            </button>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
};
