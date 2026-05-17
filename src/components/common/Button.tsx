import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

import { Text } from '@/components/common/Text';
import { colors, radius, shadows, spacing } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary
  },
  secondary: {
    backgroundColor: colors.surface.raised,
    borderColor: colors.border.strong
  },
  ghost: {
    backgroundColor: colors.base.transparent,
    borderColor: colors.border.subtle
  }
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: {
    minHeight: 40,
    paddingHorizontal: spacing.md
  },
  md: {
    minHeight: 48,
    paddingHorizontal: spacing.ml
  },
  lg: {
    minHeight: 56,
    paddingHorizontal: spacing.lg
  }
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      {...props}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius.pill,
          borderWidth: 1,
          opacity: disabled ? 0.48 : pressed ? 0.82 : 1,
          width: fullWidth ? '100%' : undefined
        },
        variantStyles[variant],
        sizeStyles[size],
        isPrimary && !disabled ? shadows.glow : undefined,
        style
      ]}
    >
      <Text variant="label" tone={isPrimary ? 'inverse' : 'primary'}>
        {title}
      </Text>
    </Pressable>
  );
}
