import React from 'react';
import { BookOpen, Dumbbell, Brain, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Input from '@/components/Input';

const HABIT_OPTIONS = [
  { id: 'read', label: 'Ler', icon: BookOpen },
  { id: 'exercise', label: 'Exercitar', icon: Dumbbell },
  { id: 'meditate', label: 'Meditar', icon: Brain },
  { id: 'custom', label: 'Outro', icon: Sparkles }
];

const Step1Quick = () => {
  const { onboardingData, updateOnboardingData } = useApp();
  const [showCustom, setShowCustom] = React.useState(false);

  const handleSelect = (habitId: string) => {
    if (habitId === 'custom') {
      setShowCustom(true);
      updateOnboardingData({ habitType: '', habitCustom: '' });
    } else {
      setShowCustom(false);
      const label = HABIT_OPTIONS.find(h => h.id === habitId)?.label || '';
      updateOnboardingData({ habitType: habitId, habitCustom: label });
    }
  };

  const handleCustomChange = (value: string) => {
    updateOnboardingData({ habitCustom: value, habitType: 'custom' });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-2">
          Qual hábito você quer construir?
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {HABIT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = option.id === 'custom' 
            ? showCustom 
            : onboardingData.habitType === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                p-6 rounded-xl border-2 transition-all
                ${isSelected 
                  ? 'border-violet-500 bg-violet-500/10' 
                  : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                }
              `}
            >
              <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-violet-400' : 'text-slate-400'}`} />
              <p className={`text-sm font-medium ${isSelected ? 'text-violet-300' : 'text-slate-300'}`}>
                {option.label}
              </p>
            </button>
          );
        })}
      </div>

      {showCustom && (
        <div className="animate-slide-down">
          <Input
            type="text"
            placeholder="Digite seu hábito..."
            value={onboardingData.habitCustom || ''}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="text-center"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default Step1Quick;
