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
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-slate-100 mb-4">
        Insights dos seus Hábitos
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hábito Mais Forte */}
        {strongestHabit && (
          <div className="glass-violet border-2 border-emerald-500/50 rounded-2xl p-6 bg-emerald-900/10">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                <Flame className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">
                  🏆 Hábito Mais Forte
                </p>
                <p className="text-2xl font-bold text-slate-100 mb-2">
                  {strongestHabit.title}
                </p>
                <div className="flex items-center gap-2 text-emerald-300">
                  <Flame className="w-4 h-4" />
                  <span className="font-semibold">
                    {strongestHabit.streak || 0} dias de sequência
                  </span>
                </div>
                
                <div className="mt-4 p-3 bg-emerald-950/50 border border-emerald-700/30 rounded-lg">
                  <p className="text-xs italic text-emerald-100 leading-relaxed">
                    "A qualidade do seu hábito mais forte determina a qualidade da sua vida."
                  </p>
                  <p className="text-xs text-emerald-400 mt-1">— Conceito Atômico</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hábito Precisa Atenção */}
        {needsAttention && strongestHabit?.id !== needsAttention?.id && (
          <div className="glass-violet border-2 border-amber-500/50 rounded-2xl p-6 bg-amber-900/10">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
                <Target className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">
                  ⚡ Oportunidade de Melhoria
                </p>
                <p className="text-2xl font-bold text-slate-100 mb-2">
                  {needsAttention.title}
                </p>
                <div className="flex items-center gap-2 text-amber-300">
                  <Target className="w-4 h-4" />
                  <span className="font-semibold">
                    {needsAttention.streak || 0} dias de sequência
                  </span>
                </div>
                
                <div className="mt-4 p-3 bg-amber-950/50 border border-amber-700/30 rounded-lg">
                  <p className="text-xs italic text-amber-100 leading-relaxed">
                    "Nunca quebre a corrente. Mesmo 1% de esforço mantém o momento vivo."
                  </p>
                  <p className="text-xs text-amber-400 mt-1">— Regra dos 2 Minutos</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estatística de Identidade */}
      <div className="glass-violet border-2 border-violet-500/50 rounded-2xl p-6 bg-gradient-to-br from-violet-900/20 to-purple-900/20">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/50">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-violet-400 uppercase tracking-wider mb-1">
              Sistema de Hábitos Atômicos
            </p>
            <p className="text-3xl font-bold text-slate-100 mb-1">
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
  );
};

export default HabitInsights;
