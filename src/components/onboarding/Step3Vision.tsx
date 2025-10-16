import React from "react";
import Textarea from "@/components/Textarea";
import { useApp } from "@/contexts/AppContext";

const Step3Vision = () => {
  const { onboardingData, updateOnboardingData } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-slate-50">
          Qual mudança específica te levaria até lá?
        </h2>
      </div>

      <div className="space-y-4">
        <Textarea
          value={onboardingData.specificChange || ""}
          onChange={(e) => updateOnboardingData({ specificChange: e.target.value })}
          placeholder="Descreva a mudança que você busca..."
          className="min-h-[150px]"
        />

        <div className="bg-slate-800 border-l-4 border-violet-500 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-violet-400 font-semibold">
            <span className="text-xl">🎯</span>
            <span>Exemplos:</span>
          </div>
          <div className="space-y-2 ml-7">
            <p className="text-slate-300">• Ler consistentemente para expandir conhecimento</p>
            <p className="text-slate-300">• Ter mais energia física através de exercícios</p>
            <p className="text-slate-300">• Ser mais organizado com meu tempo e espaço</p>
            <p className="text-slate-300">• Desenvolver uma prática de mindfulness</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Vision;
