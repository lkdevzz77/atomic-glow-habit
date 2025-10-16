import React from "react";
import Textarea from "@/components/Textarea";
import { useApp } from "@/contexts/AppContext";

const Step2Identity = () => {
  const { onboardingData, updateOnboardingData } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-4xl font-bold text-slate-50">
          Imagine-se daqui a 6 meses,
        </h2>
        <h3 className="text-3xl font-bold gradient-text flex items-center justify-center gap-3">
          vivendo sua melhor versão
          <span className="text-4xl">🌟</span>
        </h3>
      </div>

      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-violet-400">
          Que tipo de pessoa você é?
        </h4>
        
        <Textarea
          value={onboardingData.desiredIdentity || ""}
          onChange={(e) => updateOnboardingData({ desiredIdentity: e.target.value })}
          placeholder="Descreva quem você quer ser..."
          className="min-h-[150px]"
        />

        <div className="bg-slate-800 border-l-4 border-violet-500 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-violet-400 font-semibold">
            <span className="text-xl">💭</span>
            <span>Pense em identidade, não em metas:</span>
          </div>
          <p className="text-slate-300 ml-7">
            "Sou uma pessoa que cuida da saúde"
          </p>
          <p className="text-slate-300 ml-7">
            "Sou uma pessoa que aprende constantemente"
          </p>
          <p className="text-slate-300 ml-7">
            "Sou uma pessoa organizada e produtiva"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step2Identity;
