import confetti from 'canvas-confetti';

/**
 * Trigger a unified confetti animation for habit completion
 */
export const triggerHabitConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE']
  });
};

/**
 * Trigger a mini confetti animation (used in Kanban view)
 */
export const triggerMiniConfetti = () => {
  confetti({
    particleCount: 30,
    angle: 90,
    spread: 45,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#8B5CF6', '#A78BFA', '#C4B5FD']
  });
};
