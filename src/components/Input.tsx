import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-violet-400 mb-2">
            {label}
          </label>
        )}
        <input
          className={cn(
            "w-full px-4 py-3 rounded-xl",
            "bg-slate-700/50 border border-slate-600",
            "text-slate-50 placeholder:text-slate-400",
            "focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 focus:bg-slate-700",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
            className
          )}
          ref={ref}
          {...props}
        />
        {hint && !error && (
          <p className="mt-2 text-sm text-slate-400">{hint}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
