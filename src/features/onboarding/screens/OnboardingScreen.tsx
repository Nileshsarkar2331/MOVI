import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { StatusBar, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { Button, Screen, Text } from '@/components/common';
import { MobilityVisual } from '@/features/onboarding/components/MobilityVisual';
import { onboardingSlides } from '@/features/onboarding/data/onboardingSlides';
import { useOnboardingStore } from '@/store';
import { colors, radius, spacing } from '@/theme';

export function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const transition = useSharedValue(1);
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);
  const activeSlide = onboardingSlides[activeIndex];
  const isLast = activeIndex === onboardingSlides.length - 1;

  const progressItems = useMemo(() => onboardingSlides.map((slide) => slide.id), []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: transition.value,
    transform: [{ translateY: (1 - transition.value) * 18 }]
  }));

  const goToSlide = (nextIndex: number) => {
    transition.value = withTiming(0, { duration: 120, easing: Easing.out(Easing.cubic) }, () => {
      transition.value = withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) });
    });
    setActiveIndex(nextIndex);
  };

  const handlePrimaryPress = () => {
    if (hasCompletedOnboarding) {
      resetOnboarding();
      goToSlide(0);
      return;
    }

    if (!isLast) {
      goToSlide(activeIndex + 1);
      return;
    }

    completeOnboarding();
    router.replace('/home');
  };

  return (
    <Screen padded={false}>
      <StatusBar barStyle="light-content" />
      <View
        style={{
          backgroundColor: colors.brand.secondary,
          borderRadius: 160,
          height: 190,
          opacity: 0.08,
          position: 'absolute',
          right: -80,
          top: 84,
          width: 190
        }}
      />
      <View
        style={{
          backgroundColor: colors.brand.primary,
          borderRadius: 190,
          bottom: 120,
          height: 220,
          left: -120,
          opacity: 0.07,
          position: 'absolute',
          width: 220
        }}
      />

      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          paddingBottom: spacing.xl,
          paddingHorizontal: spacing.screenX,
          paddingTop: spacing.md
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <View style={{ flexDirection: 'row', gap: spacing.xs }}>
            {progressItems.map((item, index) => (
              <View
                key={item}
                style={{
                  backgroundColor:
                    index === activeIndex ? colors.brand.primary : colors.border.strong,
                  borderRadius: radius.pill,
                  height: 4,
                  width: index === activeIndex ? 28 : 8
                }}
              />
            ))}
          </View>

          <View
            style={{
              alignItems: 'center',
              borderColor: colors.border.subtle,
              borderRadius: radius.pill,
              borderWidth: 1,
              flexDirection: 'row',
              gap: spacing.xs,
              paddingHorizontal: spacing.s,
              paddingVertical: spacing.sm
            }}
          >
            <MaterialCommunityIcons color={colors.brand.primary} name="cash" size={16} />
            <Text variant="caption" tone="secondary">
              Cash first
            </Text>
          </View>
        </View>

        <Animated.View style={contentStyle}>
          <MobilityVisual variant={activeSlide.visual} />
          <View style={{ marginTop: spacing.lg }}>
            <Text variant="micro" tone="accent">
              {activeSlide.eyebrow.toUpperCase()}
            </Text>
            <Text variant="title1" tone="primary" style={{ marginTop: spacing.sm }}>
              {activeSlide.title}
            </Text>
            <Text variant="body" tone="secondary" style={{ marginTop: spacing.md }}>
              {activeSlide.body}
            </Text>
          </View>
        </Animated.View>

        <View style={{ gap: spacing.md }}>
          {hasCompletedOnboarding ? (
            <View
              style={{
                alignItems: 'center',
                borderColor: colors.border.accent,
                borderRadius: radius.panel,
                borderWidth: 1,
                padding: spacing.md
              }}
            >
              <Text variant="label" tone="accent">
                MOVI is ready for the next build.
              </Text>
            </View>
          ) : null}

          {hasCompletedOnboarding ? (
            // After onboarding: single full-width replay button
            <Button
              fullWidth
              size="lg"
              title="Replay onboarding"
              onPress={handlePrimaryPress}
            />
          ) : (
            // Onboarding slides: Continue / Enter MOVI (left ghost) + Skip (right ghost) side by side
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                size="md"
                title={isLast ? 'Enter MOVI' : 'Continue'}
                variant="ghost"
                onPress={handlePrimaryPress}
              />
              <Button
                size="md"
                title="Skip"
                variant="ghost"
                onPress={() => {
                  completeOnboarding();
                  router.replace('/home');
                }}
              />
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}
