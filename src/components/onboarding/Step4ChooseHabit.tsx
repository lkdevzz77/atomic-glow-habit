import React, { useState } from "react";
import { BookOpen, Dumbbell, Droplet, Brain, Heart, Plus } from "lucide-react";
import Input from "@/components/Input";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

const Step4ChooseHabit = () => {
  const { onboardingData, updateOnboardingData } = useApp();
  const [showCustom, setShowCustom] = useState(false);

  const suggestions = [
    { id: "read", label: "Ler", icon: BookOpen, color: "from-violet-600 to-purple-600" },
    { id: "exercise", label: "Exercício", icon: Dumbbell, color: "from-purple-600 to-fuchsia-600" },
    { id: "water", label: "Água", icon: Droplet, color: "from-blue-500 to-cyan-500" },
    { id: "meditate", label: "Meditar", icon: Brain, color: "from-violet-500 to-purple-500" },
    { id: "gratitude", label: "Gratidão", icon: Heart, color: "from-pink-500 to-rose-500" },
    { id: "custom", label: "Custom", icon: Plus, color: "from-slate-600 to-slate-700" }
  ];

  const handleSelect = (id: string) => {
    if (id === "custom") {
      setShowCustom(true);
      updateOnboardingData({ habitType: "custom" });
    } else {
      setShowCustom(false);
      updateOnboardingData({ habitType: id, habitCustom: undefined });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2 sm:space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-50">
          Com base no que você disse,
        </h2>
        <h3 className="text-xl sm:text-2xl font-bold gradient-text">
          qual ÚNICO hábito você quer começar?
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => handleSelect(suggestion.id)}
            className={cn(
              "glass rounded-xl sm:rounded-2xl p-3 sm:p-6 flex flex-col items-center gap-2 sm:gap-4 transition-all duration-300 hover-scale",
              onboardingData.habitType === suggestion.id
                ? "border-2 border-violet-500 bg-violet-900/30 shadow-xl shadow-violet-500/50"
                : "border-2 border-slate-700 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20"
            )}
          >
            <div className={cn(
              "w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br flex items-center justify-center",
              suggestion.color,
              "shadow-lg"
            )}>
              <suggestion.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <span className="text-sm sm:text-lg font-semibold text-slate-50">{suggestion.label}</span>
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="animate-slide-up">
          <Input
            label="Defina seu hábito personalizado"
            value={onboardingData.habitCustom || ""}
            onChange={(e) => updateOnboardingData({ habitCustom: e.target.value })}
            placeholder="Ex: Aprender inglês, tocar violão..."
          />
        </div>
      )}
    </div>
  );
};

export default Step4ChooseHabit;
