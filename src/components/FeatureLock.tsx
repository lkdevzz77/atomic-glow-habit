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

export const FeatureLock: React.FC<FeatureLockProps> = ({ 
  feature, 
  children,
  fallback 
}) => {
  const { isPro, isLoading } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  
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
                <div className="p-3 bg-primary/10 rounded-full">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Recurso Premium
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Desbloqueie todo o potencial da sua jornada de hábitos
                </p>
              </div>
              <Button 
                onClick={() => setShowPaywall(true)}
                className="shadow-lg hover:shadow-xl transition-all hover:scale-105"
                size="lg"
              >
                🔓 Desbloquear Agora
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <PaywallModal 
        feature={feature}
        open={showPaywall}
        onOpenChange={setShowPaywall}
      />
    </>
  );
};
