import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { X, BookOpen, Dumbbell, Brain, Heart, Droplet, Utensils, Moon, Sun, Target, Zap, Award, Sparkles, Trophy, HelpCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { triggerHaptic } from "@/utils/haptics";
import { HabitStackSelector } from "@/components/HabitStackSelector";

interface NewHabitModalProps {
  open: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
}

const EDUCATIONAL_TIPS = {
  1: {
    icon: Target,
    title: "Lei 1: Torne Óbvio",
    description: "Quanto mais específico você for sobre quando e onde vai agir, maior a chance de seguir através. Defina um gatilho claro para seu hábito.",
    tip: "Definir quando e onde você vai fazer seu hábito aumenta em 2-3x suas chances de sucesso."
  },
  2: {
    icon: Sparkles,
    title: "Lei 2: Torne Atraente",
    description: "Combine seu hábito com algo que você gosta. O bundling de tentações torna o hábito mais atraente e aumenta a motivação.",
    tip: "Empilhar hábitos (habit stacking) é uma das técnicas mais eficazes para criar novos hábitos."
  },
  3: {
    icon: Zap,
    title: "Lei 3: Torne Fácil",
    description: "A Regra dos 2 Minutos: quando você começa um novo hábito, ele deve levar menos de 2 minutos para fazer.",
    tip: "Tornar seu hábito super fácil no início aumenta em 80% as chances de você mantê-lo."
  },
  4: {
    icon: Trophy,
    title: "Lei 4: Torne Satisfatório",
    description: "O que é recompensado é repetido. Celebre suas pequenas vitórias e crie reforços positivos imediatos.",
    tip: "Recompensas imediatas aumentam significativamente a probabilidade de repetição do hábito."
  }
};

const HABIT_SUGGESTIONS: Record<string, { when: string; where: string; goal: string; unit: string; twoMin: string }> = {
  BookOpen: { when: "Após o café da manhã", where: "Poltrona de leitura", goal: "10", unit: "páginas", twoMin: "Ler 1 página" },
  Dumbbell: { when: "Ao acordar", where: "Quarto", goal: "20", unit: "flexões", twoMin: "Fazer 5 flexões" },
  Brain: { when: "Antes de dormir", where: "Cama", goal: "5", unit: "minutos", twoMin: "Respirar fundo 3 vezes" },
  Droplet: { when: "Ao acordar", where: "Cozinha", goal: "2", unit: "copos", twoMin: "Beber 1 copo" },
  Pencil: { when: "Após o jantar", where: "Mesa de estudos", goal: "30", unit: "minutos", twoMin: "Escrever 1 frase" },
  Music: { when: "Durante o almoço", where: "Sala", goal: "15", unit: "minutos", twoMin: "Ouvir 1 música" },
  default: { when: "Após café da manhã", where: "Em casa", goal: "10", unit: "minutos", twoMin: "Fazer por 2 minutos" }
};

const ICON_OPTIONS = [
  { icon: BookOpen, name: 'BookOpen' },
  { icon: Dumbbell, name: 'Dumbbell' },
  { icon: Brain, name: 'Brain' },
  { icon: Heart, name: 'Heart' },
  { icon: Droplet, name: 'Droplet' },
  { icon: Utensils, name: 'Utensils' },
  { icon: Moon, name: 'Moon' },
  { icon: Sun, name: 'Sun' },
  { icon: Target, name: 'Target' },
  { icon: Zap, name: 'Zap' },
  { icon: Award, name: 'Award' },
];

const UNIT_OPTIONS = ['minutos', 'páginas', 'vezes', 'km', 'copos', 'horas'];

const NewHabitModal = ({ open, onClose, onOpenChange }: NewHabitModalProps) => {
  const { createHabit, isCreating, data: habits } = useHabits();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("1");
  const [maxTabReached, setMaxTabReached] = useState(1);
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set());
  
  // Form data
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0].name);
  const [goal, setGoal] = useState(5);
  const [unit, setUnit] = useState("minutos");
  const [whenTime, setWhenTime] = useState("");
  const [location, setLocation] = useState("");
  const [habitStack, setHabitStack] = useState<number | null>(null);
  const [motivation, setMotivation] = useState("");
  const [temptationBundle, setTemptationBundle] = useState("");
  const [twoMinuteVersion, setTwoMinuteVersion] = useState("");
  const [environmentPrep, setEnvironmentPrep] = useState("");
  const [reward, setReward] = useState("");

  const resetForm = () => {
    setTitle("");
    setSelectedIcon(ICON_OPTIONS[0].name);
    setGoal(5);
    setUnit("minutos");
    setWhenTime("");
    setLocation("");
    setHabitStack(null);
    setMotivation("");
    setTemptationBundle("");
    setTwoMinuteVersion("");
    setEnvironmentPrep("");
    setReward("");
    setActiveTab("1");
    setMaxTabReached(1);
    setCompletedTabs(new Set());
  };

  const applySuggestions = (iconName: string) => {
    const suggestions = HABIT_SUGGESTIONS[iconName] || HABIT_SUGGESTIONS.default;
    if (!whenTime) setWhenTime(suggestions.when);
    if (!location) setLocation(suggestions.where);
    if (!goal) setGoal(Number(suggestions.goal));
    if (!unit) setUnit(suggestions.unit);
    if (!twoMinuteVersion) setTwoMinuteVersion(suggestions.twoMin);
  };

  const getCompletionPercentage = () => {
    const fields = [title, selectedIcon, whenTime, location, motivation, String(goal), unit, twoMinuteVersion, reward];
    const filled = fields.filter(f => f && f.toString().trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  const isTabComplete = (tab: string) => {
    switch(tab) {
      case "1": return title && whenTime && location;
      case "2": return motivation;
      case "3": return goal && unit && twoMinuteVersion;
      case "4": return reward;
      default: return false;
    }
  };

  const handleNext = () => {
    const currentTabNum = parseInt(activeTab);
    
    // Validação básica antes de avançar
    if (currentTabNum === 1 && !title.trim()) {
      toast.error("Por favor, dê um nome ao seu hábito");
      return;
    }

    if (isTabComplete(activeTab)) {
      setCompletedTabs(prev => new Set(prev).add(activeTab));
    }

    if (currentTabNum < 4) {
      const nextTab = (currentTabNum + 1).toString();
      setActiveTab(nextTab);
      setMaxTabReached(Math.max(maxTabReached, currentTabNum + 1));
    }
  };

  const handleBack = () => {
    const currentTabNum = parseInt(activeTab);
    if (currentTabNum > 1) {
      setActiveTab((currentTabNum - 1).toString());
    }
  };

  const handleHabitStackChange = (habitId: number | null, habit?: any) => {
    setHabitStack(habitId);
    if (habit) {
      setWhenTime(`Após ${habit.title}`);
    } else {
      setWhenTime("");
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Por favor, dê um nome ao seu hábito");
      return;
    }

    try {
      await createHabit({
        title: title.trim(),
        icon: selectedIcon,
        when_time: whenTime || '',
        where_location: location.trim(),
        trigger_activity: whenTime || null,
        temptation_bundle: temptationBundle.trim() || null,
        environment_prep: environmentPrep.trim() || null,
        goal_target: goal,
        goal_unit: unit,
      });

      toast.success("Hábito criado com sucesso! 🌱");
      resetForm();
      if (onOpenChange) onOpenChange(false);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error("Erro ao criar hábito");
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (onOpenChange) onOpenChange(open);
    if (!open && onClose) onClose();
  };

  const Container = isMobile ? Drawer : Dialog;
  const Content = isMobile ? DrawerContent : DialogContent;

  return (
    <Container open={open} onOpenChange={handleDialogChange}>
      <Content className={cn(
        "overflow-hidden border-border/50 p-0 flex flex-col",
        isMobile 
          ? "h-[95vh] rounded-t-3xl" 
          : "max-w-3xl w-full max-h-[90vh] rounded-2xl"
      )}>
        {/* Accessibility components */}
        {isMobile ? (
          <>
            <DrawerTitle className="sr-only">Novo Hábito</DrawerTitle>
            <DrawerDescription className="sr-only">
              Crie um novo hábito seguindo os 4 passos baseados nas Leis dos Hábitos Atômicos
            </DrawerDescription>
          </>
        ) : (
          <>
            <DialogTitle className="sr-only">Novo Hábito</DialogTitle>
            <DialogDescription className="sr-only">
              Crie um novo hábito seguindo os 4 passos baseados nas Leis dos Hábitos Atômicos
            </DialogDescription>
          </>
        )}
        
        {/* Header */}
        <div className="border-b border-border/50 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Novo Hábito
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { 
                resetForm(); 
                if (onOpenChange) onOpenChange(false);
                if (onClose) onClose();
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progresso do hábito</span>
              <span className="font-medium text-purple-400">{getCompletionPercentage()}% completo</span>
            </div>
            <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${getCompletionPercentage()}%` }} 
              />
            </div>
          </div>
          
          <Tabs value={activeTab} className="mt-0">
            <TabsList className="w-full justify-start border-none bg-transparent gap-2 p-0">
              <TabsTrigger 
                value="1" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative"
                onClick={() => maxTabReached >= 1 && setActiveTab("1")}
              >
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Óbvio</span>
                  {completedTabs.has("1") && <CheckCircle2 className="w-3 h-3 text-green-500 absolute -top-1 -right-1" />}
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="2" 
                disabled={maxTabReached < 2}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed relative"
                onClick={() => maxTabReached >= 2 && setActiveTab("2")}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Atraente</span>
                  {completedTabs.has("2") && <CheckCircle2 className="w-3 h-3 text-green-500 absolute -top-1 -right-1" />}
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="3" 
                disabled={maxTabReached < 3}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed relative"
                onClick={() => maxTabReached >= 3 && setActiveTab("3")}
              >
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Fácil</span>
                  {completedTabs.has("3") && <CheckCircle2 className="w-3 h-3 text-green-500 absolute -top-1 -right-1" />}
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="4" 
                disabled={maxTabReached < 4}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed relative"
                onClick={() => maxTabReached >= 4 && setActiveTab("4")}
              >
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Recompensa</span>
                  {completedTabs.has("4") && <CheckCircle2 className="w-3 h-3 text-green-500 absolute -top-1 -right-1" />}
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Tab 1: Óbvio */}
            <TabsContent value="1" className="space-y-4 mt-0 animate-in fade-in-0 slide-in-from-left-5">
              {/* Educational Tip */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-400 text-sm">{EDUCATIONAL_TIPS[1].title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{EDUCATIONAL_TIPS[1].description}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Nome do Hábito <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Ler 10 páginas, Meditar 5 minutos, Fazer 20 flexões..."
                  className="mt-1.5"
                  autoFocus
                />
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  Ícone
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Escolha um ícone que represente seu hábito. Isso ajuda na identificação visual.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="grid grid-cols-6 gap-2 mt-1.5">
                  {ICON_OPTIONS.map(({ icon: Icon, name }) => (
                    <button
                      key={name}
                      onClick={() => {
                        setSelectedIcon(name);
                        applySuggestions(name);
                        triggerHaptic('light');
                      }}
                      className={cn(
                        "p-2 rounded-lg border transition-colors",
                        selectedIcon === name 
                          ? "border-primary bg-primary/10" 
                          : "border-input hover:border-muted-foreground/50"
                      )}
                    >
                      <Icon className="w-5 h-5 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  Quando? <span className="text-destructive">*</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Seja específico! "Após o café" é melhor que "de manhã"</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  value={whenTime}
                  onChange={(e) => setWhenTime(e.target.value)}
                  placeholder="Ex: Após o café da manhã, Antes de dormir, Às 7h..."
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  Onde? <span className="text-destructive">*</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Defina um local específico. Isso cria um gatilho ambiental.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Mesa de estudos, Academia, Quarto..."
                  className="mt-1.5"
                />
              </div>

              {habits && habits.length > 0 && (
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    Empilhar após outro hábito? (opcional)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Empilhamento de hábitos: faça seu novo hábito após um hábito que você já faz todos os dias.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="mt-1.5">
                    <HabitStackSelector
                      habits={habits}
                      value={habitStack}
                      onChange={handleHabitStackChange}
                    />
                  </div>
                </div>
              )}

              {/* Insight */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/50">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground italic">
                    {EDUCATIONAL_TIPS[1].tip}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Atraente */}
            <TabsContent value="2" className="space-y-4 mt-0 animate-in fade-in-0 slide-in-from-left-5">
              {/* Educational Tip */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-400 text-sm">{EDUCATIONAL_TIPS[2].title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{EDUCATIONAL_TIPS[2].description}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  Por que este hábito é importante?
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Conecte seu hábito a uma motivação profunda. Isso aumenta seu compromisso.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Ex: Quero ser mais saudável, Preciso de mais energia, Quero crescer profissionalmente..."
                  className="mt-1.5 min-h-[80px]"
                  maxLength={200}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Tornar mais atraente (Opcional)</Label>
                <Input
                  value={temptationBundle}
                  onChange={(e) => setTemptationBundle(e.target.value)}
                  placeholder="Ex: ouvir música, tomar café especial..."
                  className="mt-1.5"
                />
              </div>

              {/* Insight */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/50">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground italic">
                    {EDUCATIONAL_TIPS[2].tip}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Fácil */}
            <TabsContent value="3" className="space-y-4 mt-0 animate-in fade-in-0 slide-in-from-left-5">
              {/* Educational Tip */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-400 text-sm">{EDUCATIONAL_TIPS[3].title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{EDUCATIONAL_TIPS[3].description}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Meta <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(Number(e.target.value))}
                    min={1}
                    className="flex-1"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="px-3 rounded-md border border-input bg-background"
                  >
                    {UNIT_OPTIONS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  Versão de 2 minutos <span className="text-destructive">*</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Uma versão super fácil do seu hábito que leva menos de 2 minutos. Isso reduz a resistência inicial.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  value={twoMinuteVersion}
                  onChange={(e) => setTwoMinuteVersion(e.target.value)}
                  placeholder="Ex: Ler 1 página, Fazer 5 flexões, Meditar 1 minuto..."
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Preparar ambiente (Opcional)</Label>
                <Input
                  value={environmentPrep}
                  onChange={(e) => setEnvironmentPrep(e.target.value)}
                  placeholder="Ex: Deixar livro na mesa..."
                  className="mt-1.5"
                />
              </div>

              {/* Insight */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/50">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground italic">
                    {EDUCATIONAL_TIPS[3].tip}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: Recompensa */}
            <TabsContent value="4" className="space-y-4 mt-0 animate-in fade-in-0 slide-in-from-left-5">
              {/* Educational Tip */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-400 text-sm">{EDUCATIONAL_TIPS[4].title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{EDUCATIONAL_TIPS[4].description}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  Recompensa imediata
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Algo pequeno e prazeroso que você fará imediatamente após completar o hábito.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="Ex: Tomar um café especial, Marcar ✓ no calendário, Dançar minha música favorita..."
                  className="mt-1.5"
                />
              </div>

              {/* Preview do Hábito */}
              <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Preview do seu hábito
                </h4>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                    {(() => {
                      const SelectedIcon = ICON_OPTIONS.find(opt => opt.name === selectedIcon)?.icon || BookOpen;
                      return <SelectedIcon className="w-6 h-6 text-purple-400" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-base">{title || "Seu hábito incrível"}</p>
                    <p className="text-xs text-muted-foreground">
                      {whenTime && `${whenTime} • `}
                      {goal && unit && `Meta: ${goal} ${unit}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/50">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground italic">
                    {EDUCATIONAL_TIPS[4].tip}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 p-4 flex justify-between shrink-0 bg-background">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                resetForm();
                if (onOpenChange) onOpenChange(false);
                if (onClose) onClose();
              }}
            >
              Cancelar
            </Button>
            {parseInt(activeTab) > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
              >
                Voltar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {parseInt(activeTab) < 4 ? (
              <Button 
                onClick={handleNext}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Avançar →
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={isCreating || !title.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                {isCreating ? "Criando..." : "Criar Hábito"}
              </Button>
            )}
          </div>
        </div>
      </Content>
    </Container>
  );
};

export default NewHabitModal;
