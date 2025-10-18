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

import { type IconName } from '@/config/icon-map';

export interface Habit {
  id: number;
  user_id: string;
  title: string;
  icon: string;
  
  // Lei #1: Torne Óbvio
  when_time: string;
  where_location: string;
  trigger_activity?: string | null;
  
  // Lei #2: Torne Atraente
  temptation_bundle?: string | null;
  environment_prep?: string | null;
  social_reinforcement?: string | null;
  
  // Lei #3: Torne Fácil
  goal_current?: number;
  goal_target: number;
  goal_unit: string;
  two_minute_rule?: any | null;
  current_phase: number;
  
  // Lei #4: Torne Satisfatório
  reward_milestone?: any | null;
  tracking_preferences?: any | null;
  sound_enabled?: boolean | null;
  vibration_enabled?: boolean | null;
  
  streak: number;
  longest_streak: number;
  total_completions: number;
  status: string;
  last_completed?: string | null;
  created_at: string;
  updated_at: string;
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
