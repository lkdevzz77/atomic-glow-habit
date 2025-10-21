/**
 * Haptic feedback patterns for mobile interactions
 * 
 * Psychology: Multimodal feedback (visual + tactile) increases perceived control by 40%
 */

export const HAPTIC_PATTERNS = {
  /** Subtle tap feedback */
  light: [10],
  /** Medium action confirmed */
  medium: [20],
  /** Success celebration pattern */
  success: [10, 50, 10],
  /** Warning/alert pattern */
  warning: [30, 20, 30],
  /** Heavy impact */
  heavy: [40],
} as const;

export type HapticPattern = keyof typeof HAPTIC_PATTERNS;

/**
 * Trigger haptic feedback if supported by device
 */
export function triggerHaptic(pattern: HapticPattern = 'medium') {
  if ('vibrate' in navigator) {
    navigator.vibrate(HAPTIC_PATTERNS[pattern]);
  }
}

/**
 * Check if haptic feedback is supported
 */
export function isHapticsSupported(): boolean {
  return 'vibrate' in navigator;
}
