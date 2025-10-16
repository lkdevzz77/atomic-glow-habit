import React from "react";
import { Sunrise, Coffee, Sun, Moon, Clock } from "lucide-react";
import Input from "@/components/Input";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

const Step7Law1 = () => {
  const { onboardingData, updateOnboardingData } = useApp();

  const timeOptions = [
    { id: "morning", label: "Ao acordar", icon: Sunrise },
    { id: "after-coffee", label: "Após café", icon: Coffee },
    { id: "afternoon", label: "Tarde", icon: Sun },
    { id: "evening", label: "Antes dormir", icon: Moon },
    { id: "custom", label: "Horário específico", icon: Clock }
  ];

  const getHabitLabel = () => {
    if (onboardingData.habitType === "custom") {
      return onboardingData.habitCustom || "seu hábito";
    }
    const labels: Record<string, string> = {
      read: "Ler 5 páginas",
      exercise: "Exercitar",
      water: "Beber água",
      meditate: "Meditar",
      gratitude: "Praticar gratidão"
    };
    return labels[onboardingData.habitType || ""] || "seu hábito";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-violet-400 text-2xl font-bold mb-4">
          <span className="text-3xl">🎯</span>
          <span>LEI #1: TORNE ÓBVIO</span>
        </div>
        <p className="text-slate-300 text-lg">
          Hábitos precisam de gatilhos claros
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-violet-400 font-semibold mb-3">
            QUANDO você fará {getHabitLabel()}?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {timeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => updateOnboardingData({ when: option.id })}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
                  onboardingData.when === option.id
                    ? "bg-violet-900/50 border-2 border-violet-500 shadow-lg shadow-violet-500/30"
                    : "bg-slate-700 border-2 border-slate-600 hover:border-violet-500/50"
                )}
              >
                <option.icon className="w-6 h-6 text-violet-400" />
                <span className="text-sm text-slate-200">{option.label}</span>
              </button>
            ))}
          </div>
          
          {onboardingData.when === "custom" && (
            <div className="mt-4 animate-slide-up">
              <Input
                type="time"
                value={onboardingData.customTime || ""}
                onChange={(e) => updateOnboardingData({ customTime: e.target.value })}
              />
            </div>
          )}
        </div>

        <Input
          label="ONDE?"
          value={onboardingData.where || ""}
          onChange={(e) => updateOnboardingData({ where: e.target.value })}
          placeholder="Ex: Sala, quarto, cozinha..."
        />

        <Input
          label="LOGO APÓS qual atividade? (Empilhamento)"
          value={onboardingData.triggerActivity || ""}
          onChange={(e) => updateOnboardingData({ triggerActivity: e.target.value })}
          placeholder="Ex: Escovar dentes, tomar café..."
        />

        {onboardingData.when && onboardingData.where && onboardingData.triggerActivity && (
          <div className="bg-gradient-to-r from-violet-900/50 to-slate-800 border-l-4 border-violet-500 rounded-lg p-6 animate-slide-up">
            <div className="flex items-center gap-2 text-violet-400 font-semibold mb-3">
              <span className="text-xl">📌</span>
              <span>SEU GATILHO</span>
            </div>
            <p className="text-slate-50 text-lg">
              "Logo após <span className="font-bold text-violet-400">{onboardingData.triggerActivity}</span>, 
              vou <span className="font-bold text-violet-400">{getHabitLabel()}</span> na{" "}
              <span className="font-bold text-violet-400">{onboardingData.where}</span>"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step7Law1;
