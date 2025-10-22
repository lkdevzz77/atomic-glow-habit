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
  { level: 1, title: "Semente", minXP: 0, maxXP: 200, icon: Sprout, color: "emerald", perks: [] },
  { level: 2, title: "Broto", minXP: 200, maxXP: 500, icon: Leaf, color: "lime", perks: ["+1 Streak Freeze"] },
  { level: 3, title: "Aprendiz", minXP: 500, maxXP: 900, icon: User, color: "blue", perks: ["+2 Streak Freezes"] },
  { level: 4, title: "Praticante", minXP: 900, maxXP: 1500, icon: UserCheck, color: "cyan", perks: ["+3 Streak Freezes"] },
  { level: 5, title: "Dedicado", minXP: 1500, maxXP: 2400, icon: Award, color: "violet", perks: ["+5 Streak Freezes", "Badge Especial"] },
  { level: 6, title: "Consistente", minXP: 2400, maxXP: 3600, icon: Medal, color: "purple", perks: ["+5 Streak Freezes", "Tema Roxo Escuro"] },
  { level: 7, title: "Disciplinado", minXP: 3600, maxXP: 5200, icon: Crown, color: "amber", perks: ["Análises Avançadas", "IA Coach Ilimitada"] },
  { level: 8, title: "Mestre", minXP: 5200, maxXP: 7500, icon: Sparkles, color: "yellow", perks: ["Avatar Customizado", "Temas Premium"] },
  { level: 9, title: "Lendário", minXP: 7500, maxXP: 10500, icon: Zap, color: "orange", perks: ["Estatísticas Avançadas", "Prioridade no Suporte"] },
  { level: 10, title: "Atômico", minXP: 10500, maxXP: 15000, icon: Atom, color: "violet", perks: ["Acesso Total", "Badge Lendária"] },
  { level: 11, title: "Titã", minXP: 15000, maxXP: 20000, icon: Zap, color: "orange", perks: ["Titã da Disciplina", "Tudo Desbloqueado"] },
  { level: 12, title: "Imortal", minXP: 20000, maxXP: Infinity, icon: Atom, color: "violet", perks: ["Status Imortal", "Maestria Absoluta"] },
];

export const XP_REWARDS = {
  // Ações básicas diárias
  completeHabit: 15,
  firstHabitOfDay: 10,
  completeAllDaily: 30,
  perfectDay: 50,
  
  // Streaks (progressão graduada)
  streak3Days: 25,
  streak7Days: 75,
  streak14Days: 150,
  streak21Days: 250,
  streak30Days: 400,
  streak60Days: 800,
  streak90Days: 1500,
  streak180Days: 3000,
  streak365Days: 7500,
  
  // Performance semanal
  perfectWeek: 200,
  weeklyStreak5: 100,
  weeklyStreak12: 500,
  
  // Conquistas e badges
  unlockBronzeBadge: 50,
  unlockSilverBadge: 150,
  unlockGoldBadge: 400,
  unlockLegendaryBadge: 1000,
  
  // Ações de setup
  createFirstHabit: 20,
  completeOnboarding: 50,
  setupIdentity: 30,
  
  // Maestria
  habitMastery100: 500,
  habitMastery365: 2000,
  allHabitsStreak30: 800,
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

export function getLevelTitle(level: number): string {
  if (level >= 10) return "Mestre Atômico";
  if (level >= 8) return "Artífice de Hábitos";
  if (level >= 6) return "Construtor Dedicado";
  if (level >= 4) return "Aprendiz Persistente";
  if (level >= 2) return "Iniciante Comprometido";
  return "Novato em Ascensão";
}

export function getXPForLevel(level: number): number {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 3500, 6000, 10000, 20000];
  if (level <= 1) return 0;
  if (level > 10) return thresholds[9];
  return thresholds[level - 1];
}

export function getAllLevels(): number[] {
  return LEVELS.map(l => l.level);
}
