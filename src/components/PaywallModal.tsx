import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart, Trophy, CheckCircle2 } from 'lucide-react';

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: 'calendar' | 'stats' | 'habits';
  onUpgrade?: () => void;
}

const FEATURE_CONTENT = {
  calendar: {
    icon: Calendar,
    title: "Desbloqueie sua jornada anual",
    description: "Veja padrões, conquiste metas, visualize 365 dias de progresso",
    benefits: [
      "Calendário anual completo",
      "Heatmap de consistência",
      "Exportar para imagem"
    ]
  },
  stats: {
    icon: BarChart,
    title: "Descubra seus padrões",
    description: "Insights avançados para acelerar seu crescimento",
    benefits: [
      "Gráficos de tendência",
      "Insights de IA personalizados",
      "Previsão de streak",
      "Comparação de períodos"
    ]
  },
  habits: {
    icon: Trophy,
    title: "Parabéns! Você dominou 3 hábitos",
    description: "Usuários Pro têm em média 7 hábitos ativos e 3x mais XP",
    benefits: [
      "Hábitos ilimitados",
      "Todos os níveis (até 50)",
      "Badges exclusivos",
      "Temas personalizados"
    ]
  }
};

export const PaywallModal: React.FC<PaywallModalProps> = ({ 
  open, 
  onOpenChange, 
  feature,
  onUpgrade 
}) => {
  const content = FEATURE_CONTENT[feature];
  const Icon = content.icon;
  
  const handleUpgrade = () => {
    onUpgrade?.();
    // TODO: Integrar com Stripe quando implementado
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Icon className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {content.title}
            </h2>
            <p className="text-muted-foreground">
              {content.description}
            </p>
          </div>
          
          {/* Benefits */}
          <div className="space-y-3 text-left">
            {content.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
          
          {/* Pricing */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-bold text-primary">$5.99</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ou $49/ano (economize 31%)
            </p>
          </div>
          
          {/* CTA */}
          <div className="space-y-2">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              size="lg"
            >
              Desbloquear Pro 💎
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Talvez depois
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
