import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
}) => {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className="flex flex-col items-center gap-2 flex-1"
            >
              {/* Step Circle */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                  isCompleted && 'bg-green-600 text-white',
                  isCurrent && 'bg-violet-600 text-white ring-4 ring-violet-600/30',
                  !isCompleted && !isCurrent && 'bg-slate-700 text-slate-400'
                )}
              >
                {isCompleted ? (
                  <Check size={20} />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>

              {/* Step Title */}
              <span
                className={cn(
                  'text-xs text-center transition-colors hidden sm:block',
                  isCurrent && 'text-violet-400 font-semibold',
                  !isCurrent && 'text-slate-400'
                )}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
