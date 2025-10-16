import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-violet-400 mb-2">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "w-full px-4 py-3 rounded-xl",
            "bg-slate-700/50 border border-slate-600",
            "text-slate-50 placeholder:text-slate-400",
            "focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 focus:bg-slate-700",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "min-h-[120px] resize-y",
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

Textarea.displayName = "Textarea";

export default Textarea;
