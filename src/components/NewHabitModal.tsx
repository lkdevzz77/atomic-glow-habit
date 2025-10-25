import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { X, BookOpen, Dumbbell, Brain, Heart, Droplet, Utensils, Moon, Sun, Target, Zap, Award, Sparkles, Trophy, CheckCircle2, Clock, MapPin } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { triggerHaptic } from "@/utils/haptics";

interface NewHabitModalProps {
  open: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
}

const EDUCATIONAL_TIPS = {
  1: {
    icon: Target,
    title: "Lei 1: Torne Óbvio",
    description: "Quanto mais específico você for sobre quando e onde vai agir, maior a chance de seguir através.",
  },
  2: {
    icon: Sparkles,
    title: "Lei 2: Torne Atraente",
    description: "Combine seu hábito com algo que você gosta.",
  },
  3: {
    icon: Zap,
    title: "Lei 3: Torne Fácil",
    description: "A Regra dos 2 Minutos: comece pequeno para facilitar a consistência.",
  },
  4: {
    icon: Trophy,
    title: "Lei 4: Torne Satisfatório",
    description: "Celebre suas pequenas vitórias e crie reforços positivos imediatos.",
  }
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
  
  // ETAPA 1: Criação Essencial
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0].name);
  const [triggerType, setTriggerType] = useState<"time" | "habit">("time");
  const [whenTime, setWhenTime] = useState("");
  const [habitStack, setHabitStack] = useState<number | null>(null);
  const [location, setLocation] = useState("");
  const [goal, setGoal] = useState(5);
  const [unit, setUnit] = useState("minutos");
  
  // ETAPA 2: Otimização (4 Leis)
  const [showOptimization, setShowOptimization] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [temptationBundle, setTemptationBundle] = useState("");
  const [twoMinuteVersion, setTwoMinuteVersion] = useState("");
  const [environmentPrep, setEnvironmentPrep] = useState("");
  const [reward, setReward] = useState("");
  const [completedLaws, setCompletedLaws] = useState<Set<string>>(new Set());

  const resetForm = () => {
    setTitle("");
    setSelectedIcon(ICON_OPTIONS[0].name);
    setTriggerType("time");
    setWhenTime("");
    setHabitStack(null);
    setLocation("");
    setGoal(5);
    setUnit("minutos");
    setShowOptimization(false);
    setMotivation("");
    setTemptationBundle("");
    setTwoMinuteVersion("");
    setEnvironmentPrep("");
    setReward("");
    setCompletedLaws(new Set());
  };

  const LOCATION_SUGGESTIONS = ["Casa", "Academia", "Escritório", "Quarto", "Cozinha"];

  const toggleLawComplete = (law: string) => {
    setCompletedLaws(prev => {
      const newSet = new Set(prev);
      if (newSet.has(law)) {
        newSet.delete(law);
      } else {
        newSet.add(law);
      }
      return newSet;
    });
  };

  const handleCreate = async () => {
    if (!title.trim() || !whenTime || !location) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      await createHabit({
        title: title.trim(),
        icon: selectedIcon,
        when_time: whenTime,
        where_location: location.trim(),
        trigger_activity: triggerType === "habit" && habitStack ? `Habit ID: ${habitStack}` : null,
        temptation_bundle: temptationBundle.trim() || null,
        environment_prep: environmentPrep.trim() || null,
        goal_target: goal,
        goal_unit: unit,
      });

      toast.success("Hábito criado com sucesso! 🌱");
      triggerHaptic('success');
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
        "overflow-hidden p-0 flex flex-col border-0 bg-background/95 backdrop-blur-xl",
        isMobile 
          ? "h-[95vh] rounded-t-3xl" 
          : "max-w-2xl w-full max-h-[90vh] rounded-3xl shadow-2xl"
      )}>
        {isMobile ? (
          <>
            <DrawerTitle className="sr-only">Novo Hábito</DrawerTitle>
            <DrawerDescription className="sr-only">Crie um novo hábito</DrawerDescription>
          </>
        ) : (
          <>
            <DialogTitle className="sr-only">Novo Hábito</DialogTitle>
            <DialogDescription className="sr-only">Crie um novo hábito</DialogDescription>
          </>
        )}
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
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
              className="hover:bg-muted/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

        </div>

        {/* ETAPA 1: Criação Essencial */}
        <div className="overflow-y-auto p-6 flex-1 min-h-0 space-y-6">
          <div className="space-y-5">
            {/* Nome */}
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome do Hábito"
                className="text-lg border-0 bg-muted/30 px-0 focus-visible:ring-0 placeholder:text-muted-foreground/40"
                autoFocus
              />
            </div>

            {/* Ícone */}
            <div>
              <Label className="text-sm text-muted-foreground mb-3 block">Ícone</Label>
              <div className="grid grid-cols-6 gap-3">
                {ICON_OPTIONS.map(({ icon: Icon, name }) => (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedIcon(name);
                      triggerHaptic('light');
                    }}
                    className={cn(
                      "aspect-square rounded-2xl flex items-center justify-center transition-all",
                      selectedIcon === name 
                        ? "bg-primary/20 scale-105" 
                        : "bg-muted/30 hover:bg-muted/50"
                    )}
                  >
                    <Icon className={cn(
                      "w-6 h-6",
                      selectedIcon === name ? "text-primary" : "text-muted-foreground"
                    )} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quando (Segmented Control) */}
            <div>
              <Label className="text-sm text-muted-foreground mb-3 block">Quando</Label>
              <div className="flex gap-2 p-1 bg-muted/30 rounded-xl">
                <button
                  onClick={() => {
                    setTriggerType("time");
                    setHabitStack(null);
                    triggerHaptic('light');
                  }}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                    triggerType === "time"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  Em um horário
                </button>
                <button
                  onClick={() => {
                    setTriggerType("habit");
                    triggerHaptic('light');
                  }}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                    triggerType === "habit"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Target className="w-4 h-4 inline mr-2" />
                  Após um hábito
                </button>
              </div>

              {triggerType === "time" && (
                <Input
                  value={whenTime}
                  onChange={(e) => setWhenTime(e.target.value)}
                  placeholder="Ex: Às 7h, Após o café da manhã"
                  className="mt-3 border-0 bg-muted/30"
                />
              )}

              {triggerType === "habit" && habits && habits.length > 0 && (
                <select
                  value={habitStack || ""}
                  onChange={(e) => {
                    const habitId = e.target.value ? Number(e.target.value) : null;
                    const habit = habits.find(h => h.id === habitId);
                    setHabitStack(habitId);
                    if (habit) setWhenTime(`Após ${habit.title}`);
                  }}
                  className="mt-3 w-full px-4 py-2.5 rounded-xl border-0 bg-muted/30 text-foreground"
                >
                  <option value="">Selecione um hábito</option>
                  {habits.map(habit => (
                    <option key={habit.id} value={habit.id}>{habit.title}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Onde */}
            <div>
              <Label className="text-sm text-muted-foreground mb-3 block">Onde</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Local"
                className="border-0 bg-muted/30 mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {LOCATION_SUGGESTIONS.map(loc => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className="px-3 py-1.5 rounded-full text-xs bg-muted/30 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Meta */}
            <div>
              <Label className="text-sm text-muted-foreground mb-3 block">Meta (Opcional)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  className="flex-1 border-0 bg-muted/30"
                  min={1}
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="px-4 rounded-xl border-0 bg-muted/30 text-foreground"
                >
                  {UNIT_OPTIONS.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ETAPA 2: Otimização (Acordeão) */}
          {!showOptimization && (
            <Button
              variant="outline"
              onClick={() => {
                setShowOptimization(true);
                triggerHaptic('light');
              }}
              className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/10"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              + Otimizar com as 4 Leis
            </Button>
          )}

          {showOptimization && (
            <Accordion type="multiple" className="space-y-3">
              {/* Lei 1 */}
              <AccordionItem value="law1" className="border-0 bg-muted/20 rounded-2xl px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    {completedLaws.has("law1") && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                    <Target className="w-5 h-5 text-primary" />
                    <span className="font-medium">1. Torne Óbvio</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {EDUCATIONAL_TIPS[1].description}
                  </p>
                  <Textarea
                    value={motivation}
                    onChange={(e) => {
                      setMotivation(e.target.value);
                      if (e.target.value) toggleLawComplete("law1");
                    }}
                    placeholder="Como tornar este hábito óbvio no seu dia?"
                    className="border-0 bg-background/50"
                    rows={2}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Lei 2 */}
              <AccordionItem value="law2" className="border-0 bg-muted/20 rounded-2xl px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    {completedLaws.has("law2") && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-medium">2. Torne Atraente</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {EDUCATIONAL_TIPS[2].description}
                  </p>
                  <Textarea
                    value={temptationBundle}
                    onChange={(e) => {
                      setTemptationBundle(e.target.value);
                      if (e.target.value) toggleLawComplete("law2");
                    }}
                    placeholder="O que você pode combinar com este hábito para torná-lo atraente?"
                    className="border-0 bg-background/50"
                    rows={2}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Lei 3 */}
              <AccordionItem value="law3" className="border-0 bg-muted/20 rounded-2xl px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    {completedLaws.has("law3") && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="font-medium">3. Torne Fácil</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {EDUCATIONAL_TIPS[3].description}
                  </p>
                  <Textarea
                    value={twoMinuteVersion}
                    onChange={(e) => {
                      setTwoMinuteVersion(e.target.value);
                      if (e.target.value) toggleLawComplete("law3");
                    }}
                    placeholder="Qual a versão de 2 minutos deste hábito?"
                    className="border-0 bg-background/50"
                    rows={2}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Lei 4 */}
              <AccordionItem value="law4" className="border-0 bg-muted/20 rounded-2xl px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    {completedLaws.has("law4") && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="font-medium">4. Torne Satisfatório</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {EDUCATIONAL_TIPS[4].description}
                  </p>
                  <Textarea
                    value={reward}
                    onChange={(e) => {
                      setReward(e.target.value);
                      if (e.target.value) toggleLawComplete("law4");
                    }}
                    placeholder="Como você vai se recompensar?"
                    className="border-0 bg-background/50"
                    rows={2}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 shrink-0 bg-background/50 backdrop-blur-sm">
          <Button
            onClick={handleCreate}
            disabled={isCreating || !title.trim() || !whenTime || !location}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl"
          >
            {isCreating ? "Criando..." : "Criar Hábito"}
          </Button>
        </div>
      </Content>
    </Container>
  );
};

export default NewHabitModal;
