/**
 * SPRINT 1: Tamanhos de Ícones Padronizados
 * 
 * Constantes para garantir consistência visual em toda a aplicação
 */

export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export type IconSize = keyof typeof ICON_SIZES;
