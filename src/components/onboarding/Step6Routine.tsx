import React from "react";
import Input from "@/components/Input";
import { useApp } from "@/contexts/AppContext";

const Step6Routine = () => {
  const { onboardingData, updateOnboardingData } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold gradient-text flex items-center justify-center gap-3">
          Mapeie sua rotina
          <span className="text-4xl">🗺️</span>
        </h2>
        <p className="text-slate-300">Isso ajudará a encontrar o melhor momento para seu hábito</p>
      </div>

      <div className="space-y-6">
        <Input
          label="Primeira coisa ao acordar"
          value={onboardingData.firstThingMorning || ""}
          onChange={(e) => updateOnboardingData({ firstThingMorning: e.target.value })}
          placeholder="Ex: Checar celular, ir ao banheiro..."
        />

        <Input
          label="Manhã típica"
          value={onboardingData.typicalMorning || ""}
          onChange={(e) => updateOnboardingData({ typicalMorning: e.target.value })}
          placeholder="Ex: Café da manhã, banho, trabalho..."
        />

        <Input
          label="Início do trabalho/estudo"
          value={onboardingData.workStart || ""}
          onChange={(e) => updateOnboardingData({ workStart: e.target.value })}
          placeholder="Ex: 9h, após levar filhos na escola..."
        />
      </div>
    </div>
  );
};

export default Step6Routine;
