import React from 'react';
import { Plus, Target } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Target className="w-8 h-8 text-muted-foreground" />
      </div>
      
      {/* Heading */}
      <h3 className="text-xl font-bold text-foreground mb-2">
        Nenhum hábito ainda
      </h3>
      
      {/* Description */}
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        Comece sua jornada criando seu primeiro hábito.
        Pequenos passos levam a grandes transformações.
      </p>

      {/* CTA Button */}
      <Button onClick={onCreateHabit}>
        <Plus className="w-4 h-4 mr-2" />
        Criar Primeiro Hábito
      </Button>
      
      {/* Popular Habits */}
      <div className="w-full max-w-4xl mt-12">
        <h4 className="text-sm font-semibold text-foreground mb-4">
          Hábitos Populares
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularTemplates.map((template) => {
            const Icon = getIconComponent(template.icon);
            
            return (
              <Card
                key={template.id}
                className="p-4 cursor-pointer hover:border-primary transition-colors bg-card border-border"
                onClick={() => onSelectTemplate ? onSelectTemplate(template) : onCreateHabit()}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  {Icon && (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">{template.title}</p>
                    <p className="text-xs text-muted-foreground">{template.category}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
