import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { habitTemplates } from '@/data/habitTemplates';
import * as LucideIcons from 'lucide-react';

interface HabitEmptyStateProps {
  onCreateHabit: () => void;
  onSelectTemplate?: (template: typeof habitTemplates[0]) => void;
}

const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Atom;
};

export const HabitEmptyState = ({ onCreateHabit, onSelectTemplate }: HabitEmptyStateProps) => {
  // Pegar os 4 primeiros templates mais populares
  const popularTemplates = habitTemplates.slice(0, 4);

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
      {/* Atomic illustration */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-5xl sm:text-6xl">⚛️</span>
        </div>
        {/* Orbiting particles */}
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-violet-400 rounded-full animate-bounce" />
        <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
      </div>

      {/* Motivational text */}
      <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 max-w-md">
        Sua jornada atômica começa aqui
      </h3>

      <p className="text-sm sm:text-base text-slate-400 max-w-md mb-8 leading-relaxed">
        Cada hábito é um átomo que forma a pessoa que você quer se tornar.
        <br className="hidden sm:block" />
        <span className="text-violet-400 font-medium">Comece pequeno, pense grande.</span>
      </p>

      {/* CTA Button */}
      <Button 
        size="lg" 
        onClick={onCreateHabit}
        className="mb-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25"
      >
        <LucideIcons.Plus size={20} className="mr-2" />
        Criar Primeiro Hábito
      </Button>

      {/* Popular templates */}
      <div className="w-full max-w-4xl">
        <h4 className="text-sm font-semibold text-slate-400 mb-4 text-left">
          ✨ Hábitos Populares
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {popularTemplates.map((template) => {
            const Icon = getIconComponent(template.icon);
            return (
              <Card
                key={template.id}
                className="p-4 cursor-pointer hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 hover:scale-105 bg-slate-800/30 border-slate-700"
                onClick={() => onSelectTemplate ? onSelectTemplate(template) : onCreateHabit()}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-200 leading-tight">
                    {template.title}
                  </p>
                  <span className="text-xs text-slate-500">
                    {template.category}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
