import React, { useState } from "react";
import Input from "@/components/Input";
import { useApp } from "@/contexts/AppContext";
import { Coffee, Smartphone, Music, Candy } from "lucide-react";
import { cn } from "@/lib/utils";

const Step8Law2 = () => {
  const { onboardingData, updateOnboardingData } = useApp();
  const [enableTemptation, setEnableTemptation] = useState(false);
  const [enableEnvironment, setEnableEnvironment] = useState(false);
  const [enableSocial, setEnableSocial] = useState(false);

  const temptations = [
    { id: "coffee", label: "Café", icon: Coffee },
    { id: "social", label: "Social Media", icon: Smartphone },
    { id: "music", label: "Música", icon: Music },
    { id: "treat", label: "Guloseima", icon: Candy }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-violet-400 text-2xl font-bold mb-4">
          <span className="text-3xl">✨</span>
          <span>LEI #2: TORNE ATRAENTE</span>
        </div>
        <p className="text-slate-300 text-lg">
          Como tornar isso irresistível?
        </p>
      </div>

      <div className="space-y-6">
        {/* Temptation Bundling */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-violet-400 font-semibold">
              1️⃣ AGRUPAMENTO DE TENTAÇÕES
            </label>
            <button
              onClick={() => setEnableTemptation(!enableTemptation)}
              className={cn(
                "w-12 h-6 rounded-full transition-all duration-200",
                enableTemptation ? "bg-violet-600" : "bg-slate-700"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 bg-white rounded-full transition-transform duration-200",
                  enableTemptation ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
          
          {enableTemptation && (
            <div className="space-y-3 animate-slide-up">
              <p className="text-sm text-slate-300">
                Só vou fazer X depois de completar o hábito
              </p>
              <div className="flex flex-wrap gap-2">
                {temptations.map((tempt) => (
                  <button
                    key={tempt.id}
                    onClick={() => updateOnboardingData({ temptationBundle: tempt.label })}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
                      onboardingData.temptationBundle === tempt.label
                        ? "bg-violet-900/50 border border-violet-500 text-violet-300"
                        : "bg-violet-900/30 hover:bg-violet-800/50 text-violet-400 border border-transparent"
                    )}
                  >
                    <tempt.icon className="w-4 h-4" />
                    {tempt.label}
                  </button>
                ))}
              </div>
              <Input
                placeholder="Ou descreva sua recompensa..."
                value={onboardingData.temptationBundle || ""}
                onChange={(e) => updateOnboardingData({ temptationBundle: e.target.value })}
              />
            </div>
          )}
        </div>

        {/* Environment Prep */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-violet-400 font-semibold">
              2️⃣ PREPARAÇÃO DO AMBIENTE
            </label>
            <button
              onClick={() => setEnableEnvironment(!enableEnvironment)}
              className={cn(
                "w-12 h-6 rounded-full transition-all duration-200",
                enableEnvironment ? "bg-violet-600" : "bg-slate-700"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 bg-white rounded-full transition-transform duration-200",
                  enableEnvironment ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
          
          {enableEnvironment && (
            <div className="animate-slide-up">
              <Input
                placeholder="Ex: Deixar livro na mesa, roupa de ginástica pronta..."
                value={onboardingData.environmentPrep || ""}
                onChange={(e) => updateOnboardingData({ environmentPrep: e.target.value })}
              />
            </div>
          )}
        </div>

        {/* Social Reinforcement */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-violet-400 font-semibold">
              3️⃣ REFORÇO SOCIAL
            </label>
            <button
              onClick={() => setEnableSocial(!enableSocial)}
              className={cn(
                "w-12 h-6 rounded-full transition-all duration-200",
                enableSocial ? "bg-violet-600" : "bg-slate-700"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 bg-white rounded-full transition-transform duration-200",
                  enableSocial ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
          
          {enableSocial && (
            <div className="animate-slide-up">
              <Input
                placeholder="Com quem você vai compartilhar seu progresso?"
                value={onboardingData.socialReinforcement || ""}
                onChange={(e) => updateOnboardingData({ socialReinforcement: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step8Law2;
