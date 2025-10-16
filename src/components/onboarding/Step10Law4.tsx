import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useApp } from "@/contexts/AppContext";
import { Check, BarChart, Flame, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const Step10Law4 = () => {
  const { onboardingData, updateOnboardingData } = useApp();
  const [showDemo, setShowDemo] = useState(false);

  const trackingSystems = [
    { id: "visual", label: "Visual", icon: BarChart, description: "Gráficos e heatmaps" },
    { id: "streaks", label: "Streaks", icon: Flame, description: "Sequências de dias" },
    { id: "badges", label: "Badges", icon: Trophy, description: "Conquistas desbloqueáveis" },
    { id: "all", label: "Todos", icon: Sparkles, description: "Experiência completa [RECOMENDADO]" }
  ];

  const toggleTracking = (id: string) => {
    const current = onboardingData.trackingSystem || [];
    
    if (id === "all") {
      updateOnboardingData({ trackingSystem: ["visual", "streaks", "badges", "all"] });
    } else {
      const newSystems = current.includes(id)
        ? current.filter(s => s !== id && s !== "all")
        : [...current.filter(s => s !== "all"), id];
      updateOnboardingData({ trackingSystem: newSystems });
    }
  };

  const handleDemo = () => {
    setShowDemo(true);
    setTimeout(() => setShowDemo(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-violet-400 text-2xl font-bold mb-4">
          <span className="text-3xl">🎉</span>
          <span>LEI #4: TORNE SATISFATÓRIO</span>
        </div>
        <p className="text-slate-300 text-lg">
          Como vamos celebrar suas vitórias?
        </p>
      </div>

      <div className="space-y-6">
        {/* Test Feedback */}
        <div className="glass-violet border-2 border-violet-500/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-violet-400 mb-4">
            TESTE O FEEDBACK
          </h3>
          
          <Button
            variant="secondary"
            onClick={handleDemo}
            className="w-full mb-4"
          >
            <Check className="mr-2" />
            Testar Conclusão
          </Button>

          {showDemo && (
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl animate-scale-in">✓</div>
              </div>
              <div className="flex flex-col items-center gap-2 py-8">
                <div className="text-2xl font-bold gradient-text animate-slide-up">+10 pts</div>
                <div className="text-violet-400">🎊 Fantástico! 🎊</div>
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm text-slate-300">
            <p>Você verá:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Checkmark animado</li>
              <li>Confetti roxo</li>
              <li>+10 pts flutuando</li>
              <li>Glow effect</li>
            </ul>
          </div>
        </div>

        {/* Tracking Systems */}
        <div>
          <label className="block text-violet-400 font-semibold mb-4">
            SISTEMA DE RASTREAMENTO
          </label>
          
          <div className="grid gap-3">
            {trackingSystems.map((system) => (
              <button
                key={system.id}
                onClick={() => toggleTracking(system.id)}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl transition-all duration-200",
                  (onboardingData.trackingSystem || []).includes(system.id)
                    ? "bg-violet-900/50 border-2 border-violet-500"
                    : "bg-slate-700 border-2 border-slate-600 hover:border-violet-500/50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  system.id === "all" ? "bg-gradient-to-br from-violet-600 to-purple-600" : "bg-slate-600"
                )}>
                  <system.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-50">{system.label}</div>
                  <div className="text-sm text-slate-300">{system.description}</div>
                </div>
                {(onboardingData.trackingSystem || []).includes(system.id) && (
                  <Check className="w-5 h-5 text-violet-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
          <span className="text-slate-200">Som de sucesso</span>
          <button
            onClick={() => updateOnboardingData({ enableSound: !onboardingData.enableSound })}
            className={cn(
              "w-12 h-6 rounded-full transition-all duration-200",
              onboardingData.enableSound ? "bg-violet-600" : "bg-slate-600"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 bg-white rounded-full transition-transform duration-200",
                onboardingData.enableSound ? "translate-x-6" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
          <span className="text-slate-200">Vibração (mobile)</span>
          <button
            onClick={() => updateOnboardingData({ enableVibration: !onboardingData.enableVibration })}
            className={cn(
              "w-12 h-6 rounded-full transition-all duration-200",
              onboardingData.enableVibration ? "bg-violet-600" : "bg-slate-600"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 bg-white rounded-full transition-transform duration-200",
                onboardingData.enableVibration ? "translate-x-6" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        {/* Real Reward */}
        <Input
          label="RECOMPENSA REAL (após 7 dias):"
          value={onboardingData.realReward || ""}
          onChange={(e) => updateOnboardingData({ realReward: e.target.value })}
          placeholder="Ex: Um livro novo, jantar especial, filme no cinema..."
        />
      </div>
    </div>
  );
};

export default Step10Law4;
