import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

import { Text } from '@/components/common';
import { colors, radius, spacing } from '@/theme';

interface RideOptionCardProps {
  type: 'shared' | 'private';
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  eta: string;
  isSelected: boolean;
  onSelect: () => void;
  matchCount?: number;
}

export function RideOptionCard({
  type,
  title,
  subtitle,
  price,
  originalPrice,
  eta,
  isSelected,
  onSelect,
  matchCount
}: RideOptionCardProps) {
  const isShared = type === 'shared';

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(isSelected ? colors.brand.primary : colors.border.subtle, {
        duration: 200,
        easing: Easing.out(Easing.ease)
      }),
      backgroundColor: withTiming(isSelected ? colors.surface.glassStrong : colors.surface.panel, {
        duration: 200
      })
    };
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onSelect}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={isShared ? 'account-multiple' : 'account'}
            size={24}
            color={isSelected ? colors.brand.primary : colors.text.primary}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="body" weight="bold" tone={isSelected ? 'primary' : 'primary'}>
              {title}
            </Text>
            {isShared && (
              <View style={styles.smartSplitBadge}>
                <MaterialCommunityIcons name="lightning-bolt" size={12} color={colors.text.inverse} />
                <Text variant="micro" weight="bold" style={{ color: colors.text.inverse }}>
                  Smart Split
                </Text>
              </View>
            )}
          </View>

          <View style={styles.details}>
            <Text variant="caption" tone="secondary">
              {eta}
            </Text>
            {isShared && matchCount ? (
              <>
                <View style={styles.dot} />
                <Text variant="caption" tone="accent">
                  {matchCount} match{matchCount > 1 ? 'es' : ''} nearby
                </Text>
              </>
            ) : null}
            {subtitle && !isShared ? (
              <>
                <View style={styles.dot} />
                <Text variant="caption" tone="secondary">
                  {subtitle}
                </Text>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.priceContainer}>
          {originalPrice && (
            <Text variant="caption" tone="secondary" style={styles.strikethrough}>
              ₹{originalPrice}
            </Text>
          )}
          <Text variant="title2" weight="bold" tone={isSelected ? 'primary' : 'primary'}>
            ₹{price}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.panel,
    borderWidth: 1.5,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.screen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  smartSplitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginLeft: spacing.sm,
    gap: 2,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.strong,
    marginHorizontal: spacing.xs,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
});
