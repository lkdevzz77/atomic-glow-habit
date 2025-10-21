import React, { useState } from 'react';
import { Plus, Search, Flame, TrendingUp, Archive, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { useHabits } from '@/hooks/useHabits';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import NewHabitModal from '@/components/NewHabitModal';
import * as LucideIcons from 'lucide-react';

const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Atom;
};

export default function HabitsPage() {
  const navigate = useNavigate();
  const { data: habits, deleteHabit } = useHabits();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'streak' | 'name' | 'completion'>('recent');
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);

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

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meus Hábitos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os seus hábitos em um só lugar
            </p>
          </div>
          <Button onClick={() => setIsNewHabitModalOpen(true)} size="lg">
            <Plus className="mr-2" size={20} />
            Novo Hábito
          </Button>
        </div>

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
            filteredHabits.map((habit) => {
              const Icon = getIconComponent(habit.icon);
              const completionRate = habit.total_completions
                ? Math.round((habit.total_completions / 30) * 100)
                : 0;

              return (
                <Card key={habit.id} className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center">
                          <Icon size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{habit.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>⏰ {habit.when_time}</span>
                            <span>•</span>
                            <span>📍 {habit.where_location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/habits/${habit.id}/edit`)}
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(habit.id)}
                        >
                          <Trash2 size={18} className="text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Flame size={18} className="text-orange-500" />
                        <div>
                          <div className="text-lg font-bold">{habit.streak || 0} dias</div>
                          <div className="text-xs text-muted-foreground">Streak Atual</div>
                        </div>
                      </div>

                      <div className="h-10 w-px bg-border" />

                      <div>
                        <div className="text-lg font-bold">{habit.total_completions || 0}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>

                      <div className="h-10 w-px bg-border" />

                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Taxa de Sucesso</span>
                          <span className="font-semibold">{completionRate}%</span>
                        </div>
                        <Progress value={completionRate} className="h-2" />
                      </div>
                    </div>

                    {/* Detalhes das 4 Leis (colapsável) */}
                    {(habit.trigger_activity || habit.temptation_bundle || habit.environment_prep) && (
                      <div className="pt-4 border-t space-y-2 text-sm">
                        {habit.trigger_activity && (
                          <div>
                            <span className="font-medium text-primary">Lei 1 - Óbvio:</span>{' '}
                            <span className="text-muted-foreground">{habit.trigger_activity}</span>
                          </div>
                        )}
                        {habit.temptation_bundle && (
                          <div>
                            <span className="font-medium text-primary">Lei 2 - Atraente:</span>{' '}
                            <span className="text-muted-foreground">{habit.temptation_bundle}</span>
                          </div>
                        )}
                        {habit.environment_prep && (
                          <div>
                            <span className="font-medium text-primary">Lei 3 - Fácil:</span>{' '}
                            <span className="text-muted-foreground">{habit.environment_prep}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Nenhum hábito encontrado</p>
            </Card>
          )}
        </div>
      </div>

      <NewHabitModal
        open={isNewHabitModalOpen}
        onOpenChange={setIsNewHabitModalOpen}
      />
    </AppLayout>
  );
}
