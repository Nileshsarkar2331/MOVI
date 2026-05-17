import { PropsWithChildren } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

type GlassCardProps = PropsWithChildren<
  ViewProps & {
    elevated?: boolean;
    style?: StyleProp<ViewStyle>;
  }
>;

export function GlassCard({ children, elevated = false, style, ...props }: GlassCardProps) {
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: elevated ? colors.surface.glassStrong : colors.surface.glass,
          borderColor: colors.border.subtle,
          borderRadius: radius.panel,
          borderWidth: 1,
          padding: spacing.lg
        },
        elevated ? shadows.panel : shadows.soft,
        style
      ]}
    >
      {children}
    </View>
  );
}
