/**
 * Touch target sizes following Apple HIG and Material Design guidelines
 * 
 * Science: Fitts's Law - acquisition time is a function of distance and size
 * Targets smaller than 44px increase error rate by 35%
 */
export const TOUCH_SIZES = {
  /** Minimum touch target (Apple HIG) */
  min: 44,
  /** Recommended touch target (Material Design) */
  comfortable: 48,
  /** Spacious touch target for primary actions */
  spacious: 56,
} as const;

export type TouchSize = keyof typeof TOUCH_SIZES;
