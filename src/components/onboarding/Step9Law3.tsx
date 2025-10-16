import React, { useState } from "react";
import Input from "@/components/Input";
import { useApp } from "@/contexts/AppContext";
import { Sparkles } from "lucide-react";
import Button from "@/components/Button";

const Step9Law3 = () => {
  const { onboardingData, updateOnboardingData } = useApp();
  const [sliderValue, setSliderValue] = useState(onboardingData.initialGoal || 10);
  const [showAI, setShowAI] = useState(false);

  const getRecommendation = () => {
    const recommended = Math.max(Math.floor(sliderValue / 3), 2);
    return recommended;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    updateOnboardingData({ initialGoal: value, acceptedRecommendation: false });
    
    if (value >= 10) {
      setShowAI(true);
    }
  };

  const acceptRecommendation = () => {
    const recommended = getRecommendation();
    setSliderValue(recommended);
    updateOnboardingData({ initialGoal: recommended, acceptedRecommendation: true });
  };

  const getUnitLabel = () => {
    if (onboardingData.habitType === "read") return "páginas/dia";
    if (onboardingData.habitType === "exercise") return "minutos/dia";
    if (onboardingData.habitType === "water") return "copos/dia";
    if (onboardingData.habitType === "meditate") return "minutos/dia";
    if (onboardingData.habitType === "gratitude") return "itens/dia";
    return "unidades/dia";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-violet-400 text-2xl font-bold mb-4">
          <span className="text-3xl">🚀</span>
          <span>LEI #3: TORNE FÁCIL</span>
        </div>
        <p className="text-slate-300 text-lg">
          Comece absurdamente pequeno
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-violet-400 font-semibold mb-4">
            Meta inicial:
          </label>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-4xl font-bold text-slate-50">{sliderValue}</span>
            <span className="text-lg text-slate-300">{getUnitLabel()}</span>
          </div>

          <input
            type="range"
            min="1"
            max="50"
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-violet-600"
            style={{
              background: `linear-gradient(to right, rgb(124 58 237) 0%, rgb(124 58 237) ${(sliderValue / 50) * 100}%, rgb(51 65 85) ${(sliderValue / 50) * 100}%, rgb(51 65 85) 100%)`
            }}
          />
          
          <div className="flex justify-between text-sm text-slate-400 mt-2">
            <span>1</span>
            <span>5</span>
            <span>10</span>
            <span>20</span>
            <span>50</span>
          </div>
        </div>

        {showAI && (
          <div className="glass-violet border-2 border-violet-500/50 rounded-2xl p-6 space-y-4 animate-pulse-violet animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center animate-spin-gradient">
                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-violet-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-violet-400">COACH IA RECOMENDA</h3>
            </div>

            <p className="text-slate-200 leading-relaxed">
              "Pessoas com perfil similar tiveram mais sucesso começando com{" "}
              <span className="font-bold text-violet-400">{getRecommendation()} {getUnitLabel().split("/")[0]}</span> nos primeiros 3 dias."
            </p>

            <p className="text-slate-300 leading-relaxed">
              <span className="font-semibold text-violet-400">Regra dos 2 Minutos:</span> melhor fazer pouco 
              TODO DIA do que muito e desistir.
            </p>

            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={acceptRecommendation}
              >
                Aceitar ({getRecommendation()}→{Math.ceil(getRecommendation() * 1.5)}→{sliderValue})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAI(false)}
              >
                Manter ({sliderValue})
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-violet-400 font-semibold">
            REDUÇÃO DE ATRITO
          </label>
          <Input
            placeholder="O que você vai preparar com antecedência?"
            value={onboardingData.frictionReduction || ""}
            onChange={(e) => updateOnboardingData({ frictionReduction: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default Step9Law3;
