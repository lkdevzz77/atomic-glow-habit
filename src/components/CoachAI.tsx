import React, { useState, useEffect } from "react";
import { Sparkles, BarChart, Target, Trophy, Zap } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const CoachAI = () => {
  const { user, habits } = useApp();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const aiTips = [
    `Você está mantendo boa consistência, ${user?.name}! Continue aproveitando esse momento.`,
    "Que tal empilhar um novo hábito de 2 minutos após um hábito existente?",
    "Seus melhores dias são quando você completa hábitos pela manhã. Use isso a seu favor!",
    "Lei #4 em ação: cada check é um voto para sua identidade desejada.",
    "Lembre-se: não quebre a corrente. Mas se quebrar, não quebre duas vezes.",
    "Está difícil começar? Aplique a regra: faça apenas por 2 minutos.",
    "Hábitos atômicos: pequenas mudanças, resultados extraordinários.",
    "1% melhor todo dia é o caminho para a transformação.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % aiTips.length);
    }, 30000); // Troca a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const completedHabits = habits.filter(h => h.status === "completed").length;
  const totalHabits = habits.length;
  const averageStreak = habits.length > 0 
    ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length)
    : 0;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* AI Coach Card */}
      <div className="glass-violet border-2 border-violet-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center overflow-hidden">
            <img 
              src="/atom-logo.svg" 
              alt=""
              className="w-6 h-6 sm:w-8 sm:h-8 opacity-80"
              style={{
                animation: 'spin-slow 8s linear infinite'
              }}
            />
          </div>
          <div>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold heading-sub text-violet-400">💡 Seu Coach IA</h3>
            <p className="text-xs text-violet-400/70">Análise em tempo real</p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent mb-3 sm:mb-4" />

        <p className="text-slate-200 body-text text-sm sm:text-base leading-relaxed min-h-[60px] sm:min-h-[80px]">
          {aiTips[currentTipIndex]}
        </p>

        <button className="text-violet-400 text-xs sm:text-sm hover:text-violet-300 transition-colors mt-3 sm:mt-4">
          Ver mais dicas →
        </button>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 hover:shadow-lg hover:shadow-violet-500/20 transition-all hover-scale-sm">
          <div className="flex items-center gap-2 mb-2">
            <BarChart className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-slate-300">Taxa</span>
          </div>
          <div className="text-2xl font-bold text-slate-50">
            {totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0}%
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 hover:shadow-lg hover:shadow-violet-500/20 transition-all hover-scale-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-slate-300">Hábitos</span>
          </div>
          <div className="text-2xl font-bold text-slate-50">{totalHabits}</div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 hover:shadow-lg hover:shadow-violet-500/20 transition-all hover-scale-sm">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-slate-300">Badges</span>
          </div>
          <div className="text-2xl font-bold text-slate-50">0/6</div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 hover:shadow-lg hover:shadow-violet-500/20 transition-all hover-scale-sm">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-slate-300">Média</span>
          </div>
          <div className="text-2xl font-bold text-slate-50">{averageStreak}</div>
        </div>
      </div>
    </div>
  );
};

export default CoachAI;
