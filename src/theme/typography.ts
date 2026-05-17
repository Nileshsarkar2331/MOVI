export const typography = {
  family: {
    regular: 'System',
    medium: 'System',
    bold: 'System'
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800'
  },
  variants: {
    display: {
      fontSize: 36,
      lineHeight: 42,
      fontWeight: '800'
    },
    title1: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700'
    },
    title2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700'
    },
    subtitle: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600'
    },
    body: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '400'
    },
    bodyMedium: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '600'
    },
    label: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600'
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500'
    },
    micro: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '700'
    }
  }
} as const;
