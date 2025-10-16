export interface User {
  name: string;
  desiredIdentity: string;
  specificChange: string;
  pastAttempts: string;
  whatWorked: string;
  whatDidntWork: string;
  morningRoutine: string;
  workStart: string;
  availableTime: string;
  obstacles: string[];
  createdAt: string;
  points: number;
  longestStreak: number;
}

export interface Goal {
  current: number;
  target: number;
  unit: string;
}

export interface RuleOfTwo {
  phase1: { days: number; target: number };
  phase2: { days: number; target: number };
  phase3: { days: number | null; target: number };
}

export interface Habit {
  id: number;
  title: string;
  icon: string;
  color: string;
  goal: Goal;
  
  // Lei #1: Torne Óbvio
  when: string;
  where: string;
  trigger: string;
  
  // Lei #2: Torne Atraente
  temptationBundle?: string;
  environmentPrep?: string;
  socialReinforcement?: string;
  
  // Lei #3: Torne Fácil
  twoMinuteVersion: string;
  ruleOfTwo: RuleOfTwo;
  currentPhase: number;
  
  // Lei #4: Torne Satisfatório
  rewardMilestone: { days: number; reward: string };
  
  streak: number;
  longestStreak: number;
  totalCompletions: number;
  status: "pending" | "completed" | "skipped";
  lastCompleted: string | null;
  createdAt: string;
}

export interface Completion {
  id: number;
  habitId: number;
  completedAt: string;
  value: number;
  notes?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progress: number;
  target: number;
  unlockedAt?: string;
}

export interface OnboardingData {
  name: string;
  desiredIdentity: string;
  specificChange: string;
  pastAttempts: string;
  whatWorked: string;
  whatDidntWork: string;
  firstThingMorning: string;
  typicalMorning: string;
  workStart: string;
  
  // Primeiro hábito
  habitType: string;
  habitCustom?: string;
  
  // Lei #1
  when: string;
  customTime?: string;
  where: string;
  triggerActivity: string;
  
  // Lei #2
  temptationBundle?: string;
  environmentPrep?: string;
  socialReinforcement?: string;
  
  // Lei #3
  initialGoal: number;
  acceptedRecommendation: boolean;
  frictionReduction?: string;
  
  // Lei #4
  trackingSystem: string[];
  enableSound: boolean;
  enableVibration: boolean;
  realReward: string;
}
