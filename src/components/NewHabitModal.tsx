import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Habit } from "@/types/habit";
import Law1Step from "./habit-wizard/Law1Step";
import Law2Step from "./habit-wizard/Law2Step";
import Law3Step from "./habit-wizard/Law3Step";
import Law4Step from "./habit-wizard/Law4Step";
import SummaryStep from "./habit-wizard/SummaryStep";

interface NewHabitModalProps {
  open: boolean;
  onClose: () => void;
}

export interface HabitFormData {
  title: string;
  icon: string;
  when: string;
  customTime?: string;
  where: string;
  trigger: string;
  temptationBundle?: string;
  environmentPrep?: string;
  socialReinforcement?: string;
  initialGoal: number;
  goalUnit: string;
  acceptedRecommendation: boolean;
  frictionReduction?: string;
  trackingPreferences: string[];
  enableSound: boolean;
  enableVibration: boolean;
  reward7Days: string;
  reward30Days: string;
}

const NewHabitModal = ({ open, onClose }: NewHabitModalProps) => {
  const { addHabit } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<HabitFormData>({
    title: "",
    icon: "📚",
    when: "",
    where: "",
    trigger: "",
    initialGoal: 10,
    goalUnit: "minutos",
    acceptedRecommendation: false,
    trackingPreferences: ["graphs", "streak", "heatmap", "badges"],
    enableSound: true,
    enableVibration: false,
    reward7Days: "",
    reward30Days: "",
  });

  const updateFormData = (data: Partial<HabitFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCreateHabit = () => {
    const recommended = formData.acceptedRecommendation
      ? {
          phase1: { days: 3, target: Math.floor(formData.initialGoal / 4) },
          phase2: { days: 4, target: Math.floor(formData.initialGoal / 2) },
          phase3: { days: null, target: formData.initialGoal },
        }
      : {
          phase1: { days: 3, target: formData.initialGoal },
          phase2: { days: 7, target: formData.initialGoal },
          phase3: { days: null, target: formData.initialGoal },
        };

    const newHabit: Habit = {
      id: Date.now(),
      title: formData.title,
      icon: formData.icon,
      color: "violet",
      goal: {
        current: 0,
        target: formData.acceptedRecommendation
          ? recommended.phase1.target
          : formData.initialGoal,
        unit: formData.goalUnit,
      },
      when: formData.when,
      where: formData.where,
      trigger: formData.trigger,
      temptationBundle: formData.temptationBundle,
      environmentPrep: formData.environmentPrep,
      socialReinforcement: formData.socialReinforcement,
      twoMinuteVersion: `${Math.floor(formData.initialGoal / 10)} ${formData.goalUnit}`,
      ruleOfTwo: recommended,
      currentPhase: 1,
      rewardMilestone: {
        days: 7,
        reward: formData.reward7Days || "Recompensa especial",
      },
      streak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      status: "pending",
      lastCompleted: null,
      createdAt: new Date().toISOString(),
    };

    addHabit(newHabit);
    onClose();
    setCurrentStep(1);
    setFormData({
      title: "",
      icon: "📚",
      when: "",
      where: "",
      trigger: "",
      initialGoal: 10,
      goalUnit: "minutos",
      acceptedRecommendation: false,
      trackingPreferences: ["graphs", "streak", "heatmap", "badges"],
      enableSound: true,
      enableVibration: false,
      reward7Days: "",
      reward30Days: "",
    });
  };

  const progress = (currentStep / 4) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800/95 backdrop-blur-xl border-slate-700 p-0">
        <div className="sticky top-0 bg-slate-800/95 backdrop-blur-xl border-b border-slate-700 p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-violet-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-6">
            <img
              src="/atom-logo.png"
              alt=""
              className="w-8 h-8 animate-float"
              style={{
                filter: "drop-shadow(0 0 20px rgba(124, 58, 237, 0.6))"
              }}
            />
            <span className="text-xl font-bold gradient-text">atomicTracker</span>
          </div>

          {/* Progress bar */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step <= currentStep
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/50"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 mx-1 rounded-full transition-all ${
                      step < currentStep ? "bg-violet-500" : "bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-slate-400">
            Etapa {currentStep} de 4
          </div>
        </div>

        <div className="p-10">
          {currentStep === 1 && (
            <Law1Step formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 2 && (
            <Law2Step formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 3 && (
            <Law3Step formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && (
            <Law4Step formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 5 && (
            <SummaryStep
              formData={formData}
              onEdit={(step) => setCurrentStep(step)}
            />
          )}
        </div>

        <div className="sticky bottom-0 bg-slate-800/95 backdrop-blur-xl border-t border-slate-700 p-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-3 text-slate-300 hover:text-violet-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Voltar
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-violet-500/70 hover:scale-105 transition-all duration-200"
            >
              Continuar →
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-violet-500/70 hover:scale-105 transition-all duration-200"
            >
              Ver Resumo →
            </button>
          )}

          {currentStep === 5 && (
            <button
              onClick={handleCreateHabit}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-lg font-bold rounded-xl shadow-2xl shadow-violet-500/50 hover:shadow-violet-500/70 hover:scale-105 transition-all duration-200 animate-pulse-violet"
            >
              🚀 Criar Hábito
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewHabitModal;
