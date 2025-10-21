import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, BookOpen, Dumbbell, Brain, Heart, Droplet, Utensils, Moon, Sun, Target, Zap, Award, Plus, Coffee, Sunrise, Sunset } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface NewHabitModalProps {
  open: boolean;
  onClose: () => void;
}

const ICON_OPTIONS = [
  { icon: BookOpen, name: 'BookOpen', display: 'Leitura' },
  { icon: Dumbbell, name: 'Dumbbell', display: 'Exercício' },
  { icon: Brain, name: 'Brain', display: 'Meditação' },
  { icon: Heart, name: 'Heart', display: 'Saúde' },
  { icon: Droplet, name: 'Droplet', display: 'Hidratação' },
  { icon: Utensils, name: 'Utensils', display: 'Alimentação' },
  { icon: Moon, name: 'Moon', display: 'Sono' },
  { icon: Sun, name: 'Sun', display: 'Energia' },
  { icon: Target, name: 'Target', display: 'Objetivo' },
  { icon: Zap, name: 'Zap', display: 'Produtividade' },
  { icon: Award, name: 'Award', display: 'Conquista' },
];

const PERIOD_OPTIONS = [
  { id: 'morning', label: 'Manhã', icon: Sunrise, time: '07:00' },
  { id: 'coffee', label: 'Café', icon: Coffee, time: '09:00' },
  { id: 'afternoon', label: 'Tarde', icon: Sun, time: '14:00' },
  { id: 'evening', label: 'Noite', icon: Moon, time: '20:00' },
];

const UNIT_OPTIONS = ['minutos', 'páginas', 'vezes', 'km', 'copos', 'horas'];

