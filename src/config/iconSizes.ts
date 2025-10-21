/**
 * SPRINT 1: Tamanhos de Ícones Padronizados - AUMENTADO
 * 
 * Constantes para garantir consistência visual em toda a aplicação
 */

export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 40,
  '2xl': 56,
} as const;

export type IconSize = keyof typeof ICON_SIZES;
