import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lightbulb, TrendingUp, AlertTriangle, Trophy } from 'lucide-react';

interface SmartInsightsProps {
  averageCompletion: number;
  currentStreak: number;
  bestDay: { date: string; percentage: number };
  worstDay: { date: string; percentage: number };
  totalCompletions: number;
}

interface Insight {
  type: 'success' | 'warning' | 'celebration' | 'tip';
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SmartInsights = ({ 
  averageCompletion, 
  currentStreak, 
  bestDay, 
  worstDay,
  totalCompletions 
}: SmartInsightsProps) => {
  const insights = useMemo(() => {
    const result: Insight[] = [];

    // Insight 1: Alta performance
    if (averageCompletion >= 75) {
      result.push({
        type: 'celebration',
        icon: <Trophy className="w-5 h-5" />,
        title: 'Desempenho excepcional!',
        description: `Com ${Math.round(averageCompletion)}% de conclusão, você está entre os mais consistentes. Continue assim!`,
      });
    }

    // Insight 2: Sequência forte
    if (currentStreak >= 7) {
      result.push({
        type: 'success',
        icon: <TrendingUp className="w-5 h-5" />,
        title: `${currentStreak} dias de sequência! 🔥`,
        description: 'Você está construindo um hábito sólido. A consistência é a chave para mudanças duradouras.',
      });
    }

    // Insight 3: Dia desafiador
    if (worstDay.percentage < 50 && averageCompletion >= 60) {
      const worstDayName = new Date(worstDay.date).toLocaleDateString('pt-BR', { weekday: 'long' });
      result.push({
        type: 'warning',
        icon: <AlertTriangle className="w-5 h-5" />,
        title: `${worstDayName} precisa de atenção`,
        description: 'Tente programar hábitos mais simples ou ajustar o horário para dias desafiadores.',
      });
    }

    // Insight 4: Dica geral
    if (totalCompletions > 0 && averageCompletion < 70) {
      result.push({
        type: 'tip',
        icon: <Lightbulb className="w-5 h-5" />,
        title: 'Dica para melhorar',
        description: 'Reduza o número de hábitos ou simplifique-os. É melhor fazer menos consistentemente do que muitos de forma irregular.',
      });
    }

    return result;
  }, [averageCompletion, currentStreak, bestDay, worstDay, totalCompletions]);

  if (insights.length === 0) return null;

  return (
    <div className="space-y-2">
      {insights.map((insight, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={cn(
            "p-3 rounded-lg border-l-4 bg-card/30 backdrop-blur-sm",
            insight.type === 'success' && "border-chart-1",
            insight.type === 'warning' && "border-chart-2",
            insight.type === 'celebration' && "border-primary",
            insight.type === 'tip' && "border-chart-3"
          )}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{insight.icon}</span>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-sm mb-0.5">
                {insight.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {insight.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SmartInsights;