const NewHabitModal = ({ open, onClose }: NewHabitModalProps) => {
  const { createHabit, isCreating } = useHabits();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0].name);
  const [goal, setGoal] = useState(5);
  const [unit, setUnit] = useState("minutos");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [location, setLocation] = useState("");
  const [trigger, setTrigger] = useState("");
  const [motivation, setMotivation] = useState("");
  const [reward, setReward] = useState("");

  const resetForm = () => {
    setTitle("");
    setSelectedIcon(ICON_OPTIONS[0].name);
    setGoal(5);
    setUnit("minutos");
    setSelectedPeriod("");
    setCustomTime("");
    setLocation("");
    setTrigger("");
    setMotivation("");
    setReward("");
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!title.trim()) {
        toast.error("Por favor, dê um nome ao seu hábito");
        return;
      }
      if (goal <= 0) {
        toast.error("A meta deve ser maior que zero");
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Por favor, dê um nome ao seu hábito");
      return;
    }

    try {
      const when = customTime || selectedPeriod || '';
      
      await createHabit({
        title: title.trim(),
        icon: selectedIcon,
        when_time: when,
        where_location: location.trim(),
        trigger_activity: trigger.trim() || null,
        goal_target: goal,
        goal_unit: unit,
      });

      toast.success("Hábito criado com sucesso!");
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error("Erro ao criar hábito");
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] overflow-hidden glass border-slate-700 p-0">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700 p-6 z-10">
          <button
            onClick={() => { resetForm(); onClose(); }}
            className="absolute top-6 right-6 text-slate-400 hover:text-violet-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-slate-100 mb-4">Criar Novo Hábito</h2>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Etapa {currentStep}/3</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6 p-6">
            {/* Form */}
            <div className="space-y-6">
              {/* Step 1: Essencial */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      O que você quer fazer?
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Ler, Meditar, Exercitar..."
                      className="text-lg bg-slate-800/50 border-slate-700 focus:border-violet-500"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Escolha um ícone:
                    </label>
                    <div className="grid grid-cols-6 gap-3">
                      {ICON_OPTIONS.map(({ icon: Icon, name, display }) => (
                        <button
                          key={name}
                          onClick={() => setSelectedIcon(name)}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all hover:scale-110",
                            selectedIcon === name
                              ? "border-violet-500 bg-violet-900/30 scale-110 shadow-lg shadow-violet-500/50"
                              : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                          )}
                          title={display}
                        >
                          <Icon size={32} className="mx-auto text-violet-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Qual sua meta diária?
                      </label>
                      <Input
                        type="number"
                        value={goal}
                        onChange={(e) => setGoal(Number(e.target.value))}
                        min={1}
                        className="bg-slate-800/50 border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Unidade
                      </label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:border-violet-500 focus:outline-none"
                      >
                        {UNIT_OPTIONS.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <span className="text-blue-400">💡</span>
                    <p className="text-sm text-blue-200">
                      <strong>Dica:</strong> Comece pequeno! (Regra dos 2 Minutos)
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Quando e Onde */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Quando você vai fazer?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {PERIOD_OPTIONS.map(({ id, label, icon: Icon, time }) => (
                        <button
                          key={id}
                          onClick={() => {
                            setSelectedPeriod(time);
                            setCustomTime("");
                          }}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                            selectedPeriod === time
                              ? "border-violet-500 bg-violet-900/30 shadow-lg shadow-violet-500/50"
                              : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                          )}
                        >
                          <Icon size={32} className="text-slate-300" />
                          <span className="text-sm font-medium text-slate-300">{label}</span>
                        </button>
                      ))}
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">ou horário específico:</label>
                      <Input
                        type="time"
                        value={customTime}
                        onChange={(e) => {
                          setCustomTime(e.target.value);
                          setSelectedPeriod("");
                        }}
                        className="bg-slate-800/50 border-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Onde?
                    </label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Sala, Quarto, Academia..."
                      className="bg-slate-800/50 border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Gatilho (opcional)
                    </label>
                    <Input
                      value={trigger}
                      onChange={(e) => setTrigger(e.target.value)}
                      placeholder="Ex: tomar café, escovar dentes..."
                      className="bg-slate-800/50 border-slate-700"
                    />
                    <p className="text-xs text-slate-500 mt-1">Fazer logo após...</p>
                  </div>
                </div>
              )}

              {/* Step 3: Motivação */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Por que isso é importante para você?
                    </label>
                    <Textarea
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Ex: Quero ter mais energia, aprender coisas novas..."
                      className="min-h-[100px] bg-slate-800/50 border-slate-700 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Como vai celebrar 7 dias seguidos?
                    </label>
                    <Input
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                      placeholder="Ex: Comprar livro novo, jantar especial..."
                      className="bg-slate-800/50 border-slate-700"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="hidden lg:block">
              <div className="sticky top-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase">Preview ao Vivo</h3>
                <div className="glass rounded-2xl p-6 border border-slate-700 space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/50">
                      {(() => {
                        const IconComponent = ICON_OPTIONS.find(opt => opt.name === selectedIcon)?.icon;
                        return IconComponent ? <IconComponent className="w-10 h-10 text-white" /> : null;
                      })()}
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h4 className="text-xl font-bold text-slate-100">
                      {title || "Seu Hábito"}
                    </h4>
                    <div className="text-sm text-slate-400 space-y-1">
                      <p>{goal} {unit} • {customTime || selectedPeriod || "Horário"}</p>
                      {location && <p>📍 {location}</p>}
                      {trigger && <p>⚡ Após {trigger}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Progresso</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>🔥</span>
                    <span>0 dias</span>
                  </div>

                  {reward && (
                    <div className="p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
                      <p className="text-xs text-amber-200">
                        🎁 Recompensa 7 dias:
                      </p>
                      <p className="text-sm text-amber-100 mt-1">{reward}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1}
              variant="ghost"
              className="text-slate-300 hover:text-violet-400"
            >
              ← Voltar
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8"
              >
                Continuar →
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={isCreating}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8"
              >
                {isCreating ? "Criando..." : "Criar Hábito ✨"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewHabitModal;
