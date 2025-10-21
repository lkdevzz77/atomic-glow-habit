import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  tip?: string;
  className?: string;
}

const EmptyStateCard = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  tip,
  className,
}: EmptyStateCardProps) => {
  return (
    <div className={cn("glass card-rounded card-padding-lg text-center", className)}>
      <div className="max-w-md mx-auto space-y-6">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center">
          <Icon className="w-10 h-10 text-violet-400" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-slate-100">{title}</h3>

        {/* Description */}
        <p className="text-slate-300 leading-relaxed">{description}</p>

        {/* Tip */}
        {tip && (
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-start gap-3 text-left">
              <span className="text-xl flex-shrink-0">💡</span>
              <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
            </div>
          </div>
        )}

        {/* Action */}
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyStateCard;
