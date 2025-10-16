import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, Habit, Completion, Badge, OnboardingData } from "@/types/habit";

interface AppContextType {
  user: User | null;
  habits: Habit[];
  completions: Completion[];
  badges: Badge[];
  onboardingData: Partial<OnboardingData>;
  
  setUser: (user: User) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: number, updates: Partial<Habit>) => void;
  deleteHabit: (id: number) => void;
  completeHabit: (habitId: number, value: number) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  unlockBadge: (badgeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

const initialBadges: Badge[] = [
  {
    id: "seed",
    name: "A Semente",
    icon: "🌱",
    description: "Complete um hábito por 3 dias",
    unlocked: false,
    progress: 0,
    target: 3,
  },
  {
    id: "week",
    name: "Semana Forte",
    icon: "🔥",
    description: "7 dias consecutivos",
    unlocked: false,
    progress: 0,
    target: 7,
  },
  {
    id: "identity",
    name: "Nova Identidade",
    icon: "⚛️",
    description: "21 dias (formação de hábito)",
    unlocked: false,
    progress: 0,
    target: 21,
  },
  {
    id: "transform",
    name: "Transformação",
    icon: "🦋",
    description: "90 dias de consistência",
    unlocked: false,
    progress: 0,
    target: 90,
  },
  {
    id: "stacker",
    name: "Empilhador",
    icon: "🏗️",
    description: "Use empilhamento 10 vezes",
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: "resilient",
    name: "Resiliente",
    icon: "💪",
    description: "Volte após quebrar streak",
    unlocked: false,
    progress: 0,
    target: 1,
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});

  const addHabit = (habit: Habit) => {
    setHabits((prev) => [...prev, habit]);
  };

  const updateHabit = (id: number, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
  };

  const deleteHabit = (id: number) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const completeHabit = (habitId: number, value: number) => {
    const now = new Date().toISOString();
    const habit = habits.find((h) => h.id === habitId);
    
    if (!habit) return;

    // Add completion
    const newCompletion: Completion = {
      id: Date.now(),
      habitId,
      completedAt: now,
      value,
    };
    setCompletions((prev) => [...prev, newCompletion]);

    // Update habit
    const newStreak = habit.streak + 1;
    updateHabit(habitId, {
      status: "completed",
      lastCompleted: now,
      streak: newStreak,
      longestStreak: Math.max(habit.longestStreak, newStreak),
      totalCompletions: habit.totalCompletions + 1,
      goal: { ...habit.goal, current: value },
    });

    // Update user points
    if (user) {
      setUser({ ...user, points: user.points + 10 });
    }

    // Check badges
    checkAndUnlockBadges(newStreak);
  };

  const checkAndUnlockBadges = (currentStreak: number) => {
    setBadges((prev) =>
      prev.map((badge) => {
        if (badge.unlocked) return badge;
        
        if (badge.id === "seed" && currentStreak >= 3) {
          return { ...badge, unlocked: true, progress: 3, unlockedAt: new Date().toISOString() };
        }
        if (badge.id === "week" && currentStreak >= 7) {
          return { ...badge, unlocked: true, progress: 7, unlockedAt: new Date().toISOString() };
        }
        if (badge.id === "identity" && currentStreak >= 21) {
          return { ...badge, unlocked: true, progress: 21, unlockedAt: new Date().toISOString() };
        }
        if (badge.id === "transform" && currentStreak >= 90) {
          return { ...badge, unlocked: true, progress: 90, unlockedAt: new Date().toISOString() };
        }
        
        return { ...badge, progress: Math.min(currentStreak, badge.target) };
      })
    );
  };

  const unlockBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) =>
        b.id === badgeId
          ? { ...b, unlocked: true, progress: b.target, unlockedAt: new Date().toISOString() }
          : b
      )
    );
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        habits,
        completions,
        badges,
        onboardingData,
        setUser,
        addHabit,
        updateHabit,
        deleteHabit,
        completeHabit,
        updateOnboardingData,
        unlockBadge,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
