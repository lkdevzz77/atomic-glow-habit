import React from "react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const ProgressIndicator = ({ currentStep, totalSteps, className }: ProgressIndicatorProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-1 sm:gap-2", className)}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div
            className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-base font-semibold transition-all duration-300",
              index < currentStep
                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/50"
                : index === currentStep
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/50 scale-110"
                : "bg-slate-700 text-slate-400"
            )}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={cn(
                "h-1 w-4 sm:w-8 md:w-12 rounded-full transition-all duration-300",
                index < currentStep ? "bg-gradient-to-r from-violet-600 to-purple-600" : "bg-slate-700"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressIndicator;
