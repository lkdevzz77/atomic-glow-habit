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
  { level: 1, title: "Próton Iniciante", minXP: 0, maxXP: 200, icon: Sprout, color: "emerald", perks: [] },
  { level: 2, title: "Elétron Curioso", minXP: 200, maxXP: 500, icon: Leaf, color: "lime", perks: ["Estatísticas básicas desbloqueadas"] },
  { level: 3, title: "Átomo Formador", minXP: 500, maxXP: 900, icon: User, color: "blue", perks: ["Badges especiais disponíveis"] },
  { level: 4, title: "Molécula Ativa", minXP: 900, maxXP: 1500, icon: UserCheck, color: "cyan", perks: ["Gráficos de progresso avançados"] },
  { level: 5, title: "Composto Estável", minXP: 1500, maxXP: 2400, icon: Award, color: "violet", perks: ["IA Coach personalizado", "Análises semanais"] },
  { level: 6, title: "Cristal Organizado", minXP: 2400, maxXP: 3600, icon: Medal, color: "purple", perks: ["Relatórios mensais", "Insights avançados"] },
  { level: 7, title: "Reator Controlado", minXP: 3600, maxXP: 5200, icon: Crown, color: "amber", perks: ["Análises preditivas", "Sugestões personalizadas"] },
  { level: 8, title: "Fusão Nuclear", minXP: 5200, maxXP: 7500, icon: Sparkles, color: "yellow", perks: ["Avatar customizado", "Exportação de dados"] },
  { level: 9, title: "Supernova Radiante", minXP: 7500, maxXP: 10500, icon: Zap, color: "orange", perks: ["Todas estatísticas desbloqueadas", "Suporte prioritário"] },
  { level: 10, title: "Estrela de Nêutrons", minXP: 10500, maxXP: Infinity, icon: Atom, color: "violet", perks: ["Maestria atômica completa", "Acesso total ao sistema"] },
];

export const XP_REWARDS = {
  completeHabit: 15,
  firstHabitOfDay: 10,
  completeAllDaily: 30,
  perfectDay: 50,
  perfectWeek: 200,
  weeklyStreak5: 100,
  weeklyStreak12: 500,
  createFirstHabit: 20,
  completeOnboarding: 50,
  setupIdentity: 30,
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
  if (level >= 10) return "Estrela de Nêutrons";
  if (level >= 9) return "Supernova Radiante";
  if (level >= 8) return "Fusão Nuclear";
  if (level >= 7) return "Reator Controlado";
  if (level >= 6) return "Cristal Organizado";
  if (level >= 5) return "Composto Estável";
  if (level >= 4) return "Molécula Ativa";
  if (level >= 3) return "Átomo Formador";
  if (level >= 2) return "Elétron Curioso";
  return "Próton Iniciante";
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
