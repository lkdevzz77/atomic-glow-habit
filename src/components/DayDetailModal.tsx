import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface Habit {
  id: number;
  title: string;
  icon: string;
  goal_target: number;
  goal_unit: string;
}

interface Completion {
  id: number;
  habit_id: number;
  completed_at: string;
  percentage: number;
}

interface DayDetailModalProps {
  date: Date;
  habits: Habit[];
  completions: Completion[];
  onClose: () => void;
  onToggleCompletion?: (habitId: number) => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  date,
  habits,
  completions,
  onClose,
  onToggleCompletion,
}) => {
  const [note, setNote] = useState('');
  
  const completedHabitIds = new Set(completions.map(c => c.habit_id));
  const completionPercentage = habits.length > 0 
    ? (completedHabitIds.size / habits.length) * 100 
    : 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] glass border-slate-700 p-0">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">
              {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Progresso do dia</span>
                <span className="font-semibold">{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </div>

          {/* Habits List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {habits.map((habit) => {
              const completion = completions.find(c => c.habit_id === habit.id);
              const isCompleted = !!completion;
              
              return (
                <div
                  key={habit.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => onToggleCompletion?.(habit.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{habit.icon}</span>
                      <span className={`font-medium ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {habit.title}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {habit.goal_target} {habit.goal_unit}
                      {completion && (
                        <span className="ml-2">
                          • Concluído às {format(new Date(completion.completed_at), 'HH:mm')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              💭 Nota do dia (opcional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Como foi seu dia? Alguma reflexão?"
              className="min-h-[80px] bg-slate-800/50 border-slate-700 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-600 hover:bg-slate-700"
            >
              Fechar
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayDetailModal;
