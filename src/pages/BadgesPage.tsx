import React from 'react';
import { Lock } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function BadgesPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="max-w-2xl mx-auto space-y-6">
          <Breadcrumbs />
          
          {/* Card de "Em Desenvolvimento" */}
          <Card className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
                <div className="relative bg-gradient-to-br from-amber-500/20 to-yellow-500/20 p-6 rounded-full border-2 border-amber-500/30">
                  <Lock className="w-16 h-16 text-amber-500" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                🚧 Em Desenvolvimento
              </h1>
              <p className="text-lg text-muted-foreground">
                A página de conquistas estará disponível em breve!
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Estamos trabalhando para trazer um sistema completo de badges e recompensas 
                para tornar sua jornada ainda mais motivadora.
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/dashboard')}
              size="lg"
              className="mt-4"
            >
              Voltar ao Dashboard
            </Button>
          </Card>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
}
