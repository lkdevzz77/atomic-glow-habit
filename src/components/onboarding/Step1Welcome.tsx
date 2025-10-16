import React from "react";
import Input from "@/components/Input";
import { useApp } from "@/contexts/AppContext";

const Step1Welcome = () => {
  const { onboardingData, updateOnboardingData } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-slate-50">
          Transforme sua vida com
        </h1>
        <h2 className="text-5xl font-bold gradient-text flex items-center justify-center gap-3">
          pequenos hábitos
          <span className="text-6xl animate-float" style={{ filter: "drop-shadow(0 0 20px rgba(124, 58, 237, 0.6))" }}>
            ⚛️
          </span>
        </h2>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-slate-50 mb-6 text-center">
          Primeiro, como podemos te chamar?
        </h3>
        
        <Input
          type="text"
          value={onboardingData.name || ""}
          onChange={(e) => updateOnboardingData({ name: e.target.value })}
          placeholder="Digite seu nome"
          className="text-lg text-center"
        />

        <div className="mt-4 flex items-start gap-3 bg-slate-800 border-l-4 border-violet-500 rounded-lg p-4">
          <span className="text-2xl">💡</span>
          <p className="text-slate-300">
            Seu nome será usado pelo coach IA para personalizar sua experiência
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1Welcome;
