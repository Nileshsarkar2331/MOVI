import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useOnboardingStore } from '@/store';
import { StatusBar, View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';

import { Text } from '@/components/common';
import { colors, radius, spacing } from '@/theme';



// --- Auto-rickshaw circular path config ---
const ORBIT_RADIUS = 110;          // radius of the circle the auto follows
const ORBIT_DURATION = 2800;       // ms for one full loop
const AUTO_SIZE = 38;              // size of the auto icon container

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PATH_WIDTH = SCREEN_WIDTH / 2 + AUTO_SIZE;

export function SplashScreen() {
  const hasNavigated = useRef(false);

  // --- Logo animations ---
  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const lineWidth = useSharedValue(0);
  const captionOpacity = useSharedValue(0);

  // --- Auto orbit animation (0 → 1 = one full loop) ---
  const orbitProgress = useSharedValue(0);
  const autoOpacity = useSharedValue(0);

  // --- Road/trail animation ---
  const trailOpacity = useSharedValue(0);

  // --- Final flash & exit ---
  const flashOpacity = useSharedValue(0);
  const contentScale = useSharedValue(1);

  const navigateAway = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    if (useOnboardingStore.getState().hasCompletedOnboarding) {
      router.replace('/home');
    } else {
      router.replace('/onboarding');
    }
  };

  useEffect(() => {
    // Phase 1: Logo fades in & scales up (0 → 700ms)
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    lineWidth.value = withDelay(
      350,
      withTiming(96, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    captionOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));

    // Phase 2: Auto appears & starts orbiting (600ms in)
    autoOpacity.value = withDelay(600, withTiming(1, { duration: 300 }));
    trailOpacity.value = withDelay(700, withTiming(0.6, { duration: 300 }));

    // Orbit: animate from 0 → 1 (one full circular loop)
    orbitProgress.value = withDelay(
      700,
      withTiming(1, {
        duration: ORBIT_DURATION,
        easing: Easing.inOut(Easing.cubic),
      })
    );

    // Phase 3: Smooth dark overlay fade-in to cover the auto's exit
    flashOpacity.value = withDelay(
      700 + ORBIT_DURATION - 200, // Starts at 3300ms (as auto finishes exiting)
      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
    );

    const navTimer = setTimeout(() => {
      navigateAway();
    }, 700 + ORBIT_DURATION + 200); // Navigate at 3700ms (when completely dark)

    return () => clearTimeout(navTimer);
  }, []);

  // --- Path geometry helper (Worklet for Reanimated) ---
  const getPath = (p: number) => {
    'worklet';
    const R = ORBIT_RADIUS;
    const W = PATH_WIDTH;

    if (p <= 0.25) {
      // Entry Phase: Horizontal S-curve from left (-W, 0) to (0, R)
      const t = p / 0.25;
      const x = -W * (1 - t);
      const y = R * (3 * t * t - 2 * t * t * t);
      
      const dx = W;
      const dy = 6 * R * t * (1 - t);
      const rotationRad = Math.atan2(dy, dx);
      const rotationDeg = (rotationRad * 180) / Math.PI;

      return { x, y, rotationDeg };
    } else if (p <= 0.75) {
      // Roundabout Phase: Counter-clockwise circle starting and ending at (0, R)
      const t = (p - 0.25) / 0.50;
      const u = t * 2 * Math.PI;
      const x = R * Math.sin(u);
      const y = R * Math.cos(u);

      const dx = 2 * Math.PI * R * Math.cos(u);
      const dy = -2 * Math.PI * R * Math.sin(u);
      const rotationRad = Math.atan2(dy, dx);
      const rotationDeg = (rotationRad * 180) / Math.PI;

      return { x, y, rotationDeg };
    } else {
      // Exit Phase: Horizontal S-curve from (0, R) to right (W, 0)
      const t = (p - 0.75) / 0.25;
      const x = W * t;
      const y = R * (1 - (3 * t * t - 2 * t * t * t));

      const dx = W;
      const dy = -6 * R * t * (1 - t);
      const rotationRad = Math.atan2(dy, dx);
      const rotationDeg = (rotationRad * 180) / Math.PI;

      return { x, y, rotationDeg };
    }
  };

  // --- Animated styles ---

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value * contentScale.value }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
  }));

  const captionStyle = useAnimatedStyle(() => ({
    opacity: captionOpacity.value,
    transform: [{ translateY: (1 - captionOpacity.value) * 10 }],
  }));

  // Auto-rickshaw follows the smooth path
  const autoStyle = useAnimatedStyle(() => {
    const { x, y, rotationDeg } = getPath(orbitProgress.value);

    return {
      opacity: autoOpacity.value,
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${rotationDeg}deg` },
        { scaleX: -1 }, // Horizontal flip so left-facing emoji faces right/upright
      ],
    };
  });

  // Trail dots follow the path, staggered behind the auto
  const makeTrailStyle = (delay: number, scale: number) => {
    return useAnimatedStyle(() => {
      const trailProgress = Math.max(0, orbitProgress.value - delay);
      const { x, y } = getPath(trailProgress);

      const opacity = interpolate(
        orbitProgress.value,
        [delay, delay + 0.05, 1],
        [0, trailOpacity.value * scale, trailOpacity.value * scale * 0.4]
      );

      return {
        opacity,
        transform: [
          { translateX: x },
          { translateY: y },
          { scale },
        ],
      };
    });
  };

  const trail1Style = makeTrailStyle(0.03, 0.8);
  const trail2Style = makeTrailStyle(0.06, 0.6);
  const trail3Style = makeTrailStyle(0.09, 0.4);

  // Orbit ring (faint dashed circle)
  const orbitRingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(autoOpacity.value, [0, 1], [0, 0.12]),
  }));

  // Flash overlay
  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background glow blobs */}
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      {/* Orbit ring (faint circle showing the path) */}
      <Animated.View style={[styles.orbitRing, orbitRingStyle]} />

      {/* Trail particles */}
      <Animated.View style={[styles.trailDot, trail3Style]} />
      <Animated.View style={[styles.trailDot, trail2Style]} />
      <Animated.View style={[styles.trailDot, trail1Style]} />

      {/* Auto-rickshaw icon orbiting */}
      <Animated.View style={[styles.autoContainer, autoStyle]}>
        <View style={styles.autoBody}>
          {/* Simple geometric auto-rickshaw shape */}
          <Text style={styles.autoEmoji}>🛺</Text>
        </View>
      </Animated.View>

      {/* Center Logo */}
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <View style={styles.logoBox}>
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
              marginTop: spacing.sm,
            },
            lineStyle,
          ]}
        />
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.caption, captionStyle]}>
        <Text variant="label" tone="secondary" align="center">
          Shared rides, redesigned.
        </Text>
      </Animated.View>

      {/* Flash overlay on exit */}
      <Animated.View style={[styles.flash, flashStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.app,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screenX,
  },

  // --- Background ---
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTop: {
    backgroundColor: colors.brand.primary,
    width: 200,
    height: 200,
    opacity: 0.06,
    top: 180,
    right: -60,
  },
  blobBottom: {
    backgroundColor: colors.brand.secondary,
    width: 160,
    height: 160,
    opacity: 0.05,
    bottom: 200,
    left: -40,
  },

  // --- Orbit ring ---
  orbitRing: {
    position: 'absolute',
    width: ORBIT_RADIUS * 2,
    height: ORBIT_RADIUS * 2,
    borderRadius: ORBIT_RADIUS,
    borderWidth: 1.5,
    borderColor: colors.brand.primary,
    borderStyle: 'dashed',
  },

  // --- Trail dots ---
  trailDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand.primary,
  },

  // --- Auto-rickshaw ---
  autoContainer: {
    position: 'absolute',
    width: AUTO_SIZE,
    height: AUTO_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoBody: {
    width: AUTO_SIZE,
    height: AUTO_SIZE,
    borderRadius: AUTO_SIZE / 2,
    backgroundColor: 'rgba(49, 245, 165, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(49, 245, 165, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoEmoji: {
    fontSize: 22,
  },

  // --- Logo ---
  logoWrap: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoBox: {
    alignItems: 'center',
    backgroundColor: colors.surface.glassStrong,
    borderColor: colors.border.accent,
    borderRadius: radius.sheet,
    borderWidth: 1,
    height: 112,
    justifyContent: 'center',
    width: 112,
  },

  // --- Caption ---
  caption: {
    position: 'absolute',
    bottom: 72,
  },

  // --- Flash (Smooth dark overlay) ---
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.app,
    zIndex: 100,
  },
});
