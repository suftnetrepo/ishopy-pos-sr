/* eslint-disable prettier/prettier */
/**
 * typography.ts
 * Kursa font system.
 *
 * Installed fonts:
 *   Poppins-Regular.ttf    → headings, display, onboarding
 *   Poppins-SemiBold.ttf   → subheadings, labels
 *   Poppins-Bold.ttf       → hero numbers, CTAs
 *   Roboto-Regular.ttf     → body text, data, tables (already installed)
 *   Roboto-Bold.ttf        → data emphasis
 *
 * To add Inter (recommended for data):
 *   1. Download Inter-Regular.ttf, Inter-Medium.ttf, Inter-SemiBold.ttf
 *      from https://fonts.google.com/specimen/Inter
 *   2. Add to assets/fonts/
 *   3. Run: npx react-native-asset
 *   4. Uncomment the Inter entries below
 */
import {Platform} from 'react-native';

const ios = (name: string) => name;
const android = (name: string) => name.toLowerCase().replace(/-/g, '_');

const font = (iosName: string, androidName?: string) =>
  Platform.select({
    ios:     iosName,
    android: androidName || android(iosName),
  }) as string;

// ─── Font families ────────────────────────────────────────────────────────────
export const fonts = {
  // Display / headings — Poppins
  displayBold:    font('Poppins-Bold'),
  displaySemi:    font('Poppins-SemiBold'),
  displayRegular: font('Poppins-Regular'),

  // Body / data — Roboto (already installed everywhere)
  bodyRegular: font('Roboto-Regular'),
  bodyMedium:  font('Roboto-Medium',  'Roboto-Medium'),
  bodyBold:    font('Roboto-Bold'),

  // When Inter is installed, replace bodyRegular/bodyMedium with:
  // dataRegular: font('Inter-Regular'),
  // dataMedium:  font('Inter-Medium'),
  // dataSemi:    font('Inter-SemiBold'),
};

// ─── Type scale ───────────────────────────────────────────────────────────────
export const typeScale = {
  // Display — Poppins, large screens
  display3xl: 40,
  display2xl: 32,
  displayXl:  28,
  displayLg:  24,
  displayMd:  20,
  displaySm:  18,

  // Body — Roboto/Inter, UI
  bodyLg:  16,
  bodyMd:  14,
  bodySm:  12,
  bodyXs:  11,
};

// ─── Text styles (pre-composed) ───────────────────────────────────────────────
export const textStyles = {
  // Screen titles
  screenTitle: {
    fontFamily: fonts.displaySemi,
    fontSize:   typeScale.displayMd,
    lineHeight: typeScale.displayMd * 1.3,
  },

  // Section headers
  sectionHeader: {
    fontFamily:    fonts.displaySemi,
    fontSize:      typeScale.bodyXs,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },

  // Card titles
  cardTitle: {
    fontFamily: fonts.displaySemi,
    fontSize:   typeScale.bodyLg,
    lineHeight: typeScale.bodyLg * 1.4,
  },

  // Body text
  body: {
    fontFamily: fonts.bodyRegular,
    fontSize:   typeScale.bodyMd,
    lineHeight: typeScale.bodyMd * 1.5,
  },

  // Data / tabular
  data: {
    fontFamily: fonts.bodyRegular,
    fontSize:   typeScale.bodyMd,
    lineHeight: typeScale.bodyMd * 1.4,
  },

  // Small labels
  label: {
    fontFamily: fonts.bodyRegular,
    fontSize:   typeScale.bodySm,
    lineHeight: typeScale.bodySm * 1.4,
  },

  // Hero number (dashboard stats, prices)
  heroNumber: {
    fontFamily: fonts.displayBold,
    fontSize:   typeScale.displayLg,
    lineHeight: typeScale.displayLg * 1.2,
  },

  // Price
  price: {
    fontFamily: fonts.displaySemi,
    fontSize:   typeScale.displaySm,
    lineHeight: typeScale.displaySm * 1.2,
  },

  // CTA button text
  button: {
    fontFamily: fonts.displaySemi,
    fontSize:   typeScale.bodyLg,
    lineHeight: typeScale.bodyLg * 1.4,
  },
};
