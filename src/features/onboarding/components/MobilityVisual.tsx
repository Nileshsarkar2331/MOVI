import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { GlassCard, Text } from '@/components/common';
import { colors, radius, shadows, spacing } from '@/theme';

type MobilityVisualProps = {
  variant: 'fare' | 'network' | 'motion';
};

const routeNodes = [
  { left: 28, top: 72, size: 12 },
  { left: 94, top: 38, size: 9 },
  { left: 168, top: 92, size: 11 },
  { left: 224, top: 50, size: 9 }
] as const;

export function MobilityVisual({ variant }: MobilityVisualProps) {
  const progress = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true
    );
    pulse.value = withRepeat(
      withDelay(300, withTiming(1, { duration: 1800, easing: Easing.out(Easing.cubic) })),
      -1,
      true
    );
  }, [progress, pulse]);

  const vehicleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: progress.value * 168 },
      { translateY: Math.sin(progress.value * Math.PI * 2) * 18 },
      { rotate: `${-8 + progress.value * 18}deg` }
    ]
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.35 - pulse.value * 0.28,
    transform: [{ scale: 1 + pulse.value * 1.8 }]
  }));

  const isFare = variant === 'fare';
  const isNetwork = variant === 'network';

  return (
    <View
      style={{
        alignItems: 'center',
        height: 310,
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <View
        style={{
          height: 250,
          overflow: 'hidden',
          width: 300
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: colors.brand.primary,
              borderRadius: 120,
              height: 120,
              left: 92,
              position: 'absolute',
              top: 56,
              width: 120
            },
            pulseStyle
          ]}
        />

        <View
          style={{
            backgroundColor: colors.surface.glass,
            borderColor: colors.border.subtle,
            borderRadius: radius.sheet,
            borderWidth: 1,
            height: 214,
            left: 10,
            overflow: 'hidden',
            position: 'absolute',
            top: 18,
            width: 280,
            ...shadows.panel
          }}
        >
          <View
            style={{
              backgroundColor: colors.background.mapOverlay,
              height: '100%',
              position: 'absolute',
              width: '100%'
            }}
          />
          <View
            style={{
              backgroundColor: colors.border.subtle,
              height: 2,
              left: 42,
              position: 'absolute',
              top: 108,
              transform: [{ rotate: '-14deg' }],
              width: 198
            }}
          />
          <View
            style={{
              backgroundColor: colors.route.shared,
              borderRadius: radius.pill,
              height: 4,
              left: 38,
              position: 'absolute',
              top: 106,
              transform: [{ rotate: '-14deg' }],
              width: 196
            }}
          />

          {routeNodes.map((node, index) => (
            <View
              key={`${node.left}-${node.top}`}
              style={{
                backgroundColor: index === 0 ? colors.brand.primary : colors.surface.raised,
                borderColor:
                  index === routeNodes.length - 1 ? colors.brand.secondary : colors.brand.primary,
                borderRadius: radius.pill,
                borderWidth: 2,
                height: node.size,
                left: node.left,
                position: 'absolute',
                top: node.top,
                width: node.size
              }}
            />
          ))}

          <Animated.View
            style={[
              {
                alignItems: 'center',
                backgroundColor: colors.surface.inverse,
                borderRadius: radius.pill,
                height: 42,
                justifyContent: 'center',
                left: 32,
                position: 'absolute',
                top: 92,
                width: 42,
                ...shadows.soft
              },
              vehicleStyle
            ]}
          >
            <MaterialCommunityIcons
              color={colors.text.inverse}
              name={isFare ? 'car-hatchback' : 'rickshaw'}
              size={22}
            />
          </Animated.View>

          {isNetwork ? (
            <>
              <PassengerChip count="+2" left={154} top={38} />
              <PassengerChip count="+1" left={196} top={138} />
            </>
          ) : null}
        </View>

        <GlassCard
          elevated
          style={{
            bottom: 0,
            left: isFare ? 28 : 56,
            padding: spacing.md,
            position: 'absolute',
            width: isFare ? 152 : 190
          }}
        >
          <Text variant="micro" tone="secondary">
            {isFare ? 'Shared fare' : variant === 'network' ? 'Live match' : 'ETA'}
          </Text>
          <Text variant="title2" tone="primary" style={{ marginTop: spacing.xs }}>
            {isFare ? 'Rs. 112' : variant === 'network' ? '3 riders' : '4 min'}
          </Text>
          <Text variant="caption" tone="accent" style={{ marginTop: spacing.xs }}>
            {isFare ? '38% lower' : variant === 'network' ? 'same route' : 'nearby ride'}
          </Text>
        </GlassCard>
      </View>
    </View>
  );
}

function PassengerChip({ count, left, top }: { count: string; left: number; top: number }) {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: colors.surface.inverse,
        borderRadius: radius.pill,
        height: 34,
        justifyContent: 'center',
        left,
        position: 'absolute',
        top,
        width: 34
      }}
    >
      <Text variant="caption" tone="inverse">
        {count}
      </Text>
    </View>
  );
}
