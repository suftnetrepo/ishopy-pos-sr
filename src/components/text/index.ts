import { styled, StyledText, StyledTextProps } from 'fluent-styles'

/**
 * POS Typography System
 *
 * Central Text component for all app typography.
 * Uses Poppins custom fonts already available in the app.
 */

type TextVariant =
  | 'hero'
  | 'display'
  | 'header'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodySmall'
  | 'label'
  | 'subLabel'
  | 'caption'
  | 'button'
  | 'metric'
  | 'metricSmall'
  | 'overline'

type AppTextProps = StyledTextProps & {
  variant?: TextVariant
}

const resolveFontFamily = (weight?: string | number) => {
  const value = String(weight || '400')

  if (value === '800') return 'Poppins-Bold'
  if (value === '700' || value === 'bold') return 'Poppins-Bold'
  if (value === '600') return 'Poppins-SemiBold'
  if (value === '500') return 'Poppins-SemiBold'

  return 'Poppins-Regular'
}

const TEXT_VARIANTS: Record<TextVariant, any> = {
  hero: {
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 64,
    letterSpacing: -1,
  },
  display: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  metric: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
  },
  metricSmall: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  overline: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
}

const Text = styled<AppTextProps>(StyledText, {
  base: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  variants: {
    variant: (selected: string, options: AppTextProps) => {
      const selectedVariant = (selected || 'body') as TextVariant
      const variantStyle = TEXT_VARIANTS[selectedVariant] || TEXT_VARIANTS.body

      const explicitWeight = options.fontWeight
      const resolvedWeight = String(explicitWeight || variantStyle.fontWeight || '400')

      return {
        ...variantStyle,
        fontFamily: resolveFontFamily(resolvedWeight),
      }
    },

    fontWeight: (selected: string, options: AppTextProps) => {
      const activeVariant = (options.variant as TextVariant) || 'body'
      const variantStyle = TEXT_VARIANTS[activeVariant] || TEXT_VARIANTS.body
      const weight = String(selected || variantStyle.fontWeight || '400')

      return {
        fontWeight: weight as any,
        fontFamily: resolveFontFamily(weight),
      }
    },

    fontFamily: (selected: string) => {
      if (!selected) return {}
      return { fontFamily: selected }
    },
  },
})

export { Text }
export type { AppTextProps, TextVariant }