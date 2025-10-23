import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, Lock, Star } from 'lucide-react';

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
      <DialogContent className="max-w-md">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full">
              <Sparkles className="w-12 h-12 text-violet-500" />
            </div>
          </div>
          
          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Desbloqueie Seu Potencial Máximo 🚀
            </h2>
            <p className="text-sm text-muted-foreground/80">
              Usuários Pro alcançam objetivos 3x mais rápido e mantêm sequências 2x mais longas
            </p>
          </div>
          
          {/* Benefits */}
          <div className="space-y-3 text-left">
            {ALL_PRO_BENEFITS.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
          
          {/* Pricing */}
          <div className="p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-lg border border-violet-500/20">
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-sm text-muted-foreground line-through">R$11,99</span>
              <span className="text-sm text-muted-foreground">por apenas</span>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-violet-500">R$5,99</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ou R$49/ano (economize 31%)
            </p>
            <p className="text-xs text-violet-500 font-medium mt-2">
              7 dias grátis • Cancele quando quiser
            </p>
          </div>
          
          {/* CTA */}
          <div className="space-y-3">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-base font-semibold"
              size="lg"
            >
              Começar Trial Grátis de 7 Dias
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full"
              onClick={handleViewExample}
            >
              Ver exemplo
            </Button>
            
            <button 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
              onClick={() => onOpenChange(false)}
            >
              Continuar no Free
            </button>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Pagamento seguro
            </span>
            <span>•</span>
            <span>12.482 usuários Pro</span>
            <span>•</span>
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
