import React, { useEffect, useState } from "react";
import { Flame, X } from "lucide-react";
import { Habit } from "@/types/habit";
import { cn } from "@/lib/utils";

interface StreakAlertProps {
  habits: Habit[];
}

const StreakAlert = ({ habits }: StreakAlertProps) => {
  const [show, setShow] = useState(false);
  const [atRiskHabits, setAtRiskHabits] = useState<Habit[]>([]);

  useEffect(() => {
    // Find habits with streak > 3 that haven't been completed today
    const today = new Date().toISOString().split('T')[0];
    const atRisk = habits.filter(h => {
      const lastCompleted = h.last_completed ? new Date(h.last_completed).toISOString().split('T')[0] : null;
      return (h.streak || 0) >= 3 && h.status !== 'completed' && lastCompleted !== today;
    });

    setAtRiskHabits(atRisk);
    
    // Only show if there are at-risk habits and it's after 6 PM
    const hour = new Date().getHours();
    if (atRisk.length > 0 && hour >= 18) {
      setShow(true);
    }
  }, [habits]);

  if (!show || atRiskHabits.length === 0) return null;

  return (
    <div className="mb-6 animate-fade-in">
      <div className="glass border-2 border-orange-500/50 rounded-xl p-4 sm:p-5 bg-gradient-to-r from-orange-900/20 to-red-900/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-orange-400 mb-1">
              Sua sequência está em risco
            </h3>
            <p className="text-sm text-slate-300 mb-3">
              {atRiskHabits.length === 1 
                ? `${atRiskHabits[0].streak} votos consecutivos para "${atRiskHabits[0].title}". Não quebre a corrente hoje.`
                : `${atRiskHabits.length} sequências ativas precisam de você hoje.`
              }
            </p>
            
            {atRiskHabits.length > 1 && (
              <ul className="space-y-1 text-sm text-slate-400">
                {atRiskHabits.map(h => (
                  <li key={h.id} className="flex items-center gap-2">
                    <span className="text-orange-400">🔥</span>
                    <span>{h.title} - {h.streak} dias</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => setShow(false)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreakAlert;
