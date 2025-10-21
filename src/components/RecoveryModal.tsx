import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habit";
import { useHabits } from "@/hooks/useHabits";
import { toast } from "@/hooks/use-toast";
import { Lightbulb, TrendingDown, Undo2 } from "lucide-react";

interface RecoveryModalProps {
  habit: Habit;
  open: boolean;
  onClose: () => void;
}

const RecoveryModal = ({ habit, open, onClose }: RecoveryModalProps) => {
  const { updateHabit } = useHabits();
  const [isApplying, setIsApplying] = useState(false);

  const reducedGoal = Math.max(1, Math.floor(habit.goal_target / 2));

  const handleAcceptReduction = async () => {
    setIsApplying(true);
    
    try {
      await updateHabit({
        id: habit.id,
        data: { goal_target: reducedGoal },
      });

      toast({
        title: "✨ Sistema Adaptado",
        description: `Sua meta foi reduzida para ${reducedGoal} ${habit.goal_unit}. Pequenos passos são progresso!`,
      });

      onClose();
    } catch (error) {
      console.error("Error updating habit:", error);
      toast({
        title: "Erro",
        description: "Não foi possível ajustar a meta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleContinueSame = () => {
    toast({
      title: "💪 Vamos tentar de novo!",
      description: "A resistência constrói resiliência. Você consegue!",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border border-slate-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <span className="text-3xl">💭</span>
            Ninguém é perfeito
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Mensagem Empática */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 space-y-3">
            <p className="text-slate-200 leading-relaxed">
              Você quebrou sua sequência de <span className="font-bold text-violet-400">{habit.streak} dias</span> em <span className="font-semibold text-slate-100">"{habit.title}"</span>.
            </p>
            <p className="text-sm text-slate-300">
              Mas isso não define você. O que importa é voltar. <span className="font-semibold text-emerald-400">Resiliência é continuar após falhar.</span>
            </p>
          </div>

          {/* Lei #3: Torne Fácil */}
          <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-500/30 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-violet-300 mb-1">Lei #3: Torne Fácil</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Quando você falha, a resistência está muito alta. A estratégia é <span className="font-semibold text-violet-400">reduzir o atrito</span> temporariamente.
                </p>
              </div>
            </div>
          </div>

          {/* Proposta de Recuperação */}
          <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-slate-100">Recuperação Inteligente</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-slate-400">Meta atual:</span>
                <span className="text-lg font-bold text-slate-300 line-through">
                  {habit.goal_target} {habit.goal_unit}
                </span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-slate-400">Meta sugerida (próximos 3 dias):</span>
                <span className="text-2xl font-bold text-emerald-400">
                  {reducedGoal} {habit.goal_unit}
                </span>
              </div>

              <p className="text-xs text-slate-400 italic leading-relaxed">
                Depois de 3 dias consecutivos com a meta reduzida, você pode voltar gradualmente ao objetivo original.
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="border-l-4 border-violet-500 pl-4">
            <p className="text-sm italic text-slate-300 leading-relaxed mb-1">
              "É melhor fazer menos do que você esperava do que nada."
            </p>
            <p className="text-xs text-violet-400">— James Clear, Hábitos Atômicos</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAcceptReduction}
              disabled={isApplying}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              <Undo2 className="w-4 h-4 mr-2" />
              {isApplying ? "Aplicando..." : "Aceitar Recuperação"}
            </Button>
            
            <Button
              onClick={handleContinueSame}
              variant="outline"
              className="flex-1 border-slate-600 hover:border-violet-500"
            >
              Manter Meta Atual
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecoveryModal;
