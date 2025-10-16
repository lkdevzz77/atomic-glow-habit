import React from "react";
import { HabitFormData } from "../NewHabitModal";
import { Edit2 } from "lucide-react";

interface SummaryStepProps {
  formData: HabitFormData;
  onEdit: (step: number) => void;
}

const SummaryStep = ({ formData, onEdit }: SummaryStepProps) => {
  const recommendedStart = formData.acceptedRecommendation
    ? Math.floor(formData.initialGoal / 4)
    : formData.initialGoal;
  const recommendedPhase2 = formData.acceptedRecommendation
    ? Math.floor(formData.initialGoal / 2)
    : formData.initialGoal;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-2">
          Seu novo hábito está pronto! ⚛️
        </h2>
        <p className="text-slate-300">Revise os detalhes antes de criar</p>
      </div>

      <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-violet-900/20 border-2 border-violet-500/50 rounded-2xl p-8 shadow-2xl shadow-violet-500/30">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-4xl shadow-lg shadow-violet-500/50">
            {formData.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-50">{formData.title}</h3>
            <p className="text-slate-400">Seu novo hábito atômico</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Meta */}
          <div className="flex items-start gap-3">
            <span className="text-xl">🎯</span>
            <div>
              <p className="text-sm text-violet-400 font-semibold">Meta:</p>
              <p className="text-slate-200">
                {formData.acceptedRecommendation ? (
                  <>
                    {recommendedStart} {formData.goalUnit} (dias 1-3) → {recommendedPhase2} {formData.goalUnit} (dias 4-7) → {formData.initialGoal} {formData.goalUnit}
                  </>
                ) : (
                  <>
                    {formData.initialGoal} {formData.goalUnit}
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quando */}
          <div className="flex items-start gap-3">
            <span className="text-xl">⏰</span>
            <div>
              <p className="text-sm text-violet-400 font-semibold">Quando:</p>
              <p className="text-slate-200">
                {formData.when} {formData.customTime && `(${formData.customTime})`}
              </p>
            </div>
          </div>

          {/* Onde */}
          <div className="flex items-start gap-3">
            <span className="text-xl">📍</span>
            <div>
              <p className="text-sm text-violet-400 font-semibold">Onde:</p>
              <p className="text-slate-200">{formData.where}</p>
            </div>
          </div>

          {/* Gatilho */}
          <div className="flex items-start gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-sm text-violet-400 font-semibold">Gatilho:</p>
              <p className="text-slate-200">Após {formData.trigger}</p>
            </div>
          </div>

          {/* Atratividade */}
          {(formData.temptationBundle || formData.environmentPrep || formData.socialReinforcement) && (
            <div className="flex items-start gap-3">
              <span className="text-xl">✨</span>
              <div className="flex-1">
                <p className="text-sm text-violet-400 font-semibold mb-1">Atratividade:</p>
                <ul className="text-slate-200 space-y-1 text-sm">
                  {formData.temptationBundle && <li>• {formData.temptationBundle}</li>}
                  {formData.environmentPrep && <li>• {formData.environmentPrep}</li>}
                  {formData.socialReinforcement && <li>• Compartilhar com {formData.socialReinforcement}</li>}
                </ul>
              </div>
            </div>
          )}

          {/* Recompensas */}
          {(formData.reward7Days || formData.reward30Days) && (
            <div className="flex items-start gap-3">
              <span className="text-xl">🎁</span>
              <div className="flex-1">
                <p className="text-sm text-violet-400 font-semibold mb-1">Recompensas:</p>
                <ul className="text-slate-200 space-y-1 text-sm">
                  {formData.reward7Days && <li>• 7 dias: {formData.reward7Days}</li>}
                  {formData.reward30Days && <li>• 30 dias: {formData.reward30Days}</li>}
                </ul>
              </div>
            </div>
          )}

          {/* Rastreamento */}
          <div className="flex items-start gap-3">
            <span className="text-xl">📊</span>
            <div>
              <p className="text-sm text-violet-400 font-semibold">Rastreamento:</p>
              <p className="text-slate-200">
                {formData.trackingPreferences?.map((p) => {
                  const labels: Record<string, string> = {
                    graphs: "Gráficos",
                    streak: "Streak",
                    heatmap: "Heatmap",
                    badges: "Badges",
                  };
                  return labels[p];
                }).join(", ")}
              </p>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-start gap-3">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-sm text-violet-400 font-semibold">Streak inicial:</p>
              <p className="text-slate-200">0 dias → Vamos começar!</p>
            </div>
          </div>
        </div>

        {/* Botões de Edição */}
        <div className="mt-6 pt-6 border-t border-slate-700 flex flex-wrap gap-2">
          {[
            { step: 1, label: "Lei #1" },
            { step: 2, label: "Lei #2" },
            { step: 3, label: "Lei #3" },
            { step: 4, label: "Lei #4" },
          ].map((btn) => (
            <button
              key={btn.step}
              onClick={() => onEdit(btn.step)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm flex items-center gap-2 transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Editar {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div className="text-center py-6 px-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <p className="text-slate-300 italic">
          💡 "Toda ação que você realiza é um voto para o tipo de pessoa que você deseja se tornar"
        </p>
        <p className="text-slate-400 text-sm mt-2">— James Clear</p>
      </div>
    </div>
  );
};

export default SummaryStep;
