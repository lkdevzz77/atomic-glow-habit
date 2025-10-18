import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "@/hooks/useHabits";
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
  const { user } = useAuth();
  const { createHabit } = useHabits();
  const { toast } = useToast();
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Lei #1: Torne Óbvio - Validar nome, quando e onde
        if (!formData.title.trim()) {
          toast({
            title: "Campo obrigatório",
            description: "Por favor, dê um nome para seu hábito.",
            variant: "destructive"
          });
          return false;
        }
        break;
        
      case 2:
        // Lei #2: Torne Atraente
        // Campos opcionais, não precisa validar
        break;
        
      case 3:
        // Lei #3: Torne Fácil - Validar meta
        if (!formData.initialGoal || formData.initialGoal <= 0) {
          toast({
            title: "Meta inválida",
            description: "Por favor, defina uma meta maior que zero.",
            variant: "destructive"
          });
          return false;
        }
        break;

      case 4:
        // Lei #4: Torne Satisfatório
        if (!formData.trackingPreferences.length) {
          toast({
            title: "Selecione ao menos uma opção",
            description: "Por favor, escolha como deseja acompanhar seu progresso.",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < 5 && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const validateHabit = (): boolean => {
    // Campo obrigatório: apenas título
    if (!formData.title?.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, dê um nome ao seu hábito.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.initialGoal || formData.initialGoal <= 0) {
      toast({
        title: "Meta inválida",
        description: "Por favor, defina uma meta maior que zero.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.trackingPreferences.length) {
      toast({
        title: "Preferências de rastreamento",
        description: "Por favor, selecione ao menos uma forma de acompanhar seu progresso.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleCreateHabit = async () => {
    if (!validateHabit()) {
      return;
    }

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

      try {
        // Criar o hábito no banco de dados
        await createHabit({
          title: formData.title,
          icon: formData.icon,
          when_time: formData.when || '',
          where_location: formData.where || '',
          trigger_activity: formData.trigger,
          temptation_bundle: formData.temptationBundle,
          environment_prep: formData.environmentPrep,
          social_reinforcement: formData.socialReinforcement,
          goal_target: formData.initialGoal,
          goal_unit: formData.goalUnit
        });

        onClose();
        setCurrentStep(1);
      } catch (error) {
        console.error('Error creating habit:', error);
        toast({
          title: 'Erro ao criar hábito',
          description: error instanceof Error ? error.message : 'Erro desconhecido',
          variant: 'destructive'
        });
      }
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
      <DialogContent className="max-w-2xl w-full mx-auto h-[95vh] sm:h-[90vh] overflow-hidden bg-slate-800/95 backdrop-blur-xl border-slate-700 p-0 rounded-t-2xl sm:rounded-2xl border">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800/95 backdrop-blur-xl border-b border-slate-700 p-4 sm:p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 text-slate-400 hover:text-violet-400 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <img
              src="/atom-logo.png"
              alt=""
              className="w-6 h-6 sm:w-8 sm:h-8 animate-float"
              style={{
                filter: "drop-shadow(0 0 20px rgba(124, 58, 237, 0.6))"
              }}
            />
            <span className="text-lg sm:text-xl font-bold gradient-text">atomicTracker</span>
          </div>

          {/* Progress bar */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all ${
                    step <= currentStep
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/50"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-8 sm:w-16 h-1 mx-0.5 sm:mx-1 rounded-full transition-all ${
                      step < currentStep ? "bg-violet-500" : "bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-xs sm:text-sm text-slate-400">
            Etapa {currentStep} de 4
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-10">
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
                onCreateHabit={handleCreateHabit}
              />
            )}
          </div>
        </div>

        {/* Footer - Só aparece nos passos 1-4 */}
        {currentStep < 5 && (
          <div className="sticky bottom-0 bg-slate-800/95 backdrop-blur-xl border-t border-slate-700 p-4 sm:p-6 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-slate-300 hover:text-violet-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Voltar
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-violet-500/70 hover:scale-105 transition-all duration-200"
              >
                Continuar →
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-violet-500/70 hover:scale-105 transition-all duration-200"
              >
                Ver Resumo →
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewHabitModal;
