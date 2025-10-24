import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useHabits } from '@/hooks/useHabits';
import { AppLayout } from '@/layouts/AppLayout';
import { AnimatedPage } from '@/components/AnimatedPage';
import { PageLoader } from '@/components/PageLoader';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Dumbbell, Brain, Heart, Droplet, Utensils, Moon, Sun, Target, Zap, Award, Sparkles, Trophy, HelpCircle, CheckCircle2, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

const EDUCATIONAL_TIPS = {
  1: {
    icon: Target,
    title: "Lei 1: Torne Óbvio",
    description: "Quanto mais específico você for sobre quando e onde vai agir, maior a chance de seguir através.",
  },
  2: {
    icon: Sparkles,
    title: "Lei 2: Torne Atraente",
    description: "Combine seu hábito com algo que você gosta. O bundling de tentações aumenta a motivação.",
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

export default function HabitEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateHabit } = useHabits();
  
  const [currentTab, setCurrentTab] = useState(0);
  const [completedTabs, setCompletedTabs] = useState<Set<number>>(new Set());
  
  // Form states
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Dumbbell');
  const [goal, setGoal] = useState(1);
  const [unit, setUnit] = useState('minutos');
  const [whenTime, setWhenTime] = useState('');
  const [location, setLocation] = useState('');
  const [triggerActivity, setTriggerActivity] = useState('');
  const [motivation, setMotivation] = useState('');
  const [twoMinuteVersion, setTwoMinuteVersion] = useState('');
  const [reward, setReward] = useState('');
  const [habitStack, setHabitStack] = useState('');

  // Fetch habit data
  const { data: habit, isLoading } = useQuery({
    queryKey: ['habit', id],
    queryFn: async () => {
      if (!user || !id) return null;
      
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('id', parseInt(id))
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!id,
  });

  // Load habit data into form
  useEffect(() => {
    if (habit) {
      setTitle(habit.title || '');
      setSelectedIcon(habit.icon || 'Dumbbell');
      setGoal(habit.goal_target || 1);
      setUnit(habit.goal_unit || 'minutos');
      setWhenTime(habit.when_time || '');
      setLocation(habit.where_location || '');
      setTriggerActivity(habit.trigger_activity || '');
      setMotivation(habit.temptation_bundle || '');
      setTwoMinuteVersion(habit.two_minute_version || habit.temptation_bundle || '');
      setReward(habit.immediate_reward || '');
      setHabitStack(habit.habit_stack || '');
    }
  }, [habit]);

  const progressPercentage = (completedTabs.size / 4) * 100;

  const isTabComplete = (tab: number) => {
    switch(tab) {
      case 0: return title && whenTime && location;
      case 1: return motivation;
      case 2: return goal && unit && twoMinuteVersion;
      case 3: return reward;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentTab < 3) {
      setCompletedTabs(prev => new Set([...prev, currentTab]));
      setCurrentTab(currentTab + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !id) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return;
    }

    try {
      await updateHabit({
        id: parseInt(id),
        data: {
          title: title.trim(),
          icon: selectedIcon,
          when_time: whenTime,
          where_location: location.trim(),
          trigger_activity: triggerActivity.trim() || null,
          temptation_bundle: `${motivation.trim()} | Recompensa: ${reward.trim()} | 2min: ${twoMinuteVersion.trim()}` || null,
          goal_target: goal,
          goal_unit: unit,
        }
      });

      toast.success("Hábito atualizado com sucesso! 🎉");
      navigate('/habits');
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error("Erro ao atualizar hábito");
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!habit) {
    return (
      <AppLayout>
        <AnimatedPage>
          <div className="max-w-2xl mx-auto">
            <Breadcrumbs />
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Hábito não encontrado</p>
              <Button onClick={() => navigate('/habits')} className="mt-4">
                Voltar para Hábitos
              </Button>
            </Card>
          </div>
        </AnimatedPage>
      </AppLayout>
    );
  }

  const EducationalTip = EDUCATIONAL_TIPS[currentTab + 1 as keyof typeof EDUCATIONAL_TIPS];
  const TipIcon = EducationalTip?.icon;

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="max-w-3xl mx-auto space-y-6">
          <Breadcrumbs />
          
          <Card className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Target className="text-primary" />
                Editar Hábito
              </h1>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Progresso</span>
                  <span className="text-sm font-medium text-primary">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>

            {/* Tabs */}
            <TooltipProvider>
              <Tabs value={currentTab.toString()} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  {[0, 1, 2, 3].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab.toString()}
                      onClick={() => setCurrentTab(tab)}
                      className="relative"
                    >
                      {tab === 0 && <Target className="w-4 h-4 mr-2" />}
                      {tab === 1 && <Sparkles className="w-4 h-4 mr-2" />}
                      {tab === 2 && <Zap className="w-4 h-4 mr-2" />}
                      {tab === 3 && <Trophy className="w-4 h-4 mr-2" />}
                      
                      {completedTabs.has(tab) && (
                        <CheckCircle2 className="w-4 h-4 absolute -top-1 -right-1 text-primary" />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Educational Tip */}
                {EducationalTip && (
                  <Card className="bg-primary/5 border-primary/10 p-4 mb-6">
                    <div className="flex items-start gap-3">
                      {TipIcon && <TipIcon className="w-5 h-5 text-primary mt-0.5" />}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{EducationalTip.title}</h3>
                        <p className="text-sm text-muted-foreground">{EducationalTip.description}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Tab 0: Óbvio */}
                <TabsContent value="0" className="space-y-4">
                  <div>
                    <Label htmlFor="title">
                      Nome do Hábito <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Ler 10 páginas, Meditar 5 minutos..."
                      autoFocus
                    />
                  </div>

                  <div>
                    <Label>
                      Ícone
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 inline ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Escolha um ícone que represente seu hábito</TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {ICON_OPTIONS.map(({ icon: Icon, name }) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setSelectedIcon(name)}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all hover:scale-105",
                            selectedIcon === name
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <Icon className="w-5 h-5 mx-auto" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="whenTime">
                      Quando <span className="text-destructive">*</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 inline ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Defina um momento específico do dia</TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="whenTime"
                      value={whenTime}
                      onChange={(e) => setWhenTime(e.target.value)}
                      placeholder="Ex: Após o café da manhã, Ao acordar..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">
                      Onde <span className="text-destructive">*</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 inline ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Local específico aumenta as chances de sucesso</TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ex: Na mesa de estudos, No quarto..."
                    />
                  </div>
                </TabsContent>

                {/* Tab 1: Atraente */}
                <TabsContent value="1" className="space-y-4">
                  <div>
                    <Label htmlFor="motivation">
                      O que torna atraente?
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 inline ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Combine com algo prazeroso</TooltipContent>
                      </Tooltip>
                    </Label>
                    <Textarea
                      id="motivation"
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Ex: Ouvir música favorita enquanto pratico"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="habitStack">
                      Empilhamento de hábito
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 inline ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Associe a um hábito existente</TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="habitStack"
                      value={habitStack}
                      onChange={(e) => setHabitStack(e.target.value)}
                      placeholder="Ex: Após escovar os dentes..."
                    />
                  </div>
                </TabsContent>

                {/* Tab 2: Fácil */}
                <TabsContent value="2" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="goal">
                        Meta <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="goal"
                        type="number"
                        value={goal}
                        onChange={(e) => setGoal(Number(e.target.value))}
                        min={1}
                      />
                    </div>

                    <div>
                      <Label htmlFor="unit">
                        Unidade <span className="text-destructive">*</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 inline ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Como você vai medir?</TooltipContent>
                        </Tooltip>
                      </Label>
                      <select
                        id="unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {UNIT_OPTIONS.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="twoMinute">
                      Versão de 2 minutos <span className="text-destructive">*</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 inline ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Versão super fácil para começar</TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="twoMinute"
                      value={twoMinuteVersion}
                      onChange={(e) => setTwoMinuteVersion(e.target.value)}
                      placeholder="Ex: Ler apenas 1 página, Fazer 5 flexões..."
                    />
                  </div>
                </TabsContent>

                {/* Tab 3: Satisfatório */}
                <TabsContent value="3" className="space-y-4">
                  <div>
                    <Label htmlFor="reward">
                      Recompensa Imediata
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 inline ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Como você vai se recompensar?</TooltipContent>
                      </Tooltip>
                    </Label>
                    <Textarea
                      id="reward"
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                      placeholder="Ex: Marcar com X no calendário, Tomar um café especial..."
                      rows={3}
                    />
                  </div>

                  {/* Preview */}
                  <Card className="bg-muted/30 p-4">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Preview do seu hábito
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        {(() => {
                          const Icon = ICON_OPTIONS.find(opt => opt.name === selectedIcon)?.icon || Target;
                          return <Icon className="w-5 h-5 text-primary" />;
                        })()}
                      </div>
                      <div>
                        <p className="font-medium">{title || 'Seu hábito'}</p>
                        <p className="text-xs text-muted-foreground">
                          {whenTime || 'Quando'} • {goal} {unit}
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </TooltipProvider>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => navigate('/habits')}>
                Cancelar
              </Button>
              
              <div className="flex items-center gap-2">
                {currentTab > 0 && (
                  <Button variant="outline" onClick={handleBack}>
                    ← Voltar
                  </Button>
                )}
                <Button onClick={handleNext}>
                  {currentTab < 3 ? 'Avançar →' : 'Salvar Alterações'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
}
