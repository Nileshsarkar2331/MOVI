import { Text as NativeText, TextProps as NativeTextProps, TextStyle } from 'react-native';

import { colors, typography } from '@/theme';

type TextVariant = keyof typeof typography.variants;
type TextTone = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'danger' | 'inverse';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy';

type MoviTextProps = NativeTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  weight?: TextWeight;
  align?: TextStyle['textAlign'];
};

const toneColor: Record<TextTone, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  tertiary: colors.text.tertiary,
  accent: colors.text.accent,
  danger: colors.text.danger,
  inverse: colors.text.inverse
};

const weightMap: Record<TextWeight, string> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800'
};

export function Text({
  variant = 'body',
  tone = 'primary',
  weight,
  align,
  style,
  ...props
}: MoviTextProps) {
  return (
    <NativeText
      {...props}
      style={[
        typography.variants[variant],
        {
          color: toneColor[tone],
          fontFamily: typography.family.regular,
          textAlign: align,
          letterSpacing: 0
        },
        weight ? { fontWeight: weightMap[weight] as TextStyle['fontWeight'] } : undefined,
        style
      ]}
    />
  );
}
