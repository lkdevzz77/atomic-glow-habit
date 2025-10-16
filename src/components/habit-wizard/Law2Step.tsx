import React, { useState } from "react";
import { HabitFormData } from "../NewHabitModal";

interface Law2StepProps {
  formData: HabitFormData;
  updateFormData: (data: Partial<HabitFormData>) => void;
}

const suggestions = [
  { label: "☕ Café especial", value: "tomar café especial" },
  { label: "📱 Redes sociais", value: "checar redes sociais" },
  { label: "🎵 Música", value: "ouvir música favorita" },
  { label: "🍫 Algo gostoso", value: "comer algo gostoso" },
  { label: "📺 Episódio série", value: "assistir episódio de série" },
  { label: "🎮 Jogar", value: "jogar um pouco" },
];

const Law2Step = ({ formData, updateFormData }: Law2StepProps) => {
  const [showTemptation, setShowTemptation] = useState(!!formData.temptationBundle);
  const [showEnvironment, setShowEnvironment] = useState(!!formData.environmentPrep);
  const [showSocial, setShowSocial] = useState(!!formData.socialReinforcement);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-violet-400 mb-2">
          ✨ Lei #2: TORNE ATRAENTE
        </h2>
        <p className="text-slate-300">Como tornar esse hábito irresistível?</p>
      </div>

      {/* Agrupamento de Tentações */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-violet-300">
            1️⃣ AGRUPAMENTO DE TENTAÇÕES
          </label>
          <button
            onClick={() => {
              setShowTemptation(!showTemptation);
              if (showTemptation) updateFormData({ temptationBundle: undefined });
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showTemptation ? "bg-violet-600" : "bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showTemptation ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {showTemptation && (
          <div className="space-y-3 animate-slide-down">
            <p className="text-sm text-slate-300">
              Só vou fazer isso depois de completar o hábito:
            </p>
            <input
              type="text"
              value={formData.temptationBundle || ""}
              onChange={(e) => updateFormData({ temptationBundle: e.target.value })}
              placeholder="Digite sua recompensa..."
              className="w-full bg-slate-700/50 border border-slate-600 text-slate-50 placeholder:text-slate-400 rounded-lg px-4 py-2 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 transition-all"
            />
            <div className="flex flex-wrap gap-2">
              {suggestions.map((sug) => (
                <button
                  key={sug.value}
                  onClick={() => updateFormData({ temptationBundle: sug.value })}
                  className="bg-violet-900/30 hover:bg-violet-800/50 text-violet-300 rounded-full px-4 py-2 text-sm transition-all"
                >
                  {sug.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preparação do Ambiente */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-violet-300">
            2️⃣ PREPARAÇÃO DO AMBIENTE
          </label>
          <button
            onClick={() => {
              setShowEnvironment(!showEnvironment);
              if (showEnvironment) updateFormData({ environmentPrep: undefined });
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showEnvironment ? "bg-violet-600" : "bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showEnvironment ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {showEnvironment && (
          <div className="space-y-2 animate-slide-down">
            <p className="text-sm text-slate-300">Vou deixar visível/preparado:</p>
            <input
              type="text"
              value={formData.environmentPrep || ""}
              onChange={(e) => updateFormData({ environmentPrep: e.target.value })}
              placeholder="Ex: roupa pronta, livro na mesa, garrafa cheia..."
              className="w-full bg-slate-700/50 border border-slate-600 text-slate-50 placeholder:text-slate-400 rounded-lg px-4 py-2 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 transition-all"
            />
          </div>
        )}
      </div>

      {/* Reforço Social */}
      <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-violet-300">
            3️⃣ REFORÇO SOCIAL (OPCIONAL)
          </label>
          <button
            onClick={() => {
              setShowSocial(!showSocial);
              if (showSocial) updateFormData({ socialReinforcement: undefined });
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showSocial ? "bg-violet-600" : "bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showSocial ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {showSocial && (
          <div className="space-y-2 animate-slide-down">
            <p className="text-sm text-slate-300">Vou compartilhar meu progresso com:</p>
            <input
              type="text"
              value={formData.socialReinforcement || ""}
              onChange={(e) => updateFormData({ socialReinforcement: e.target.value })}
              placeholder="Nome de alguém que vai te apoiar..."
              className="w-full bg-slate-700/50 border border-slate-600 text-slate-50 placeholder:text-slate-400 rounded-lg px-4 py-2 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 transition-all"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Law2Step;
