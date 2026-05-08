/* eslint-disable prettier/prettier */
/**
 * tokens.ts
 * Kursa design tokens — light and dark.
 * Import from here, never hardcode hex values in components.
 */

// ─── Kursa palette ────────────────────────────────────────────────────────────
const palette = {
  // Brand amber
  amber50:  '#fffbeb',
  amber100: '#fef3c7',
  amber200: '#fde68a',
  amber300: '#fcd34d',
  amber400: '#fbbf24',
  amber500: '#f59e0b',
  amber600: '#d97706',
  amber700: '#b45309',
  amber800: '#92400e',
  amber900: '#78350f',

  // Neutrals
  white:   '#ffffff',
  gray50:  '#fafafa',
  gray100: '#f4f4f5',
  gray200: '#e4e4e7',
  gray300: '#d4d4d8',
  gray400: '#a1a1aa',
  gray500: '#71717a',
  gray600: '#52525b',
  gray700: '#3f3f46',
  gray800: '#27272a',
  gray900: '#18181b',
  gray950: '#09090b',
  black:   '#000000',

  // Semantic
  green50:  '#f0fdf4',
  green100: '#dcfce7',
  green500: '#22c55e',
  green600: '#16a34a',
  green700: '#15803d',

  red50:    '#fff5f5',
  red100:   '#fee2e2',
  red400:   '#f87171',
  red500:   '#ef4444',
  red600:   '#dc2626',

  blue50:   '#eff6ff',
  blue100:  '#dbeafe',
  blue500:  '#3b82f6',
  blue600:  '#2563eb',
  blue700:  '#1d4ed8',

  purple50:  '#faf5ff',
  purple100: '#f3e8ff',
  purple600: '#9333ea',
  purple700: '#7c3aed',

  // Hero dark
  hero: '#1c1917',
};

// ─── Light tokens ─────────────────────────────────────────────────────────────
export const light = {
  // Backgrounds
  bgPage:   palette.gray100,
  bgCard:   palette.white,
  bgHero:   palette.hero,
  bgInput:  palette.gray50,  // Slightly darker than bgCard for input distinction
  bgModal:  palette.white,

  // Text
  textPrimary:   palette.gray900,
  textSecondary: palette.gray500,
  textMuted:     palette.gray400,
  textInverse:   palette.white,
  textOnAmber:   palette.hero,

  // Brand
  brandPrimary:     palette.amber500,
  brandPrimaryDark: palette.amber600,
  brandPrimaryBg:   palette.amber50,
  brandPrimaryText: palette.amber700,

  // Borders
  borderDefault: palette.gray200,
  borderStrong:  palette.gray300,
  borderFocus:   palette.amber500,

  // Status
  successColor: palette.green600,
  successBg:    palette.green50,
  successBorder:palette.green100,
  warningColor: palette.amber600,
  warningBg:    palette.amber50,
  dangerColor:  palette.red500,
  dangerBg:     palette.red50,
  infoBg:       palette.blue50,
  infoColor:    palette.blue700,

  // Sidebar
  sidebarBg:           palette.white,
  sidebarActiveBg:     palette.amber500,
  sidebarActiveText:   palette.hero,
  sidebarInactiveText: palette.gray500,

  // Table/card left borders
  borderOccupied:  palette.green500,
  borderAvailable: palette.gray200,
  borderInactive:  palette.red400,
};

// ─── Dark tokens ──────────────────────────────────────────────────────────────
export const dark = {
  // Backgrounds
  bgPage:   palette.gray950,
  bgCard:   palette.gray900,
  bgHero:   palette.black,
  bgInput:  palette.gray800,
  bgModal:  palette.gray900,

  // Text
  textPrimary:   palette.gray50,
  textSecondary: palette.gray400,
  textMuted:     palette.gray600,
  textInverse:   palette.white,    // always white — used on dark/coloured backgrounds
  textOnAmber:   palette.hero,

  // Brand — same amber, works on dark too
  brandPrimary:     palette.amber500,
  brandPrimaryDark: palette.amber400,
  brandPrimaryBg:   '#2a1f00',
  brandPrimaryText: palette.amber300,

  // Borders
  borderDefault: palette.gray800,
  borderStrong:  palette.gray700,
  borderFocus:   palette.amber500,

  // Status
  successColor: palette.green500,
  successBg:    '#052e16',
  successBorder:'#14532d',
  warningColor: palette.amber400,
  warningBg:    '#1c1400',
  dangerColor:  palette.red400,
  dangerBg:     '#1f0000',
  infoBg:       '#0c1a2e',
  infoColor:    palette.blue500,

  // Sidebar
  sidebarBg:           palette.gray900,
  sidebarActiveBg:     palette.amber500,
  sidebarActiveText:   palette.hero,
  sidebarInactiveText: palette.gray500,

  // Table/card left borders
  borderOccupied:  palette.green500,
  borderAvailable: palette.gray700,
  borderInactive:  palette.red500,
};

export type ThemeTokens = typeof light;
export {palette};
