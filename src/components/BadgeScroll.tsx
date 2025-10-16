import React from "react";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

const BadgeScroll = () => {
  const { badges } = useApp();

  return (
    <div className="glass rounded-2xl p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-50 mb-6">Suas Conquistas</h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-violet pb-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              "min-w-[160px] rounded-2xl p-6 flex flex-col items-center gap-3 transition-all duration-200 hover-scale",
              badge.unlocked
                ? "bg-gradient-to-br from-violet-900 to-violet-700 border-2 border-violet-400 shadow-xl shadow-violet-500/50"
                : badge.progress > 0
                ? "border-2 border-violet-500/50 border-dashed glass animate-pulse-violet"
                : "bg-slate-800/50 opacity-40 grayscale border-2 border-slate-700"
            )}
          >
            <div className="text-5xl filter drop-shadow-lg">
              {badge.icon}
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-slate-50 mb-1">{badge.name}</h3>
              <p className="text-xs text-slate-300 leading-tight">
                {badge.description}
              </p>
            </div>

            {!badge.unlocked && (
              <div className="w-full">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{badge.progress}</span>
                  <span>{badge.target}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-500"
                    style={{ width: `${(badge.progress / badge.target) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {badge.unlocked && badge.unlockedAt && (
              <div className="text-xs text-violet-300">
                Desbloqueado em {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeScroll;
