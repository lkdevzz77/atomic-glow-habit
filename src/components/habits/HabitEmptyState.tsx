import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface HabitEmptyStateProps {
  onCreateHabit: () => void;
}

export const HabitEmptyState: React.FC<HabitEmptyStateProps> = ({ onCreateHabit }) => {
  const templates = [
    { icon: '📖', title: 'Ler 10 minutos', time: '7h', location: 'Quarto' },
    { icon: '🧘', title: 'Meditar 5 min', time: '6h', location: 'Sala' },
    { icon: '💧', title: 'Beber água', time: '8h', location: 'Cozinha' },
    { icon: '🏃', title: 'Exercício 15 min', time: '18h', location: 'Academia' },
  ];

  return (
    <div className="neuro-card card-rounded card-padding-lg text-center py-16">
      <div className="max-w-md mx-auto space-y-6">
        {/* Atomic Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20">
              <span className="text-8xl">⚛️</span>
            </div>
            <span className="text-8xl relative">⚛️</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-section-title">Sua jornada atômica começa aqui</h2>
          <p className="text-body text-muted-foreground">
            Cada hábito é um átomo que forma a pessoa que você quer se tornar.
          </p>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={onCreateHabit} 
          size="lg" 
          className="w-full sm:w-auto gap-2"
        >
          <Sparkles size={20} />
          Criar Primeiro Hábito
        </Button>

        {/* Templates */}
        <div className="pt-8 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
            <span>💡</span>
            <span className="font-semibold">Sugestões populares:</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={onCreateHabit}
                className="neuro-interactive card-rounded-sm p-4 text-left hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{template.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {template.time} · {template.location}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
