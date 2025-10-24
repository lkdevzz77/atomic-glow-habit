import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Flame, Zap, Circle, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { getIconComponent } from '@/config/icon-map';

interface HabitTimelineItem {
  id: number;
  title: string;
  icon: string;
  completed: boolean;
  completedAt?: string;
}

interface DailyProgressCardProps {
  completedToday: number;
  totalHabits: number;
  activeStreaks: number;
  xpEarned: number;
  habits?: HabitTimelineItem[];
}

export const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
  completedToday,
  totalHabits,
  activeStreaks,
  xpEarned,
  habits = []
}) => {
  const progressPercentage = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Linha do Tempo do Dia</h2>
          <span className="text-2xl font-bold text-primary">
            {Math.round(progressPercentage)}%
          </span>
        </div>

        {/* Timeline Horizontal */}
        {habits.length > 0 && (
          <div className="relative">
            {/* Linha conectora */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
            <div 
              className="absolute top-6 left-0 h-0.5 bg-primary transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
            
            {/* Hábitos na timeline */}
            <div className="relative flex justify-between items-start gap-2">
              {habits.map((habit, index) => {
                const IconComponent = getIconComponent(habit.icon);
                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    {/* Ícone do hábito */}
                    <div
                      className={`
                        relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                        border-2 transition-all duration-300
                        ${habit.completed 
                          ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/50' 
                          : 'bg-card border-border text-muted-foreground'
                        }
                      `}
                    >
                      {habit.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </div>
                    
                    {/* Nome do hábito */}
                    <div className="text-center">
                      <p className={`text-xs font-medium truncate max-w-[80px] ${
                        habit.completed ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {habit.title}
                      </p>
                      {habit.completed && habit.completedAt && (
                        <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(habit.completedAt).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center p-3 rounded-lg bg-primary/5 border border-primary/10"
          >
            <CheckCircle2 className="w-5 h-5 text-primary mb-2" />
            <span className="text-xl font-bold text-foreground">{completedToday}</span>
            <span className="text-xs text-muted-foreground">Completados</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center p-3 rounded-lg bg-orange-500/5 border border-orange-500/10"
          >
            <Flame className="w-5 h-5 text-orange-500 mb-2" />
            <span className="text-xl font-bold text-foreground">{activeStreaks}</span>
            <span className="text-xs text-muted-foreground">Streaks</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center p-3 rounded-lg bg-primary/5 border border-primary/10"
          >
            <Zap className="w-5 h-5 text-primary mb-2" />
            <span className="text-xl font-bold text-foreground">{xpEarned}</span>
            <span className="text-xs text-muted-foreground">XP</span>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};
