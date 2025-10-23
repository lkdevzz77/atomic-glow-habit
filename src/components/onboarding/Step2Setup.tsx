import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Input from '@/components/Input';
import { toast } from 'sonner';

const TIME_OPTIONS = [
  { value: 'morning', label: 'Manhã' },
  { value: 'afternoon', label: 'Tarde' },
  { value: 'evening', label: 'Noite' }
];

const Step2Setup = () => {
  const { onboardingData, updateOnboardingData } = useApp();
  const { user, updateOnboardingStatus } = useAuth();
  const navigate = useNavigate();
  const [goal, setGoal] = React.useState(onboardingData.initialGoal || 10);
  const [when, setWhen] = React.useState(onboardingData.when || '');
  const [where, setWhere] = React.useState(onboardingData.where || '');
  const [creating, setCreating] = React.useState(false);

  const habitTitle = onboardingData.habitCustom || 
    (onboardingData.habitType === 'read' ? 'Ler' : 
     onboardingData.habitType === 'exercise' ? 'Exercitar' : 
     onboardingData.habitType === 'meditate' ? 'Meditar' : 'Hábito');

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setGoal(value);
    updateOnboardingData({ initialGoal: value });
  };

  const handleCreateHabit = async () => {
    if (!user || !when || !where) return;

    setCreating(true);
    try {
      const { error } = await supabase.from('habits').insert({
        user_id: user.id,
        title: habitTitle,
        goal_target: goal,
        goal_unit: 'minutos',
        when_time: when,
        where_location: where,
        status: 'active',
        icon: onboardingData.habitType === 'read' ? '📚' : 
              onboardingData.habitType === 'exercise' ? '💪' : 
              onboardingData.habitType === 'meditate' ? '🧘' : '✨'
      });

      if (error) throw error;

      await updateOnboardingStatus(true);
      toast.success('Primeiro hábito criado! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Erro ao criar hábito. Tente novamente.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-2">
          Configurar "{habitTitle}"
        </h2>
      </div>

      <div className="space-y-5">
        {/* Goal Slider */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Meta diária
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="2"
              max="50"
              value={goal}
              onChange={handleGoalChange}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <span className="text-2xl font-bold text-violet-400 min-w-[4rem] text-right">
              {goal} min
            </span>
          </div>
        </div>

        {/* When */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Quando
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setWhen(option.value);
                  updateOnboardingData({ when: option.value });
                }}
                className={`
                  py-2 px-3 rounded-lg border transition-all text-sm
                  ${when === option.value
                    ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                    : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-600'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Where */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Onde
          </label>
          <Input
            type="text"
            placeholder="Ex: Na sala, no quarto..."
            value={where}
            onChange={(e) => {
              setWhere(e.target.value);
              updateOnboardingData({ where: e.target.value });
            }}
          />
        </div>
      </div>

      <button
        onClick={handleCreateHabit}
        disabled={!when || !where || creating}
        className={`
          w-full py-3 px-4 rounded-lg font-semibold transition-all
          ${!when || !where || creating
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700'
          }
        `}
      >
        {creating ? 'Criando...' : 'Criar Hábito e Começar 🎯'}
      </button>
    </div>
  );
};

export default Step2Setup;
