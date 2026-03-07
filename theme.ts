'use client';

import { createTheme, MantineColorsTuple, rem } from '@mantine/core';
import { brandColors, accentColors, positiveColors, negativeColors } from './lib/design-tokens';

export const theme = createTheme({
  defaultColorScheme: 'dark',

  colors: {
    brand: brandColors as unknown as MantineColorsTuple,
    accent: accentColors as unknown as MantineColorsTuple,
    positive: positiveColors as unknown as MantineColorsTuple,
    negative: negativeColors as unknown as MantineColorsTuple,
  },

  primaryColor: 'brand',
  primaryShade: 5,

  fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  fontFamilyMonospace:
    'var(--font-jetbrains), JetBrains Mono, Fira Code, Consolas, monospace',

  fontSizes: {
    xs: rem(11),
    sm: rem(13),
    md: rem(14),
    lg: rem(16),
    xl: rem(20),
  },

  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24),
  },

  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(6),
    lg: rem(8),
  },

  headings: {
    fontWeight: '600',
    sizes: {
      h1: { fontSize: rem(24) },
      h2: { fontSize: rem(20) },
      h3: { fontSize: rem(16) },
    },
  },

  components: {
    AppShell: {
      styles: {
        main: {
          backgroundColor: 'var(--as-surface-secondary)',
        },
      },
    },

    Paper: {
      defaultProps: {
        radius: 'sm',
      },
      styles: {
        root: {
          background:
            'linear-gradient(180deg, var(--as-surface-secondary) 0%, var(--as-surface-tertiary) 100%)',
          border: '1px solid var(--as-border)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        },
      },
    },

    Card: {
      defaultProps: {
        radius: 'sm',
        padding: 'sm',
      },
      styles: {
        root: {
          background:
            'linear-gradient(180deg, var(--as-surface-secondary) 0%, var(--as-surface-tertiary) 100%)',
          border: '1px solid var(--as-border)',
          transition:
            'transform var(--as-motion-fast) var(--as-ease-standard), border-color var(--as-motion-fast) var(--as-ease-standard)',
          '&:hover': {
            borderColor: 'var(--as-border-hover)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    Select: {
      defaultProps: {
        size: 'sm',
      },
      styles: {
        input: {
          backgroundColor: 'var(--as-surface-secondary)',
          borderColor: 'var(--as-border)',
          '&:focus': {
            borderColor: 'var(--as-border-active)',
            boxShadow: '0 0 0 2px var(--as-focus-ring)',
          },
        },
        dropdown: {
          backgroundColor: 'var(--as-surface-elevated)',
          borderColor: 'var(--as-border)',
        },
      },
    },

    TextInput: {
      defaultProps: {
        size: 'sm',
      },
      styles: {
        input: {
          backgroundColor: 'var(--as-surface-secondary)',
          borderColor: 'var(--as-border)',
          '&:focus': {
            borderColor: 'var(--as-border-active)',
            boxShadow: '0 0 0 2px var(--as-focus-ring)',
          },
        },
      },
    },

    Tabs: {
      defaultProps: {
        variant: 'pills',
      },
      styles: {
        tab: {
          fontWeight: 500,
          fontSize: 'var(--mantine-font-size-sm)',
          transition:
            'background-color var(--as-motion-fast) var(--as-ease-standard), color var(--as-motion-fast) var(--as-ease-standard)',
          '&[data-active]': {
            backgroundColor: 'var(--as-surface-elevated)',
            color: 'var(--as-amber)',
          },
        },
        list: {
          gap: rem(4),
        },
      },
    },

    Button: {
      defaultProps: {
        size: 'sm',
        variant: 'subtle',
      },
      styles: {
        root: {
          fontWeight: 500,
        },
      },
    },

    Table: {
      styles: {
        table: {
          fontSize: 'var(--mantine-font-size-sm)',
          fontVariantNumeric: 'tabular-nums',
        },
        th: {
          fontWeight: 600,
          borderBottomColor: 'var(--as-border)',
        },
        td: {
          borderBottomColor: 'var(--as-border)',
          fontFamily: 'var(--mantine-font-family-monospace)',
        },
      },
    },

    Tooltip: {
      defaultProps: {
        withArrow: true,
      },
      styles: {
        tooltip: {
          backgroundColor: 'var(--as-surface-elevated)',
          border: '1px solid var(--as-border)',
          fontSize: 'var(--mantine-font-size-xs)',
        },
      },
    },

    SegmentedControl: {
      styles: {
        root: {
          backgroundColor: 'var(--as-surface-primary)',
        },
      },
    },

    Loader: {
      defaultProps: {
        color: 'brand',
      },
    },
  },
});
