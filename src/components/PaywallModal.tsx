import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Lock, Star, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import atomLogo from '@/assets/atom-logo.png';

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emphasize?: 'calendar' | 'stats' | 'habits';
  trigger?: string;
  onUpgrade?: () => void;
}

const ALL_PRO_BENEFITS = [
  "Hábitos ilimitados + Calendário anual completo",
  "Insights de IA personalizados e previsões",
  "Estatísticas avançadas e comparação de períodos",
  "Temas exclusivos + Exportar seus dados",
  "Badges premium + Níveis até 50"
];

export const PaywallModal: React.FC<PaywallModalProps> = ({ 
  open, 
  onOpenChange, 
  emphasize,
  trigger,
  onUpgrade 
}) => {
  const handleUpgrade = () => {
    onUpgrade?.();
    // TODO: Integrar com Stripe quando implementado
  };
  
  const handleViewExample = () => {
    // TODO: Mostrar preview de features Pro
    console.log('View example clicked', { emphasize, trigger });
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
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <span>Desbloqueie Seu Potencial Máximo</span>
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-violet-500" />
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground/80 px-2">
              Usuários Pro alcançam objetivos 3x mais rápido e mantêm sequências 2x mais longas
            </p>
          </div>
          
          {/* Benefits */}
          <div className="space-y-2 sm:space-y-3 text-left px-2 sm:px-0">
            {ALL_PRO_BENEFITS.map((benefit, i) => (
              <div key={i} className="flex items-start gap-2 sm:gap-3">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
          
          {/* Pricing */}
          <div className="p-3 sm:p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-lg border border-violet-500/20">
            <div className="flex items-baseline justify-center gap-1 sm:gap-2 mb-1 flex-wrap">
              <span className="text-xs sm:text-sm text-muted-foreground line-through">R$11,99</span>
              <span className="text-xs sm:text-sm text-muted-foreground">por apenas</span>
            </div>
            <div className="flex items-baseline justify-center gap-1 sm:gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-violet-500">R$5,99</span>
              <span className="text-sm sm:text-base text-muted-foreground">/mês</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ou R$49/ano (economize 31%)
            </p>
            <p className="text-xs text-violet-500 font-medium mt-2">
              7 dias grátis • Cancele quando quiser
            </p>
          </div>
          
          {/* CTA */}
          <div className="space-y-2 sm:space-y-3 px-2 sm:px-0">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm sm:text-base font-semibold"
              size="lg"
            >
              Começar Trial Grátis de 7 Dias
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs sm:text-sm"
              onClick={handleViewExample}
            >
              Ver exemplo
            </Button>
            
            <button 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors w-full py-2"
              onClick={() => onOpenChange(false)}
            >
              Continuar no Free
            </button>
          </div>
          
          {/* Footer */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground pt-2 border-t px-2">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span className="hidden xs:inline">Pagamento seguro</span>
              <span className="xs:hidden">Seguro</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="text-center">12.482 usuários Pro</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              4.8/5
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
