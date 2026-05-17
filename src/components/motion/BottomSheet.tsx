import { ReactNode, useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

import { colors, radius, shadows } from '@/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  children: ReactNode;
  snapPoints: number[]; // Array of percentages [0, 1] (e.g., [0.2, 0.5, 0.9])
  initialSnapIndex?: number;
  onSnap?: (index: number) => void;
}

export function BottomSheet({
  children,
  snapPoints,
  initialSnapIndex = 0,
  onSnap
}: BottomSheetProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue({ y: 0 });

  const pixelSnapPoints = snapPoints.map((p) => SCREEN_HEIGHT * (1 - p));

  const snapTo = (index: number) => {
    'worklet';
    const target = pixelSnapPoints[index];
    if (target !== undefined) {
      translateY.value = withSpring(target, {
        damping: 24,
        stiffness: 220,
        mass: 0.8
      });
      if (onSnap) {
        runOnJS(onSnap)(index);
      }
    }
  };

  useEffect(() => {
    snapTo(initialSnapIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSnapIndex]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = context.value.y + event.translationY;
      // Clamp to highest point
      translateY.value = Math.max(translateY.value, pixelSnapPoints[pixelSnapPoints.length - 1]);
    })
    .onEnd((event) => {
      // Find closest snap point based on velocity and position
      const targetY = translateY.value + event.velocityY * 0.1;
      let closestDistance = Infinity;
      let closestIndex = 0;

      pixelSnapPoints.forEach((point, index) => {
        const distance = Math.abs(targetY - point);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      snapTo(closestIndex);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.app,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    height: SCREEN_HEIGHT,
    position: 'absolute',
    top: 0,
    width: '100%',
    ...shadows.lg
  },
  content: {
    flex: 1
  },
  handle: {
    backgroundColor: colors.border.strong,
    borderRadius: radius.pill,
    height: 4,
    width: 40
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12
  }
});
