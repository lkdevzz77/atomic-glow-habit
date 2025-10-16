import React from "react";
import { HabitFormData } from "../NewHabitModal";

interface Law3StepProps {
  formData: HabitFormData;
  updateFormData: (data: Partial<HabitFormData>) => void;
}

const Law3Step = ({ formData, updateFormData }: Law3StepProps) => {
  const recommendedStart = Math.floor(formData.initialGoal / 4);
  const recommendedPhase2 = Math.floor(formData.initialGoal / 2);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-violet-400 mb-2">
          🚀 Lei #3: TORNE FÁCIL
        </h2>
        <p className="text-slate-300">Comece absurdamente pequeno (Regra dos 2 Minutos)</p>
      </div>

      {/* Meta */}
      <div>
        <label className="block text-sm font-medium text-violet-400 mb-3">
          Qual sua meta?
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="60"
            value={formData.initialGoal}
            onChange={(e) => updateFormData({ initialGoal: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-violet-600 [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-violet-500/50"
          />
          <div className="text-3xl font-bold text-violet-400 min-w-[80px] text-center">
            {formData.initialGoal}
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>1</span>
          <span>30</span>
          <span>60</span>
        </div>
      </div>

      {/* Unidade */}
      <div>
        <label className="block text-sm font-medium text-violet-400 mb-3">Unidade:</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["minutos", "páginas", "repetições", "outro"].map((unit) => (
            <button
              key={unit}
              onClick={() => updateFormData({ goalUnit: unit })}
              className={`p-3 rounded-xl border-2 text-sm transition-all ${
                formData.goalUnit === unit
                  ? "border-violet-500 bg-violet-900/30 text-violet-300"
                  : "border-slate-700 bg-slate-700 text-slate-300 hover:border-violet-500/50"
              }`}
            >
              {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Recomendação IA */}
      <div className="bg-gradient-to-br from-violet-900/50 via-purple-900/30 to-slate-800 border-2 border-violet-500/50 rounded-2xl p-6 shadow-lg shadow-violet-500/30">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center animate-spin-slow">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-violet-300 mb-3">
              SEU COACH IA RECOMENDA
            </h3>
            <div className="space-y-3 text-slate-200">
              <p>
                Para ter sucesso duradouro, aplique a <strong>Regra dos 2 Minutos</strong>:
              </p>
              <div className="space-y-2 bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-violet-400">📖</span>
                  <span>
                    Comece com <strong className="text-violet-300">{recommendedStart} {formData.goalUnit}</strong> nos primeiros 3 dias
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-violet-400">📈</span>
                  <span>
                    Aumente para <strong className="text-violet-300">{recommendedPhase2} {formData.goalUnit}</strong> nos próximos 4 dias
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-violet-400">🎯</span>
                  <span>
                    Depois vá para <strong className="text-violet-300">{formData.initialGoal} {formData.goalUnit}</strong> completo
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-300">
                Pessoas que começam pequeno têm <strong>3x mais chance</strong> de manter o hábito por 90+ dias.
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => updateFormData({ acceptedRecommendation: true })}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  formData.acceptedRecommendation
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/50"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                ✓ Aceitar Progressão
              </button>
              <button
                onClick={() => updateFormData({ acceptedRecommendation: false })}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  !formData.acceptedRecommendation
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/50"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Manter Meta Original
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Redução de Atrito */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-violet-400 mb-2">
          <input
            type="checkbox"
            checked={!!formData.frictionReduction}
            onChange={(e) => updateFormData({ frictionReduction: e.target.checked ? "" : undefined })}
            className="w-5 h-5 rounded border-slate-600 text-violet-600 focus:ring-2 focus:ring-violet-500/50"
          />
          REDUÇÃO DE ATRITO
        </label>
        {formData.frictionReduction !== undefined && (
          <input
            type="text"
            value={formData.frictionReduction || ""}
            onChange={(e) => updateFormData({ frictionReduction: e.target.value })}
            placeholder="O que você vai preparar com antecedência?"
            className="w-full bg-slate-700/50 border border-slate-600 text-slate-50 placeholder:text-slate-400 rounded-xl px-4 py-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 transition-all animate-slide-down"
          />
        )}
      </div>
    </div>
  );
};

export default Law3Step;
