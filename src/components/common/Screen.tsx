import { PropsWithChildren } from 'react';
import { ScrollView, ScrollViewProps, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  padded?: boolean;
}> &
  ViewProps &
  ScrollViewProps;

export function Screen({ children, scroll = false, padded = true, style, ...props }: ScreenProps) {
  const contentStyle = [
    {
      flex: 1,
      backgroundColor: colors.background.app,
      paddingHorizontal: padded ? spacing.screenX : 0,
      paddingVertical: padded ? spacing.screenY : 0
    },
    style
  ];

  if (scroll) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.app }}>
        <ScrollView
          {...props}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={contentStyle}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.app }}>
      <View {...props} style={contentStyle}>
        {children}
      </View>
    </SafeAreaView>
  );
}
