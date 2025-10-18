import { tokens } from './tokens';

export const theme = {
  // Backgrounds
  backgrounds: {
    primary: tokens.colors.surface.background,
    secondary: tokens.colors.surface.card,
    overlay: tokens.colors.surface.overlay,
    gradient: `linear-gradient(to bottom right, ${tokens.colors.brand[900]}, ${tokens.colors.gray[900]})`,
  },

  // Text styles
  text: {
    default: {
      color: tokens.colors.gray[100],
      fontSize: tokens.fontSizes.base,
      fontWeight: tokens.fontWeights.normal,
    },
    heading: {
      color: tokens.colors.gray[50],
      fontSize: tokens.fontSizes['3xl'],
      fontWeight: tokens.fontWeights.bold,
    },
    subheading: {
      color: tokens.colors.gray[300],
      fontSize: tokens.fontSizes.xl,
      fontWeight: tokens.fontWeights.medium,
    },
    small: {
      color: tokens.colors.gray[400],
      fontSize: tokens.fontSizes.sm,
      fontWeight: tokens.fontWeights.normal,
    },
  },

  // Component variants
  components: {
    // Button variants
    button: {
      primary: {
        background: `linear-gradient(to right, ${tokens.colors.brand[600]}, ${tokens.colors.brand[700]})`,
        color: tokens.colors.gray[50],
        hover: {
          background: `linear-gradient(to right, ${tokens.colors.brand[700]}, ${tokens.colors.brand[800]})`,
          transform: 'translateY(-1px)',
        },
      },
      secondary: {
        background: tokens.colors.gray[800],
        color: tokens.colors.gray[100],
        hover: {
          background: tokens.colors.gray[700],
        },
      },
      ghost: {
        background: 'transparent',
        color: tokens.colors.gray[300],
        hover: {
          background: tokens.colors.gray[800],
        },
      },
    },

    // Card variants
    card: {
      default: {
        background: tokens.colors.surface.card,
        borderRadius: tokens.borderRadius.xl,
        shadow: tokens.shadows.lg,
      },
      highlight: {
        background: `linear-gradient(135deg, ${tokens.colors.brand[900]}, ${tokens.colors.gray[800]})`,
        borderRadius: tokens.borderRadius.xl,
        shadow: `${tokens.shadows.xl}, 0 0 30px ${tokens.colors.brand[900]}40`,
      },
    },

    // Input variants
    input: {
      default: {
        background: tokens.colors.gray[800],
        border: `1px solid ${tokens.colors.gray[700]}`,
        borderRadius: tokens.borderRadius.lg,
        color: tokens.colors.gray[100],
        placeholder: tokens.colors.gray[500],
        focus: {
          borderColor: tokens.colors.brand[500],
          shadow: `0 0 0 2px ${tokens.colors.brand[500]}40`,
        },
      },
    },
  },

  // Common effects
  effects: {
    glassmorphism: {
      background: 'rgba(30, 41, 59, 0.4)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${tokens.colors.gray[700]}20`,
    },
    hover: {
      transform: 'scale(1.02)',
      transition: tokens.transitions.fast,
    },
    press: {
      transform: 'scale(0.98)',
    },
  },
} as const;

// Tipos úteis para usar com o tema
export type ThemeTokens = typeof theme;
export type ComponentVariant = keyof typeof theme.components;
export type ButtonVariant = keyof typeof theme.components.button;
export type CardVariant = keyof typeof theme.components.card;