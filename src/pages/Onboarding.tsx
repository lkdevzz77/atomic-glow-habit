import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import ProgressIndicator from "@/components/ProgressIndicator";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import Step1Welcome from "@/components/onboarding/Step1Welcome";
import Step2Identity from "@/components/onboarding/Step2Identity";
import Step3Vision from "@/components/onboarding/Step3Vision";
import Step4ChooseHabit from "@/components/onboarding/Step4ChooseHabit";
import Step5Challenges from "@/components/onboarding/Step5Challenges";
import Step6Routine from "@/components/onboarding/Step6Routine";
import Step7Law1 from "@/components/onboarding/Step7Law1";
import Step8Law2 from "@/components/onboarding/Step8Law2";
import Step9Law3 from "@/components/onboarding/Step9Law3";
import Step10Law4 from "@/components/onboarding/Step10Law4";
import Step11Summary from "@/components/onboarding/Step11Summary";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { onboardingData, updateOnboardingData } = useApp();
  const { updateOnboardingStatus } = useAuth();
  const navigate = useNavigate();

  const totalSteps = 11;

  const steps = [
    <Step1Welcome key={0} />,
    <Step2Identity key={1} />,
    <Step3Vision key={2} />,
    <Step4ChooseHabit key={3} />,
    <Step5Challenges key={4} />,
    <Step6Routine key={5} />,
    <Step7Law1 key={6} />,
    <Step8Law2 key={7} />,
    <Step9Law3 key={8} />,
    <Step10Law4 key={9} />,
    <Step11Summary key={10} />
  ];

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return true; // Nome já foi coletado no signup
      case 1:
        return onboardingData.desiredIdentity && onboardingData.desiredIdentity.trim().length > 10;
      case 2:
        return onboardingData.specificChange && onboardingData.specificChange.trim().length > 10;
      case 3:
        return onboardingData.habitType || onboardingData.habitCustom;
      case 4:
        return onboardingData.pastAttempts;
      case 5:
        return onboardingData.firstThingMorning;
      case 6:
        return onboardingData.when && onboardingData.where && onboardingData.triggerActivity;
      case 7:
        return true; // Law 2 is optional
      case 8:
        return onboardingData.initialGoal && onboardingData.initialGoal > 0;
      case 9:
        return onboardingData.trackingSystem && onboardingData.trackingSystem.length > 0;
      case 10:
        return true;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1 && canGoNext()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalSteps - 1) {
      // Mark onboarding as completed and redirect to dashboard
      await updateOnboardingStatus(true);
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900/10 to-slate-900 flex items-center justify-center p-4 px-2 sm:px-4">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <img
              src="/atom-logo.png"
              alt=""
              className="w-8 h-8 sm:w-12 sm:h-12 animate-float"
              style={{
                filter: "drop-shadow(0 0 20px rgba(124, 58, 237, 0.6))"
              }}
            />
            <span className="text-2xl sm:text-3xl font-bold gradient-text">atomicTracker</span>
          </div>
          
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} className="scale-75 sm:scale-100" />
        </div>

        {/* Content Card */}
        <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 shadow-2xl shadow-violet-900/20 animate-scale-in">
          <div className="min-h-[400px]">
            {steps[currentStep]}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-700">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="group text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="group text-sm sm:text-base"
            >
              {currentStep === totalSteps - 1 ? "Começar Jornada" : "Continuar"}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
