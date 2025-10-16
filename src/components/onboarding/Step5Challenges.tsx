import React from "react";
import Textarea from "@/components/Textarea";
import { useApp } from "@/contexts/AppContext";

const Step5Challenges = () => {
  const { onboardingData, updateOnboardingData } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold gradient-text flex items-center justify-center gap-3">
          Vamos entender seus desafios
          <span className="text-4xl">💭</span>
        </h2>
      </div>

      <div className="space-y-6">
        <Textarea
          label="O que você já tentou?"
          value={onboardingData.pastAttempts || ""}
          onChange={(e) => updateOnboardingData({ pastAttempts: e.target.value })}
          placeholder="Descreva tentativas anteriores..."
        />

        <Textarea
          label="O que funcionou?"
          value={onboardingData.whatWorked || ""}
          onChange={(e) => updateOnboardingData({ whatWorked: e.target.value })}
          placeholder="Momentos ou estratégias de sucesso..."
        />

        <Textarea
          label="O que NÃO funcionou?"
          value={onboardingData.whatDidntWork || ""}
          onChange={(e) => updateOnboardingData({ whatDidntWork: e.target.value })}
          placeholder="Obstáculos ou falhas anteriores..."
        />
      </div>
    </div>
  );
};

export default Step5Challenges;
