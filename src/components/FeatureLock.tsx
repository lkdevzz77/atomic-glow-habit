import React, { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { PaywallModal } from './PaywallModal';
import { Button } from './ui/button';
import { Lock } from 'lucide-react';

interface FeatureLockProps {
  feature: 'calendar' | 'stats' | 'habits';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LOCK_MESSAGES = {
  calendar: {
    title: "Visualize 365 Dias de Progresso",
    subtitle: "Descubra padrões que transformam hábitos em identidade"
  },
  stats: {
    title: "IA Prevê Suas Próximas Sequências",
    subtitle: "Evite recaídas antes que elas aconteçam"
  },
  habits: {
    title: "Desbloqueie Hábitos Ilimitados",
    subtitle: "Usuários Pro têm média de 7 hábitos ativos"
  }
};

export const FeatureLock: React.FC<FeatureLockProps> = ({ 
  feature, 
  children,
  fallback 
}) => {
  const { isPro, isLoading } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  const lockMessage = LOCK_MESSAGES[feature];
  
  if (isLoading) {
    return <div className="animate-pulse bg-muted/50 rounded-lg h-64" />;
  }
  
  if (isPro) {
    return <>{children}</>;
  }
  
  return (
    <>
      {fallback || (
        <div className="relative min-h-[400px]">
          {/* Blurred content */}
          <div className="blur-sm pointer-events-none opacity-40 select-none">
            {children}
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-background/80 via-background/60 to-background/80">
            <div className="text-center space-y-4 p-6">
              <div className="flex justify-center">
                <div className="p-3 bg-violet-500/10 rounded-full">
                  <Lock className="w-8 h-8 text-violet-500" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {lockMessage.title}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {lockMessage.subtitle}
                </p>
              </div>
              <Button 
                onClick={() => setShowPaywall(true)}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                size="lg"
              >
                Ver Planos Pro 💎
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <PaywallModal 
        open={showPaywall}
        onOpenChange={setShowPaywall}
        emphasize={feature}
      />
    </>
  );
};
