import React from "react";
import { Plus, Sparkles } from "lucide-react";
import FocusCard from "../FocusCard";
import HabitCardCompact from "../HabitCardCompact";
import { Habit } from "@/types/habit";

interface FocusViewProps {
  habits: Habit[];
  onComplete: (habitId: number) => void;
  onAddHabit: () => void;
  isCompleting?: boolean;
}

const FocusView: React.FC<FocusViewProps> = ({ 
  habits, 
  onComplete, 
  onAddHabit,
  isCompleting 
}) => {
  // Separa os hábitos pendentes e concluídos
  const pendingHabits = habits.filter(h => h.status !== "completed");
  const completedHabits = habits.filter(h => h.status === "completed");

  const nextHabit = pendingHabits[0];
  const upcomingHabits = pendingHabits.slice(1);

  // Se não houver mais hábitos pendentes
  if (!nextHabit) {
    return (
      <div className="max-w-[600px] mx-auto">
        <div className="glass p-12 rounded-3xl text-center space-y-6 border border-violet-500/30">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-slate-50">
            Parabéns! 🎉
          </h2>
          
          <p className="text-lg text-slate-300">
            Todos os hábitos de hoje foram concluídos!
          </p>

          <button
            onClick={onAddHabit}
            className="w-full py-6 text-xl font-semibold rounded-2xl transition-all duration-200 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Plus className="w-6 h-6" />
            Adicionar Mais Hábitos
          </button>

          {/* Lista de Concluídos */}
          {completedHabits.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-700">
              <h3 className="text-sm font-semibold text-emerald-400 mb-4 text-left">
                CONCLUÍDOS HOJE ({completedHabits.length}) ✅
              </h3>
              <div className="space-y-2">
                {completedHabits.map((habit) => (
                  <HabitCardCompact key={habit.id} habit={habit} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto space-y-6">
      {/* Focus Card - Próximo Hábito */}
      <FocusCard
        habit={nextHabit}
        onComplete={() => onComplete(nextHabit.id)}
        isCompleting={isCompleting}
      />

      {/* Container para as listas de hábitos */}
      <div className="glass p-6 sm:p-8 rounded-2xl border border-slate-700 space-y-6">
        {/* Lista de Próximos Hábitos */}
        {upcomingHabits.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-4 px-2">
              PRÓXIMOS ({upcomingHabits.length})
            </h3>
            <div className="space-y-2">
              {upcomingHabits.map((habit) => (
                <HabitCardCompact
                  key={habit.id}
                  habit={habit}
                  onComplete={() => onComplete(habit.id)}
                  showCheckbox={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        {upcomingHabits.length > 0 && completedHabits.length > 0 && (
          <hr className="border-slate-700" />
        )}

        {/* Lista de Hábitos Concluídos */}
        {completedHabits.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-4 px-2">
              CONCLUÍDOS HOJE ({completedHabits.length}) ✅
            </h3>
            <div className="space-y-2">
              {completedHabits.map((habit) => (
                <HabitCardCompact key={habit.id} habit={habit} />
              ))}
            </div>
          </div>
        )}

        {/* Resumo do Dia */}
        <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-sm text-slate-400">
          <span>
            Hoje: <span className="font-semibold text-slate-300">{completedHabits.length}/{habits.length}</span>
          </span>
          <span>
            Semana: <span className="font-semibold text-slate-300">
              {habits.length > 0 ? Math.round((completedHabits.length / habits.length) * 100) : 0}%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default FocusView;