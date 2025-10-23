import React, { useState, useMemo } from 'react';
import { Plus, Search, Flame, TrendingUp, Edit, Trash2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { useHabits } from '@/hooks/useHabits';
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
import NewHabitModal from '@/components/NewHabitModal';
import HabitCard from '@/components/HabitCard';
import { DailyProgressCard } from '@/components/habits/DailyProgressCard';
import { HabitEmptyState } from '@/components/habits/HabitEmptyState';
import { Icon } from '@/config/icon-map';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AnimatedPage } from '@/components/AnimatedPage';
import { PageLoader } from '@/components/PageLoader';
import { calculateCompletionRate, getStreakEmoji } from '@/utils/habitMetrics';
import { cn } from '@/lib/utils';
import { useLevel } from '@/hooks/useLevel';

export default function HabitsPage() {
  const navigate = useNavigate();
  const { data: habits, deleteHabit, isLoading } = useHabits();
  const { level, xp } = useLevel();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'streak' | 'name' | 'completion'>('recent');
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);
  const isMobile = useIsMobile();

  // Calcula progresso do dia
  const dailyProgress = useMemo(() => {
    if (!habits) return { completed: 0, total: 0, xpEarned: 0, habits: [] };
    
    const activeHabits = habits.filter(h => h.status === 'active');
    const completedHabits = activeHabits.filter(h => h.completedToday);
    
    // Estima XP ganho (15 XP base por hábito)
    const xpEarned = completedHabits.length * 15;
    
    return {
      completed: completedHabits.length,
      total: activeHabits.length,
      xpEarned,
      habits: activeHabits.map(h => ({
        id: h.id,
        title: h.title,
        completed: h.completedToday || false
      }))
    };
  }, [habits]);

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
          <div className="relative overflow-hidden neuro-card card-rounded card-padding">
            {/* Background Particles */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-primary-glow/20 blur-3xl animate-pulse" />
              <div className="absolute bottom-4 left-8 w-24 h-24 rounded-full bg-accent/20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">⚛️</span>
                  <h1 className="text-page-title">Meus Hábitos</h1>
                </div>
                <p className="text-subtitle">
                  {habits && habits.filter(h => h.status === 'active').length} hábitos ativos
                  {dailyProgress.total > 0 && (
                    <span className="text-success ml-2">
                      • {dailyProgress.completed} completados hoje
                    </span>
                  )}
                </p>
              </div>
              
              {/* Level Badge + CTA */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="neuro-interactive px-4 py-2 rounded-full flex items-center gap-2">
                  <Sparkles size={16} className="text-primary-glow" />
                  <span className="text-sm font-semibold">Nível {level}</span>
                </div>
                
                <Button 
                  onClick={() => setIsNewHabitModalOpen(true)} 
                  size="lg" 
                  className="flex-1 sm:flex-none hidden md:flex gap-2"
                >
                  <Plus size={20} />
                  Novo Hábito
                </Button>
              </div>
            </div>
          </div>

          {/* FAB - Mobile only */}
          <FloatingActionButton onClick={() => setIsNewHabitModalOpen(true)} />

          {/* Daily Progress Card */}
          {dailyProgress.total > 0 && (
            <DailyProgressCard {...dailyProgress} />
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
            {filteredHabits && filteredHabits.length > 0 ? (
              filteredHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))
            ) : habits && habits.length === 0 ? (
              <HabitEmptyState onCreateHabit={() => setIsNewHabitModalOpen(true)} />
            ) : (
              <Card className="p-12 text-center neuro-card">
                <p className="text-muted-foreground">Nenhum hábito encontrado com esses filtros</p>
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
