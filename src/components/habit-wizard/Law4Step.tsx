import React, { useState } from "react";
import { HabitFormData } from "../NewHabitModal";
import { Check } from "lucide-react";

interface Law4StepProps {
  formData: HabitFormData;
  updateFormData: (data: Partial<HabitFormData>) => void;
}

const Law4Step = ({ formData, updateFormData }: Law4StepProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const testFeedback = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const toggleTracking = (pref: string) => {
    const current = formData.trackingPreferences || [];
    if (current.includes(pref)) {
      updateFormData({
        trackingPreferences: current.filter((p) => p !== pref),
      });
    } else {
      updateFormData({
        trackingPreferences: [...current, pref],
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-violet-400 mb-2">
          🎉 Lei #4: TORNE SATISFATÓRIO
        </h2>
        <p className="text-slate-300">Recompensas imediatas garantem consistência</p>
      </div>

      {/* Testar Feedback */}
      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600 relative overflow-hidden">
        <h3 className="text-sm font-semibold text-violet-300 mb-3">
          VISUALIZE O FEEDBACK
        </h3>
        <button
          onClick={testFeedback}
          className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-violet-500/70 hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Testar Efeito de Conclusão
        </button>
        <p className="text-xs text-slate-400 mt-3 text-center">
          Ao completar, você verá: Checkmark animado • Confetti roxo • +10 pontos • Glow effect • Streak incrementando
        </p>

        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "50%",
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              >
                {["🎉", "✨", "💜", "⭐"][Math.floor(Math.random() * 4)]}
              </div>
            ))}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-violet-400 animate-bounce">
              +10
            </div>
          </div>
        )}
      </div>

      {/* Preferências de Rastreamento */}
      <div>
        <label className="block text-sm font-medium text-violet-400 mb-3">
          PREFERÊNCIAS DE RASTREAMENTO
        </label>
        <p className="text-sm text-slate-300 mb-3">Marque o que te motiva:</p>
        <div className="space-y-2">
          {[
            { id: "graphs", label: "📊 Gráficos e estatísticas" },
            { id: "streak", label: "🔥 Contador de streak" },
            { id: "badges", label: "🏆 Badges e conquistas" },
            { id: "heatmap", label: "📈 Heatmap de consistência" },
          ].map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-violet-500/50 transition-all cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.trackingPreferences?.includes(option.id)}
                onChange={() => toggleTracking(option.id)}
                className="w-5 h-5 rounded border-slate-600 text-violet-600 focus:ring-2 focus:ring-violet-500/50"
              />
              <span className="text-slate-200">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Efeitos */}
      <div>
        <label className="block text-sm font-medium text-violet-400 mb-3">
          EFEITOS (OPCIONAL)
        </label>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600">
            <span className="text-slate-200">🔊 Som de sucesso</span>
            <button
              onClick={() => updateFormData({ enableSound: !formData.enableSound })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.enableSound ? "bg-violet-600" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.enableSound ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>
          <label className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600">
            <span className="text-slate-200">📳 Vibração (mobile)</span>
            <button
              onClick={() => updateFormData({ enableVibration: !formData.enableVibration })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.enableVibration ? "bg-violet-600" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.enableVibration ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Recompensas */}
      <div>
        <label className="block text-sm font-medium text-violet-400 mb-2">
          RECOMPENSA DE MARCO
        </label>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-300 mb-2">Quando completar 7 dias seguidos, vou:</p>
            <input
              type="text"
              value={formData.reward7Days}
              onChange={(e) => updateFormData({ reward7Days: e.target.value })}
              placeholder="Ex: comprar livro, ir ao cinema, jantar especial..."
              className="w-full bg-slate-700/50 border border-slate-600 text-slate-50 placeholder:text-slate-400 rounded-xl px-4 py-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 transition-all"
            />
          </div>
          <div>
            <p className="text-sm text-slate-300 mb-2">Quando completar 30 dias, vou:</p>
            <input
              type="text"
              value={formData.reward30Days}
              onChange={(e) => updateFormData({ reward30Days: e.target.value })}
              placeholder="Ex: viagem de fim de semana, curso especial..."
              className="w-full bg-slate-700/50 border border-slate-600 text-slate-50 placeholder:text-slate-400 rounded-xl px-4 py-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Law4Step;
