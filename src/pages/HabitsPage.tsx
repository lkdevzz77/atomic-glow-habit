import React, { useState } from 'react';
import { Plus, Search, Flame, Edit, Trash2, ChevronDown } from 'lucide-react';
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
  const isMobile = useIsMobile();

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
    if (confirm('Tem certeza que deseja deletar este hábito?')) {
      deleteHabit(id);
    }
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
          
          {/* Atomic Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 via-violet-900/20 to-slate-800/50 border border-violet-500/20 p-6">
            {/* Partículas de fundo */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-4 left-8 w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
              <div className="absolute top-12 right-12 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-100" />
              <div className="absolute bottom-8 left-16 w-1.5 h-1.5 bg-violet-300 rounded-full animate-pulse delay-200" />
            </div>

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                  ⚛️ Meus Hábitos
                </h1>
                <p className="text-slate-400 mt-2 text-sm sm:text-base">
                  {totalHabits} hábitos ativos • {completedToday} completados hoje
                </p>
              </div>
              
              {/* Badge de nível */}
              <Badge variant="outline" className="border-violet-500/50 bg-violet-900/20 text-violet-300">
                Nível {level}
              </Badge>
            </div>

            {/* Desktop button */}
            <Button 
              onClick={() => setIsNewHabitModalOpen(true)} 
              size="lg" 
              className="w-full sm:w-auto mt-4 hidden md:flex bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              <Plus className="mr-2" size={20} />
              Novo Hábito
            </Button>
          </div>

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
                                <Badge variant="outline" className="text-xs border-violet-500/50 bg-violet-900/20 text-violet-300">
                                  Novo
                                </Badge>
                              )}
                              {streakLevel === 'fire' && (
                                <Badge variant="outline" className="text-xs border-orange-500/50 bg-orange-900/20 text-orange-300">
                                  🔥 Em chamas
                                </Badge>
                              )}
                              {habit.completedToday && (
                                <Badge variant="outline" className="text-xs border-emerald-500/50 bg-emerald-900/20 text-emerald-300">
                                  ✓ Hoje
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                              <span>⏰ {habit.when_time}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>📍 {habit.where_location}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="text-slate-500">{daysActive} dias ativo</span>
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
                          <span className="text-2xl">{streakEmoji}</span>
                          <div>
                            <div className="text-base sm:text-lg font-bold">{habit.streak || 0} dias</div>
                            <div className="text-xs text-muted-foreground">Streak</div>
                          </div>
                        </div>

                        <div className="h-10 w-px bg-border hidden sm:block" />

                        <div>
                          <div className="text-base sm:text-lg font-bold">{habit.total_completions || 0}</div>
                          <div className="text-xs text-muted-foreground">Conclusões</div>
                        </div>

                        <div className="h-10 w-px bg-border hidden sm:block" />

                        <div className="flex-1 min-w-[120px]">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Taxa de Sucesso</span>
                            <span className="font-semibold">{completionRate}%</span>
                          </div>
                          <Progress value={completionRate} className="h-2" />
                        </div>
                      </div>

                      {/* Accordion para as 4 Leis */}
                      {(habit.trigger_activity || habit.temptation_bundle || habit.environment_prep) && (
                        <Collapsible>
                          <CollapsibleTrigger className="w-full pt-4 border-t flex items-center justify-between text-sm text-violet-400 hover:text-violet-300 transition-colors group">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">4 Leis do Comportamento</span>
                              {habit.trigger_activity && <Badge variant="outline" className="text-xs">Lei 1</Badge>}
                              {habit.temptation_bundle && <Badge variant="outline" className="text-xs">Lei 2</Badge>}
                              {habit.environment_prep && <Badge variant="outline" className="text-xs">Lei 3</Badge>}
                            </div>
                            <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-3 space-y-2 text-xs sm:text-sm">
                            {habit.trigger_activity && (
                              <div className="p-2 rounded bg-slate-800/30">
                                <span className="font-medium text-violet-400">Lei 1 - Óbvio:</span>{' '}
                                <span className="text-slate-300">{habit.trigger_activity}</span>
                              </div>
                            )}
                            {habit.temptation_bundle && (
                              <div className="p-2 rounded bg-slate-800/30">
                                <span className="font-medium text-violet-400">Lei 2 - Atraente:</span>{' '}
                                <span className="text-slate-300">{habit.temptation_bundle}</span>
                              </div>
                            )}
                            {habit.environment_prep && (
                              <div className="p-2 rounded bg-slate-800/30">
                                <span className="font-medium text-violet-400">Lei 3 - Fácil:</span>{' '}
                                <span className="text-slate-300">{habit.environment_prep}</span>
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
        </div>
      </AnimatedPage>
    </AppLayout>
  );
}
