import React, { useMemo } from 'react';
import { Habit } from '@/types/habit';
import { Flame, Target, Sparkles } from 'lucide-react';

interface HabitInsightsProps {
  habits: Habit[];
}

const HabitInsights: React.FC<HabitInsightsProps> = ({ habits }) => {
  // Calcular insights
  const strongestHabit = useMemo(() => {
    if (!habits.length) return null;
    return habits.reduce((max, habit) => 
      (habit.streak || 0) > (max?.streak || 0) ? habit : max
    , habits[0]);
  }, [habits]);

  const needsAttention = useMemo(() => {
    if (!habits.length) return null;
    return habits.reduce((min, habit) => 
      (habit.streak || 0) < (min?.streak || 0) ? habit : min
    , habits[0]);
  }, [habits]);

  const totalHabitsActive = habits.filter(h => h.status === 'active').length;

  if (!habits.length) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <span>💡</span>
        Insights dos seus Hábitos
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hábito Mais Forte */}
        {strongestHabit && (
          <div className="glass card-rounded card-padding-lg">
            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/80 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">
                    🏆 Hábito Mais Forte
                  </p>
                  <p className="text-xl font-bold text-slate-100 mb-2">
                    {strongestHabit.title}
                  </p>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Flame className="w-4 h-4" />
                    <span className="font-semibold text-sm">
                      {strongestHabit.streak || 0} dias de sequência
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-xs italic text-slate-300 leading-relaxed">
                  "A qualidade do seu hábito mais forte determina a qualidade da sua vida."
                </p>
                <p className="text-xs text-emerald-400 mt-1">— Conceito Atômico</p>
              </div>
            </div>
          </div>
        )}

        {/* Hábito Precisa Atenção */}
        {needsAttention && strongestHabit?.id !== needsAttention?.id && (
          <div className="glass card-rounded card-padding-lg">
            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/80 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Target className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">
                    ⚡ Oportunidade de Melhoria
                  </p>
                  <p className="text-xl font-bold text-slate-100 mb-2">
                    {needsAttention.title}
                  </p>
                  <div className="flex items-center gap-2 text-amber-300">
                    <Target className="w-4 h-4" />
                    <span className="font-semibold text-sm">
                      {needsAttention.streak || 0} dias de sequência
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-xs italic text-slate-300 leading-relaxed">
                  "Nunca quebre a corrente. Mesmo 1% de esforço mantém o momento vivo."
                </p>
                <p className="text-xs text-amber-400 mt-1">— Regra dos 2 Minutos</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estatística de Identidade */}
      <div className="glass card-rounded card-padding-lg">
        <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/80">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1">
              <p className="text-sm text-violet-400 uppercase tracking-wider mb-1">
                Sistema de Hábitos Atômicos
              </p>
              <p className="text-2xl font-bold text-slate-100 mb-1">
                {totalHabitsActive} Hábitos Ativos
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Cada hábito é um <span className="text-violet-400 font-semibold">voto de identidade</span>. 
                Você está construindo a pessoa que quer se tornar, um átomo de cada vez.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitInsights;
