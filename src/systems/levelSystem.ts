import { LucideIcon, Sprout, Leaf, User, UserCheck, Award, Medal, Crown, Sparkles, Zap, Atom } from 'lucide-react';

export interface Level {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  icon: LucideIcon;
  color: string;
  perks?: string[];
}

export interface LevelUpResult {
  didLevelUp: boolean;
  newLevel?: number;
  oldLevel?: number;
  rewards?: string[];
}

export const LEVELS: Level[] = [
  { level: 1, title: "Iniciante", minXP: 0, maxXP: 100, icon: Sprout, color: "emerald", perks: [] },
  { level: 2, title: "Aprendiz", minXP: 100, maxXP: 250, icon: Leaf, color: "lime", perks: ["+1 Streak Freeze"] },
  { level: 3, title: "Praticante", minXP: 250, maxXP: 500, icon: User, color: "blue", perks: ["+2 Streak Freezes"] },
  { level: 4, title: "Dedicado", minXP: 500, maxXP: 1000, icon: UserCheck, color: "cyan", perks: ["+3 Streak Freezes"] },
  { level: 5, title: "Consistente", minXP: 1000, maxXP: 2000, icon: Award, color: "violet", perks: ["+5 Streak Freezes", "Badge Especial"] },
  { level: 6, title: "Disciplinado", minXP: 2000, maxXP: 3500, icon: Medal, color: "purple", perks: ["+5 Streak Freezes", "Tema Roxo Escuro"] },
  { level: 7, title: "Mestre", minXP: 3500, maxXP: 6000, icon: Crown, color: "amber", perks: ["Análises Avançadas", "IA Coach Ilimitada"] },
  { level: 8, title: "Lendário", minXP: 6000, maxXP: 10000, icon: Sparkles, color: "yellow", perks: ["Avatar Customizado", "Temas Premium"] },
  { level: 9, title: "Titã", minXP: 10000, maxXP: 20000, icon: Zap, color: "orange", perks: ["Estatísticas Avançadas", "Prioridade no Suporte"] },
  { level: 10, title: "Atômico", minXP: 20000, maxXP: Infinity, icon: Atom, color: "violet", perks: ["Acesso Total", "Badge Lendária"] },
];

export const XP_REWARDS = {
  completeHabit: 10,
  completeStreak7: 50,
  completeStreak30: 200,
  completeStreak90: 500,
  completeAllDaily: 25,
  firstHabitOfDay: 5,
  perfectWeek: 100,
  unlockBadge: 30,
  createHabit: 5,
  completeChallenge: 75,
};

export function calculateLevel(totalXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  percentage: number;
  levelInfo: Level;
} {
  let currentLevel = LEVELS[0];
  
  for (const level of LEVELS) {
    if (totalXP >= level.minXP && totalXP < level.maxXP) {
      currentLevel = level;
      break;
    }
  }
  
  // If XP is beyond max level
  if (totalXP >= LEVELS[LEVELS.length - 1].minXP) {
    currentLevel = LEVELS[LEVELS.length - 1];
  }
  
  const currentLevelXP = totalXP - currentLevel.minXP;
  const nextLevelXP = currentLevel.maxXP - currentLevel.minXP;
  const percentage = currentLevel.maxXP === Infinity ? 100 : Math.min(100, (currentLevelXP / nextLevelXP) * 100);
  
  return {
    level: currentLevel.level,
    currentLevelXP,
    nextLevelXP,
    percentage,
    levelInfo: currentLevel,
  };
}

export function getLevelInfo(level: number): Level {
  return LEVELS.find(l => l.level === level) || LEVELS[0];
}

export function getNextLevelRewards(currentLevel: number): string[] {
  const nextLevel = LEVELS.find(l => l.level === currentLevel + 1);
  return nextLevel?.perks || [];
}

export function checkLevelUp(oldXP: number, newXP: number): LevelUpResult {
  const oldLevelInfo = calculateLevel(oldXP);
  const newLevelInfo = calculateLevel(newXP);
  
  if (newLevelInfo.level > oldLevelInfo.level) {
    return {
      didLevelUp: true,
      newLevel: newLevelInfo.level,
      oldLevel: oldLevelInfo.level,
      rewards: newLevelInfo.levelInfo.perks,
    };
  }
  
  return { didLevelUp: false };
}
