import React, { useState } from 'react';
import { Plus, Search, Flame, Edit, Trash2, ChevronDown, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { useHabits } from '@/hooks/useHabits';
import { useLevel } from '@/hooks/useLevel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import NewHabitModal from '@/components/NewHabitModal';
import * as LucideIcons from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AnimatedPage } from '@/components/AnimatedPage';
import { PageLoader } from '@/components/PageLoader';
import { QuickStatsCard } from '@/components/habits/QuickStatsCard';
import { HabitEmptyState } from '@/components/habits/HabitEmptyState';
import { DeleteHabitDialog } from '@/components/DeleteHabitDialog';
import { 
  calculateCompletionRate, 
  getStreakEmoji, 
  getStreakLevel, 
  isNewHabit,
  getDaysActive 
} from '@/utils/habitMetrics';

const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Atom;
};

export default function HabitsPage() {
  const navigate = useNavigate();
  const { data: habits, deleteHabit, isLoading } = useHabits();
  const { level, xp } = useLevel();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'streak' | 'name' | 'completion'>('recent');
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);
  const [deleteHabitId, setDeleteHabitId] = useState<number | null>(null);
  const isMobile = useIsMobile();

  // Find the habit to delete for the dialog
  const habitToDelete = habits?.find(h => h.id === deleteHabitId);

  // Calculate daily stats
  const completedToday = habits?.filter(h => h.completedToday).length || 0;
  const totalHabits = habits?.filter(h => h.status === 'active').length || 0;
  const xpEarnedToday = completedToday * 10; // Estimativa: 10 XP por hábito

  // Filtrar hábitos
  const filteredHabits = habits
    ?.filter((habit) => {
      const matchesSearch = habit.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && habit.status === 'active') ||
        (filterStatus === 'archived' && habit.status === 'archived');
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'streak':
          return (b.streak || 0) - (a.streak || 0);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'completion':
          const aRate = a.total_completions || 0;
          const bRate = b.total_completions || 0;
          return bRate - aRate;
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleDelete = async (id: number) => {
    setDeleteHabitId(id);
  };

  const confirmDelete = () => {
    if (deleteHabitId !== null) {
      deleteHabit(deleteHabitId);
      setDeleteHabitId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteHabitId(null);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          <Breadcrumbs />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Meus Hábitos</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {totalHabits} hábitos ativos • {completedToday} completados hoje
              </p>
            </div>
            <Badge variant="secondary">Nível {level}</Badge>
          </div>

          {/* Desktop button */}
          <Button 
            onClick={() => setIsNewHabitModalOpen(true)} 
            className="w-full sm:w-auto mb-4 hidden md:flex"
          >
            <Plus className="mr-2" size={20} />
            Novo Hábito
          </Button>

          {/* FAB - Mobile only */}
          <FloatingActionButton onClick={() => setIsNewHabitModalOpen(true)} />

          {/* Quick Stats Card */}
          {totalHabits > 0 && (
            <QuickStatsCard
              completedToday={completedToday}
              totalHabits={totalHabits}
              xpEarned={xpEarnedToday}
              nextBadge={{
                name: 'Molécula',
                progress: 23,
                total: 30,
              }}
            />
          )}

          {/* Filtros */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Buscar hábitos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="archived">Arquivados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="streak">Maior Streak</SelectItem>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
                <SelectItem value="completion">Taxa de Sucesso</SelectItem>
              </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Lista de Hábitos */}
          <div className="space-y-4">
            {!habits || habits.length === 0 ? (
              <HabitEmptyState onCreateHabit={() => setIsNewHabitModalOpen(true)} />
            ) : filteredHabits && filteredHabits.length > 0 ? (
              filteredHabits.map((habit, index) => {
                const Icon = getIconComponent(habit.icon);
                const completionRate = calculateCompletionRate(habit);
                const streakLevel = getStreakLevel(habit.streak || 0);
                const streakEmoji = getStreakEmoji(habit.streak || 0);
                const isNew = isNewHabit(habit.created_at);
                const daysActive = getDaysActive(habit.created_at);

                // Border gradient para streaks altos
                const borderClass = 
                  streakLevel === 'diamond' ? 'border-amber-400/40 shadow-amber-400/10' :
                  streakLevel === 'star' ? 'border-amber-500/30 shadow-amber-500/10' :
                  streakLevel === 'fire' ? 'border-orange-500/30 shadow-orange-500/10' :
                  'border-slate-700';

                return (
                  <Card 
                    key={habit.id} 
                    className={`p-4 sm:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${borderClass} animate-fade-in`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center ${
                            habit.completedToday ? 'ring-2 ring-emerald-500/50' : ''
                          }`}>
                            <Icon size={24} className="text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base sm:text-lg font-semibold">{habit.title}</h3>
                              {isNew && (
                                <Badge variant="secondary" className="text-xs">
                                  Novo
                                </Badge>
                              )}
                              {habit.completedToday && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {habit.when_time}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {habit.where_location}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span>{daysActive} dias ativo</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/habits/${habit.id}/edit`)}
                            className="hover:bg-violet-500/10 hover:text-violet-400"
                            title="Editar hábito"
                          >
                            <Edit size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(habit.id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                            title="Deletar hábito"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-semibold text-foreground">{habit.streak || 0}</div>
                            <div className="text-xs text-muted-foreground">dias</div>
                          </div>
                        </div>

                        <div className="h-8 w-px bg-border hidden sm:block" />

                        <div>
                          <div className="text-sm font-semibold text-foreground">{habit.total_completions || 0}</div>
                          <div className="text-xs text-muted-foreground">conclusões</div>
                        </div>

                        <div className="h-8 w-px bg-border hidden sm:block" />

                        <div className="flex-1 min-w-[120px]">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Taxa</span>
                            <span className="font-semibold text-foreground">{completionRate}%</span>
                          </div>
                          <Progress value={completionRate} className="h-1.5" />
                        </div>
                      </div>

                      {/* Accordion para as 4 Leis */}
                      {(habit.trigger_activity || habit.temptation_bundle || habit.environment_prep) && (
                        <Collapsible>
                          <CollapsibleTrigger className="w-full pt-4 border-t flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors group">
                            <div className="flex items-center gap-2">
                              <span>4 Leis do Comportamento</span>
                              {habit.trigger_activity && <Badge variant="secondary" className="text-xs">Lei 1</Badge>}
                              {habit.temptation_bundle && <Badge variant="secondary" className="text-xs">Lei 2</Badge>}
                              {habit.environment_prep && <Badge variant="secondary" className="text-xs">Lei 3</Badge>}
                            </div>
                            <ChevronDown className="w-3 h-3 transition-transform group-data-[state=open]:rotate-180" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-2 space-y-1.5 text-xs">
                            {habit.trigger_activity && (
                              <div className="p-2 rounded bg-muted/50">
                                <span className="font-medium text-foreground">Lei 1:</span>{' '}
                                <span className="text-muted-foreground">{habit.trigger_activity}</span>
                              </div>
                            )}
                            {habit.temptation_bundle && (
                              <div className="p-2 rounded bg-muted/50">
                                <span className="font-medium text-foreground">Lei 2:</span>{' '}
                                <span className="text-muted-foreground">{habit.temptation_bundle}</span>
                              </div>
                            )}
                            {habit.environment_prep && (
                              <div className="p-2 rounded bg-muted/50">
                                <span className="font-medium text-foreground">Lei 3:</span>{' '}
                                <span className="text-muted-foreground">{habit.environment_prep}</span>
                              </div>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? `Nenhum hábito encontrado para "${searchQuery}"`
                    : 'Nenhum hábito encontrado com os filtros selecionados'}
                </p>
              </Card>
            )}
          </div>

          <NewHabitModal
            open={isNewHabitModalOpen}
            onOpenChange={setIsNewHabitModalOpen}
          />

          <DeleteHabitDialog
            open={deleteHabitId !== null}
            habitTitle={habitToDelete?.title || ''}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </div>
      </AnimatedPage>
    </AppLayout>
  );
}
