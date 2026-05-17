import { router } from 'expo-router';
import { useEffect } from 'react';
import { useOnboardingStore } from '@/store';
import { StatusBar, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';

import { Text } from '@/components/common';
import { colors, radius, spacing } from '@/theme';

export function SplashScreen() {
  const logoScale = useSharedValue(0.84);
  const logoOpacity = useSharedValue(0);
  const lineWidth = useSharedValue(0);
  const captionOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    logoOpacity.value = withTiming(1, { duration: 520 });
    lineWidth.value = withDelay(
      360,
      withTiming(96, { duration: 620, easing: Easing.out(Easing.cubic) })
    );
    captionOpacity.value = withDelay(620, withTiming(1, { duration: 420 }));

    const timer = setTimeout(() => {
      if (useOnboardingStore.getState().hasCompletedOnboarding) {
        router.replace('/home');
      } else {
        router.replace('/onboarding');
      }
    }, 1900);

    return () => clearTimeout(timer);
  }, [captionOpacity, lineWidth, logoOpacity, logoScale]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }]
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: lineWidth.value
  }));

  const captionStyle = useAnimatedStyle(() => ({
    opacity: captionOpacity.value,
    transform: [{ translateY: (1 - captionOpacity.value) * 10 }]
  }));

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: colors.background.app,
        flex: 1,
        justifyContent: 'center',
        padding: spacing.screenX
      }}
    >
      <StatusBar barStyle="light-content" />
      <View
        style={{
          backgroundColor: colors.brand.primary,
          borderRadius: 180,
          height: 180,
          opacity: 0.08,
          position: 'absolute',
          top: 230,
          width: 180
        }}
      />
      <Animated.View style={[{ alignItems: 'center' }, logoStyle]}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.surface.glassStrong,
            borderColor: colors.border.accent,
            borderRadius: radius.sheet,
            borderWidth: 1,
            height: 112,
            justifyContent: 'center',
            width: 112
          }}
        >
          <Text variant="title1" tone="accent">
            M
          </Text>
        </View>
        <Text variant="display" tone="primary" style={{ marginTop: spacing.lg }}>
          MOVI
        </Text>
        <Animated.View
          style={[
            {
              backgroundColor: colors.brand.primary,
              borderRadius: radius.pill,
              height: 3,
              marginTop: spacing.sm
            },
            lineStyle
          ]}
        />
      </Animated.View>
      <Animated.View style={[{ bottom: 72, position: 'absolute' }, captionStyle]}>
        <Text variant="label" tone="secondary" align="center">
          Shared rides, redesigned.
        </Text>
      </Animated.View>
    </View>
  );
}
