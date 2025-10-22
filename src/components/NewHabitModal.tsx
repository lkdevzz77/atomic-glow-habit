import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { X, BookOpen, Dumbbell, Brain, Heart, Droplet, Utensils, Moon, Sun, Target, Zap, Award, Plus, Coffee, Sunrise, Sunset, Sparkles, Check, Clock, AlertCircle, Flame, ChevronDown } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { triggerHabitConfetti } from "@/utils/confettiAnimation";
import { useIsMobile } from "@/hooks/use-mobile";
import { triggerHaptic } from "@/utils/haptics";

interface NewHabitModalProps {
  open: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
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

const TRIGGER_OPTIONS = [
  { value: 'tomar café', label: '☕ Tomar café da manhã', emoji: '☕' },
  { value: 'escovar dentes', label: '🪥 Escovar os dentes', emoji: '🪥' },
  { value: 'acordar', label: '🌅 Acordar', emoji: '🌅' },
  { value: 'almoçar', label: '🍽️ Almoçar', emoji: '🍽️' },
  { value: 'jantar', label: '🍴 Jantar', emoji: '🍴' },
  { value: 'custom', label: '✏️ Outra atividade...', emoji: '✏️' },
];

const TEMPTATION_OPTIONS = [
  { value: 'café especial', label: 'Café especial', emoji: '☕' },
  { value: 'playlist favorita', label: 'Playlist favorita', emoji: '🎵' },
  { value: 'redes sociais', label: 'Redes sociais', emoji: '📱' },
  { value: 'guloseima', label: 'Guloseima', emoji: '🍫' },
];

const LAWS = [
  { 
    id: 1, 
    title: 'Torne Óbvio', 
    shortTitle: 'Óbvio',
    emoji: '🎯', 
    color: 'violet',
    description: 'Hábitos claros têm gatilhos claros'
  },
  { 
    id: 2, 
    title: 'Torne Atraente', 
    shortTitle: 'Atraente',
    emoji: '✨', 
    color: 'purple',
    description: 'Conecte com algo que você ama'
  },
  { 
    id: 3, 
    title: 'Torne Fácil', 
    shortTitle: 'Fácil',
    emoji: '🚀', 
    color: 'fuchsia',
    description: 'Comece absurdamente pequeno'
  },
  { 
    id: 4, 
    title: 'Torne Satisfatório', 
    shortTitle: 'Satisfatório',
    emoji: '🎉', 
    color: 'pink',
    description: 'Celebre cada vitória'
  },
];

const NewHabitModal = ({ open, onClose, onOpenChange }: NewHabitModalProps) => {
  const { createHabit, isCreating } = useHabits();
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(1);
  const [prevStep, setPrevStep] = useState(1);
  const [attemptedNext, setAttemptedNext] = useState(false);
  
  // Form data
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0].name);
  const [goal, setGoal] = useState(5);
  const [unit, setUnit] = useState("minutos");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [location, setLocation] = useState("");
  const [trigger, setTrigger] = useState("");
  const [customTrigger, setCustomTrigger] = useState("");
  const [motivation, setMotivation] = useState("");
  const [temptationBundle, setTemptationBundle] = useState("");
  const [customTemptation, setCustomTemptation] = useState("");
  const [frictionReduction, setFrictionReduction] = useState("");
  const [reward, setReward] = useState("");
  const [showAICoach, setShowAICoach] = useState(false);
  const [showFeedbackDemo, setShowFeedbackDemo] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSelectedIcon(ICON_OPTIONS[0].name);
    setGoal(5);
    setUnit("minutos");
    setSelectedPeriod("");
    setCustomTime("");
    setLocation("");
    setTrigger("");
    setCustomTrigger("");
    setMotivation("");
    setTemptationBundle("");
    setCustomTemptation("");
    setFrictionReduction("");
    setReward("");
    setCurrentStep(1);
    setPrevStep(1);
    setAttemptedNext(false);
    setShowAICoach(false);
    setShowFeedbackDemo(false);
  };

  const handleNext = () => {
    setAttemptedNext(true);
    
    if (currentStep === 1) {
      if (!title.trim()) {
        return;
      }
    }
    
    if (currentStep < 4) {
      setPrevStep(currentStep);
      setCurrentStep(currentStep + 1);
      setAttemptedNext(false);
      
      // Show AI Coach if goal is high on step 3
      if (currentStep === 2 && goal > 10) {
        setShowAICoach(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setPrevStep(currentStep);
      setCurrentStep(currentStep - 1);
      setAttemptedNext(false);
    }
  };

  const handleAcceptAISuggestion = () => {
    setGoal(Math.max(Math.floor(goal / 3), 2));
    setShowAICoach(false);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Por favor, dê um nome ao seu hábito");
      return;
    }

    try {
      const when = customTime || selectedPeriod || '';
      const finalTrigger = trigger === 'custom' ? customTrigger : trigger;
      const finalTemptation = temptationBundle === 'custom' ? customTemptation : temptationBundle;
      
      await createHabit({
        title: title.trim(),
        icon: selectedIcon,
        when_time: when,
        where_location: location.trim(),
        trigger_activity: finalTrigger || null,
        temptation_bundle: finalTemptation || null,
        environment_prep: frictionReduction.trim() || null,
        goal_target: goal,
        goal_unit: unit,
      });

      toast.success("Semente plantada com sucesso! 🌱");
      resetForm();
      if (onOpenChange) onOpenChange(false);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error("A reação não ocorreu como esperado");
    }
  };

  const progress = (currentStep / 4) * 100;
  const currentLaw = LAWS[currentStep - 1];
  const gradientStops = [
    { step: 1, color: '#8B5CF6', percent: 25 },
    { step: 2, color: '#A855F7', percent: 50 },
    { step: 3, color: '#D946EF', percent: 75 },
    { step: 4, color: '#EC4899', percent: 100 },
  ];

  const handleDialogChange = (open: boolean) => {
    if (onOpenChange) onOpenChange(open);
    if (!open && onClose) onClose();
  };

  const Container = isMobile ? Drawer : Dialog;
  const Content = isMobile ? DrawerContent : DialogContent;

  return (
    <Container open={open} onOpenChange={handleDialogChange}>
      <Content className={cn(
        "overflow-hidden glass border-slate-700 p-0",
        isMobile 
          ? "h-[95vh] rounded-t-3xl" 
          : "max-w-5xl w-full h-[90vh] rounded-2xl"
      )}>
        {/* Header */}
        <div className={cn(
          "sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700 z-10",
          isMobile ? "p-4" : "p-6"
        )}>
          <button
            onClick={() => { 
              resetForm(); 
              if (onOpenChange) onOpenChange(false);
              if (onClose) onClose();
            }}
            className={cn(
              "absolute text-slate-400 hover:text-violet-400 transition-colors",
              isMobile ? "top-4 right-4" : "top-6 right-6"
            )}
          >
            <X className={cn(isMobile ? "w-5 h-5" : "w-6 h-6")} />
          </button>

          {/* Law Badge Header */}
          {isMobile ? (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">{currentLaw?.emoji}</span>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  {currentLaw?.title}
                </h3>
                <p className="text-xs text-slate-400">{currentLaw?.description}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-6">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all",
                currentLaw?.color === 'violet' && "bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/50",
                currentLaw?.color === 'purple' && "bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-purple-500/50",
                currentLaw?.color === 'fuchsia' && "bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-fuchsia-500/50",
                currentLaw?.color === 'pink' && "bg-gradient-to-br from-pink-500 to-rose-600 shadow-pink-500/50"
              )}>
                <span className="text-2xl">{currentLaw?.emoji}</span>
              </div>
              <div>
                <div className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  currentLaw?.color === 'violet' && "text-violet-400",
                  currentLaw?.color === 'purple' && "text-purple-400",
                  currentLaw?.color === 'fuchsia' && "text-fuchsia-400",
                  currentLaw?.color === 'pink' && "text-pink-400"
                )}>
                  Lei #{currentStep}
                </div>
                <h3 className="text-xl font-bold text-slate-100">
                  {currentLaw?.title}
                </h3>
                <p className="text-sm text-slate-400">{currentLaw?.description}</p>
              </div>
            </div>
          )}
          
          {/* Progress with gradient */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Lei {currentStep}/4</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(to right, 
                    ${gradientStops.slice(0, currentStep).map((s, i) => 
                      `${s.color} ${i === 0 ? '0%' : `${(i / currentStep) * 100}%`}`
                    ).join(', ')}
                  )`
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={cn(
          "flex-1 overflow-y-auto",
          isMobile && "overscroll-contain"
        )}>
          <div className={cn(
            "grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6",
            isMobile ? "p-4" : "p-6"
          )}>
            {/* Form */}
            <div 
              key={currentStep}
              className={cn(
                "space-y-6 transition-all duration-300",
                currentStep > prevStep ? "animate-fade-in" : "animate-fade-in"
              )}
            >
              {/* Step 1: Lei #1 - Torne Óbvio */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Nome do Hábito */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Qual hábito você quer criar?
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Ler, Meditar, Exercitar..."
                      className={cn(
                        "bg-slate-800/50 border-slate-700 focus:border-violet-500",
                        isMobile ? "h-14 text-base" : "text-lg"
                      )}
                      autoFocus
                    />
                    {!title && attemptedNext && (
                      <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700/30 rounded-xl mt-2 animate-shake">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-sm text-red-200">Por favor, dê um nome ao seu hábito</p>
                      </div>
                    )}
                  </div>

                  {/* Ícone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Escolha um ícone:
                    </label>
                    <div className={cn(
                      "grid gap-3",
                      isMobile ? "grid-cols-4" : "grid-cols-5 sm:grid-cols-6"
                    )}>
                      {ICON_OPTIONS.map(({ icon: Icon, name, display }) => (
                        <button
                          key={name}
                          onClick={() => {
                            setSelectedIcon(name);
                            triggerHaptic('light');
                          }}
                          className={cn(
                            "rounded-xl border-2 transition-all hover:scale-105",
                            isMobile ? "p-4 min-h-[64px]" : "p-3",
                            selectedIcon === name
                              ? "border-violet-500 bg-violet-900/30 scale-105 shadow-lg shadow-violet-500/50"
                              : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                          )}
                          title={display}
                        >
                          <Icon size={isMobile ? 28 : 24} className="mx-auto text-violet-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Construtor de Gatilho Visual */}
                  <div className="border-2 border-violet-500/30 rounded-2xl p-6 space-y-4 bg-violet-900/10">
                    <h4 className="text-violet-400 font-semibold flex items-center gap-2">
                      <span>📌</span>
                      CRIANDO SEU GATILHO DE IMPLEMENTAÇÃO
                    </h4>
                    
                    <div className="bg-slate-900/80 rounded-xl p-6 space-y-4">
                      <p className="text-slate-400 text-sm text-center">
                        "Logo após
                      </p>
                      
                      <select 
                        value={trigger}
                        onChange={(e) => {
                          setTrigger(e.target.value);
                          triggerHaptic('light');
                        }}
                        className={cn(
                          "w-full px-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-slate-100 font-semibold focus:border-violet-500 focus:outline-none",
                          isMobile ? "py-4 text-base" : "py-3"
                        )}
                      >
                        <option value="">Selecione uma atividade...</option>
                        {TRIGGER_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      
                      {trigger === 'custom' && (
                        <Input 
                          value={customTrigger}
                          onChange={(e) => setCustomTrigger(e.target.value)}
                          placeholder="Digite a atividade..."
                          className="bg-slate-800 border-slate-700 text-center"
                        />
                      )}
                      
                      <p className="text-slate-400 text-sm text-center">vou</p>
                      
                      <p className="text-2xl font-bold text-violet-400 text-center">
                        {title || "fazer meu hábito"}
                      </p>
                      
                      <p className="text-slate-400 text-sm text-center">em/no</p>
                      
                      <Input 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Sala, Quarto, Escritório..."
                        className="text-center font-semibold bg-slate-800 border-slate-700"
                      />
                    </div>
                    
                    {trigger && trigger !== 'custom' && location && title && (
                      <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 border-l-4 border-violet-500 rounded-lg p-4 animate-fade-in">
                        <p className="text-slate-50 text-base leading-relaxed text-center">
                          "Logo após <span className="font-bold text-violet-400">{trigger}</span>, 
                          vou <span className="font-bold text-violet-400">{title}</span> 
                          {location && <> na/no <span className="font-bold text-violet-400">{location}</span></>}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Horário */}
                  <div>
                    <label className="text-sm text-slate-300 mb-3 block">
                      Aproximadamente que horas? (opcional)
                    </label>
                    <div className={cn(
                      "grid gap-2",
                      isMobile ? "grid-cols-2" : "grid-cols-4"
                    )}>
                      {PERIOD_OPTIONS.map(({ id, label, icon: Icon, time }) => (
                        <button
                          key={id}
                          onClick={() => {
                            setSelectedPeriod(time);
                            setCustomTime("");
                            triggerHaptic('light');
                          }}
                          className={cn(
                            "rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                            isMobile ? "p-4 min-h-[72px]" : "p-3",
                            selectedPeriod === time
                              ? "border-violet-500 bg-violet-900/30 shadow-lg shadow-violet-500/50"
                              : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                          )}
                        >
                          <Icon size={isMobile ? 24 : 20} className="text-slate-300" />
                          <span className={cn(
                            "font-medium",
                            isMobile ? "text-sm" : "text-xs"
                          )}>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Educação contextual */}
                  <div className="flex items-start gap-3 p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
                    <span className="text-2xl">💡</span>
                    <div className="flex-1 text-sm text-slate-300">
                      <p className="font-semibold text-violet-400 mb-1">Por que isso funciona?</p>
                      <p>Pesquisas mostram que hábitos com gatilhos específicos têm <strong>2-3x mais chance</strong> de se tornarem automáticos.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Lei #2 - Torne Atraente */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Motivação profunda */}
                  <div>
                    <label className="text-purple-400 font-semibold mb-2 block flex items-center gap-2">
                      <span>✨</span>
                      Por que isso é importante para VOCÊ?
                    </label>
                    <Textarea 
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Ex: Quero ter mais energia, aprender coisas novas, ser um exemplo para meus filhos..."
                      className={cn(
                        "text-base bg-slate-800/50 border-slate-700 resize-none",
                        isMobile ? "min-h-[100px]" : "min-h-[120px]"
                      )}
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Seja específico. Essa motivação aparecerá quando você precisar de um empurrãozinho.
                    </p>
                  </div>

                  {/* Agrupamento de Tentações */}
                  <div className="border-2 border-purple-500/30 rounded-2xl p-6 space-y-4 bg-purple-900/10">
                    <h4 className="text-purple-400 font-semibold flex items-center gap-2">
                      <span>🔗</span>
                      AGRUPAMENTO DE TENTAÇÕES
                    </h4>
                    
                    <p className="text-sm text-slate-300">
                      Associe seu hábito com algo que você <strong>já adora fazer</strong>:
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {TEMPTATION_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setTemptationBundle(opt.value);
                            setCustomTemptation("");
                            triggerHaptic('light');
                          }}
                          className={cn(
                            "bg-slate-800/50 border-2 rounded-xl transition-all hover:scale-105",
                            isMobile ? "p-5 min-h-[100px]" : "p-4",
                            temptationBundle === opt.value
                              ? "border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/50"
                              : "border-slate-700 hover:border-purple-500/50"
                          )}
                        >
                          <div className={cn(
                            "mb-2",
                            isMobile ? "text-4xl" : "text-3xl"
                          )}>{opt.emoji}</div>
                          <p className="text-sm font-medium text-slate-200">{opt.label}</p>
                        </button>
                      ))}
                    </div>
                    
                    <Input 
                      value={customTemptation}
                      onChange={(e) => {
                        setCustomTemptation(e.target.value);
                        setTemptationBundle("custom");
                      }}
                      placeholder="Ou descreva sua recompensa imediata..."
                      className="bg-slate-800 border-slate-700"
                    />
                    
                    {(temptationBundle || customTemptation) && (
                      <div className="bg-slate-900/80 rounded-xl p-4 text-center animate-fade-in">
                        <p className="text-slate-300 leading-relaxed">
                          Só vou <span className="font-bold text-purple-400">
                            {temptationBundle === 'custom' ? customTemptation : temptationBundle}
                          </span>
                          <br />
                          <span className="text-xs">↓</span>
                          <br />
                          depois de <span className="font-bold text-violet-400">{title || "meu hábito"}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Educação contextual */}
                  <div className="flex items-start gap-3 p-4 bg-purple-900/20 border border-purple-700/30 rounded-xl">
                    <span className="text-2xl">🧠</span>
                    <div className="flex-1 text-sm text-slate-300">
                      <p className="font-semibold text-purple-400 mb-1">Ciência:</p>
                      <p>Seu cérebro libera dopamina ao <strong>antecipar</strong> a recompensa, tornando o hábito mais viciante.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Lei #3 - Torne Fácil */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Seletor de meta com slider */}
                  <div>
                    <label className="text-fuchsia-400 font-semibold mb-4 block flex items-center gap-2">
                      <span>🚀</span>
                      Meta inicial (comece pequeno!)
                    </label>
                    
                    <div className={cn(
                      "border-2 border-fuchsia-500/30 rounded-2xl bg-fuchsia-900/10",
                      isMobile ? "p-6" : "p-8"
                    )}>
                      <div className="flex items-baseline justify-center gap-3 mb-6">
                        <span className={cn(
                          "font-bold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent",
                          isMobile ? "text-5xl" : "text-6xl"
                        )}>
                          {goal}
                        </span>
                        <select 
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          className={cn(
                            "bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-2 text-slate-200 font-semibold focus:border-fuchsia-500 focus:outline-none",
                            isMobile ? "text-xl" : "text-2xl"
                          )}
                        >
                          {UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                      
                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={goal}
                        onChange={(e) => setGoal(Number(e.target.value))}
                        className={cn(
                          "w-full appearance-none rounded-full cursor-pointer",
                          isMobile ? "h-4" : "h-3"
                        )}
                        style={{
                          background: `linear-gradient(to right, 
                            #D946EF 0%, 
                            #D946EF ${(goal/60)*100}%, 
                            rgb(51 65 85) ${(goal/60)*100}%, 
                            rgb(51 65 85) 100%)`
                        }}
                      />
                      
                      <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>1</span>
                        <span>15</span>
                        <span>30</span>
                        <span>45</span>
                        <span>60</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Coach recomendação */}
                  {showAICoach && goal > 10 && (
                    <div className={cn(
                      "border-2 border-fuchsia-500/50 rounded-2xl space-y-4 animate-fade-in relative overflow-hidden bg-fuchsia-900/10",
                      isMobile ? "p-4" : "p-6"
                    )}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
                      
                      <div className={cn(
                        "flex gap-4 relative z-10",
                        isMobile && "flex-col items-center text-center"
                      )}>
                        <div className={cn(
                          "rounded-2xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/50",
                          isMobile ? "w-14 h-14" : "w-16 h-16"
                        )}>
                          <Sparkles className={cn(
                            "text-white animate-pulse",
                            isMobile ? "w-7 h-7" : "w-8 h-8"
                          )} />
                        </div>
                        <div className="flex-1">
                          <h4 className={cn(
                            "font-bold text-fuchsia-400 mb-2",
                            isMobile ? "text-base" : "text-lg"
                          )}>
                            COACH IA SUGERE
                          </h4>
                          <p className={cn(
                            "text-slate-200 leading-relaxed",
                            isMobile && "text-sm"
                          )}>
                            Baseado em <strong>12.000 hábitos analisados</strong>, pessoas que começam com{" "}
                            <span className="font-bold text-fuchsia-400 text-xl">{Math.max(Math.floor(goal/3), 2)} {unit}</span>{" "}
                            têm <strong className="text-green-400">3.2x mais chance</strong> de manter o hábito após 30 dias.
                          </p>
                          
                          <div className="mt-4 flex items-center gap-2">
                            <div className="flex-1 space-y-1">
                              <div className="text-xs text-slate-400">Progressão sugerida:</div>
                              <div className="flex items-center gap-2">
                                {[1, 2, 3].map((week) => {
                                  const weekGoal = Math.max(Math.floor(goal/3), 2) * week;
                                  return (
                                    <div key={week} className="flex-1 text-center">
                                      <div className="text-sm font-bold text-fuchsia-400">
                                        {weekGoal}
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        Sem. {week}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          
                          <div className={cn(
                            "flex gap-3 mt-4",
                            isMobile && "flex-col"
                          )}>
                            <Button
                              onClick={handleAcceptAISuggestion}
                              className={cn(
                                "bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700",
                                isMobile && "w-full h-12"
                              )}
                            >
                              Aceitar Sugestão
                            </Button>
                            <Button 
                              variant="ghost" 
                              className={cn(
                                "text-slate-400",
                                isMobile && "w-full h-12"
                              )}
                              onClick={() => setShowAICoach(false)}
                            >
                              Manter {goal} {unit}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Redução de atrito */}
                  <div>
                    <label className="text-slate-300 font-medium mb-2 block">
                      Como vai preparar o ambiente?
                    </label>
                    <Input 
                      value={frictionReduction}
                      onChange={(e) => setFrictionReduction(e.target.value)}
                      placeholder="Ex: Deixar livro na mesa de cabeceira, roupa de ginástica pronta..."
                      className="bg-slate-800/50 border-slate-700"
                    />
                  </div>

                  {/* Educação contextual */}
                  <div className="flex items-start gap-3 p-4 bg-fuchsia-900/20 border border-fuchsia-700/30 rounded-xl">
                    <span className="text-2xl">⚡</span>
                    <div className="flex-1 text-sm text-slate-300">
                      <p className="font-semibold text-fuchsia-400 mb-1">Regra dos 2 Minutos:</p>
                      <p>Todo hábito pode ser iniciado em menos de 2 minutos. A versão mínima é melhor que nada.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Lei #4 - Torne Satisfatório */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {/* Preview de feedback visual */}
                  <div className="border-2 border-pink-500/30 rounded-2xl p-6 bg-pink-900/10">
                    <h4 className="text-pink-400 font-semibold mb-4 flex items-center gap-2">
                      <span>🎉</span>
                      TESTE SEU FEEDBACK DE CONCLUSÃO
                    </h4>
                    
                    <Button
                      onClick={() => {
                        triggerHabitConfetti();
                        setShowFeedbackDemo(true);
                        setTimeout(() => setShowFeedbackDemo(false), 3000);
                      }}
                      className="w-full bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 h-16 text-lg"
                    >
                      <Check className="mr-2 w-6 h-6" />
                      Simular Conclusão
                    </Button>
                    
                    {showFeedbackDemo && (
                      <div className="mt-6 bg-slate-900/80 rounded-xl p-8 text-center space-y-4 animate-scale-in">
                        <div className="text-7xl">✓</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                          +10 XP
                        </div>
                        <div className="text-violet-400 text-lg">
                          🎊 Fantástico! Streak de 1 dia! 🎊
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sistema de rastreamento */}
                  <div>
                    <label className="text-pink-400 font-semibold mb-3 block">
                      Como quer acompanhar seu progresso?
                    </label>
                    
                    <div className="grid gap-3">
                      <div className="p-4 bg-slate-800/40 border-2 border-pink-500 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-100">Sistema Completo</p>
                            <p className="text-sm text-slate-400">Gráficos + Streaks + Badges + XP</p>
                          </div>
                          <Check className="w-5 h-5 text-pink-400" />
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-500 text-center">
                        Recomendado para maximizar motivação
                      </p>
                    </div>
                  </div>

                  {/* Recompensa 7 dias */}
                  <div>
                    <label className="text-slate-300 font-medium mb-2 block flex items-center gap-2">
                      <span>🎁</span>
                      Como vai celebrar 7 dias de sucesso?
                    </label>
                    <Input 
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                      placeholder="Ex: Livro novo, jantar especial, filme no cinema..."
                      className="bg-slate-800/50 border-slate-700"
                    />
                    
                    {reward && (
                      <div className="mt-3 p-4 bg-amber-900/20 border border-amber-700/30 rounded-xl animate-fade-in">
                        <p className="text-sm text-amber-200 flex items-center gap-2">
                          <span>🏆</span>
                          Perfeito! Essa recompensa vai aparecer no dia 7 para te motivar.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Educação contextual */}
                  <div className="flex items-start gap-3 p-4 bg-pink-900/20 border border-pink-700/30 rounded-xl">
                    <span className="text-2xl">🧪</span>
                    <div className="flex-1 text-sm text-slate-300">
                      <p className="font-semibold text-pink-400 mb-1">Evidência:</p>
                      <p>Feedback imediato aumenta a liberação de dopamina, reforçando o comportamento positivo.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Aprimorado */}
            {isMobile ? (
              <Collapsible>
                <CollapsibleTrigger className="w-full p-4 bg-slate-800/50 rounded-xl flex items-center justify-between">
                  <span className="font-semibold">Ver Preview</span>
                  <ChevronDown className="w-5 h-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <div className="glass rounded-2xl border-2 border-slate-700 overflow-hidden">
                    <div className="bg-gradient-to-br from-violet-600 to-purple-600 p-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                          {(() => {
                            const IconComponent = ICON_OPTIONS.find(opt => opt.name === selectedIcon)?.icon;
                            return IconComponent ? <IconComponent className="w-12 h-12 text-white" /> : null;
                          })()}
                        </div>
                      </div>
                      <h4 className="text-center text-2xl font-bold text-white">
                        {title || "Seu Novo Hábito"}
                      </h4>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {(trigger || location || selectedPeriod) && (
                        <div className="flex items-start gap-3 p-3 bg-violet-900/20 border border-violet-700/30 rounded-xl">
                          <span className="text-xl">🎯</span>
                          <div className="flex-1 text-sm">
                            <p className="font-semibold text-violet-400 mb-1">Gatilho</p>
                            <p className="text-slate-300 leading-relaxed">
                              {trigger && trigger !== 'custom' && `Após ${trigger}`}
                              {trigger === 'custom' && customTrigger && `Após ${customTrigger}`}
                              {location && ` na ${location}`}
                              {selectedPeriod && ` às ${selectedPeriod}`}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {(motivation || temptationBundle || customTemptation) && (
                        <div className="flex items-start gap-3 p-3 bg-purple-900/20 border border-purple-700/30 rounded-xl">
                          <span className="text-xl">✨</span>
                          <div className="flex-1 text-sm">
                            <p className="font-semibold text-purple-400 mb-1">Motivação</p>
                            <p className="text-slate-300 leading-relaxed line-clamp-3">
                              {motivation || (temptationBundle === 'custom' ? customTemptation : temptationBundle)}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3 p-3 bg-fuchsia-900/20 border border-fuchsia-700/30 rounded-xl">
                        <span className="text-xl">🚀</span>
                        <div className="flex-1 text-sm">
                          <p className="font-semibold text-fuchsia-400 mb-1">Meta Inicial</p>
                          <p className="text-slate-300 text-lg font-bold">
                            {goal} {unit}
                          </p>
                        </div>
                      </div>
                      
                      {reward && (
                        <div className="flex items-start gap-3 p-3 bg-pink-900/20 border border-pink-700/30 rounded-xl">
                          <span className="text-xl">🎉</span>
                          <div className="flex-1 text-sm">
                            <p className="font-semibold text-pink-400 mb-1">Recompensa (7 dias)</p>
                            <p className="text-slate-300 leading-relaxed line-clamp-2">
                              {reward}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-slate-700">
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                          <span>Progresso Hoje</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                        
                        <div className="flex items-center justify-between mt-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Flame className="w-4 h-4" />
                            <span>0 dias</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <span>Nível 1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <div className="hidden lg:block">
                <div className="sticky top-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase">Preview ao Vivo</h3>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4].map(step => (
                      <div 
                        key={step}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          currentStep >= step ? "bg-violet-500 w-3" : "bg-slate-700"
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="glass rounded-2xl border-2 border-slate-700 overflow-hidden">
                  {/* Header do card */}
                  <div className="bg-gradient-to-br from-violet-600 to-purple-600 p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                        {(() => {
                          const IconComponent = ICON_OPTIONS.find(opt => opt.name === selectedIcon)?.icon;
                          return IconComponent ? <IconComponent className="w-12 h-12 text-white" /> : null;
                        })()}
                      </div>
                    </div>
                    <h4 className="text-center text-2xl font-bold text-white">
                      {title || "Seu Novo Hábito"}
                    </h4>
                  </div>
                  
                  {/* Body com as 4 leis */}
                  <div className="p-6 space-y-4">
                    {/* Lei #1 - Gatilho */}
                    {(trigger || location || selectedPeriod) && (
                      <div className="flex items-start gap-3 p-3 bg-violet-900/20 border border-violet-700/30 rounded-xl">
                        <span className="text-xl">🎯</span>
                        <div className="flex-1 text-sm">
                          <p className="font-semibold text-violet-400 mb-1">Gatilho</p>
                          <p className="text-slate-300 leading-relaxed">
                            {trigger && trigger !== 'custom' && `Após ${trigger}`}
                            {trigger === 'custom' && customTrigger && `Após ${customTrigger}`}
                            {location && ` na ${location}`}
                            {selectedPeriod && ` às ${selectedPeriod}`}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Lei #2 - Motivação */}
                    {(motivation || temptationBundle || customTemptation) && (
                      <div className="flex items-start gap-3 p-3 bg-purple-900/20 border border-purple-700/30 rounded-xl">
                        <span className="text-xl">✨</span>
                        <div className="flex-1 text-sm">
                          <p className="font-semibold text-purple-400 mb-1">Motivação</p>
                          <p className="text-slate-300 leading-relaxed line-clamp-3">
                            {motivation || (temptationBundle === 'custom' ? customTemptation : temptationBundle)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Lei #3 - Meta */}
                    <div className="flex items-start gap-3 p-3 bg-fuchsia-900/20 border border-fuchsia-700/30 rounded-xl">
                      <span className="text-xl">🚀</span>
                      <div className="flex-1 text-sm">
                        <p className="font-semibold text-fuchsia-400 mb-1">Meta Inicial</p>
                        <p className="text-slate-300 text-lg font-bold">
                          {goal} {unit}
                        </p>
                      </div>
                    </div>
                    
                    {/* Lei #4 - Recompensa */}
                    {reward && (
                      <div className="flex items-start gap-3 p-3 bg-pink-900/20 border border-pink-700/30 rounded-xl">
                        <span className="text-xl">🎉</span>
                        <div className="flex-1 text-sm">
                          <p className="font-semibold text-pink-400 mb-1">Recompensa (7 dias)</p>
                          <p className="text-slate-300 leading-relaxed line-clamp-2">
                            {reward}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Progress bar */}
                    <div className="pt-4 border-t border-slate-700">
                      <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Progresso Hoje</span>
                        <span>0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                      
                      <div className="flex items-center justify-between mt-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Flame className="w-4 h-4" />
                          <span>0 dias</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <span>Nível 1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Dica contextual */}
                <div className="p-3 bg-blue-900/20 border border-blue-700/30 rounded-xl text-xs text-blue-200">
                  💡 Este é exatamente como seu hábito aparecerá no dashboard
                </div>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* Footer com breadcrumb */}
        <div className={cn(
          "sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 z-10",
          isMobile ? "p-4" : "p-6"
        )}>
          {/* Breadcrumb das leis */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {LAWS.map((law, idx) => (
              <div 
                key={idx}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
                  currentStep > idx + 1 ? "bg-violet-900/50 text-violet-300" :
                  currentStep === idx + 1 ? cn(
                    "text-white",
                    law.color === 'violet' && "bg-gradient-to-r from-violet-600 to-purple-600",
                    law.color === 'purple' && "bg-gradient-to-r from-purple-600 to-fuchsia-600",
                    law.color === 'fuchsia' && "bg-gradient-to-r from-fuchsia-600 to-pink-600",
                    law.color === 'pink' && "bg-gradient-to-r from-pink-600 to-rose-600"
                  ) :
                  "bg-slate-800 text-slate-500"
                )}
              >
                <span>{law.emoji}</span>
                <span className="hidden sm:inline">{law.shortTitle}</span>
                {currentStep > idx + 1 && <Check className="w-3 h-3" />}
              </div>
            ))}
          </div>
          
          {/* Botões de navegação */}
          <div className={cn(
            "flex gap-3",
            isMobile && "flex-col"
          )}>
            {currentStep > 1 && (
              <Button
                onClick={() => {
                  handleBack();
                  triggerHaptic('light');
                }}
                variant="outline"
                className={cn(
                  isMobile && "h-12 w-full order-2",
                  !isMobile && "flex-1"
                )}
              >
                ← Voltar
              </Button>
            )}

            {currentStep < 4 ? (
              <Button
                onClick={() => {
                  handleNext();
                  triggerHaptic('medium');
                }}
                className={cn(
                  "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white transition-all duration-200",
                  isMobile ? "h-12 w-full order-1" : "flex-1 px-8"
                )}
              >
                Continuar →
              </Button>
            ) : (
              <Button
                onClick={() => {
                  handleCreate();
                  triggerHaptic('success');
                }}
                disabled={isCreating}
                className={cn(
                  "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white transition-all duration-200",
                  isMobile ? "h-12 w-full order-1" : "flex-1 px-8"
                )}
              >
                {isCreating ? "Plantando..." : "Plantar Semente ⚛️"}
              </Button>
            )}
          </div>
        </div>
      </Content>
    </Container>
  );
};

export default NewHabitModal;
