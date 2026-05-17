import { io, Socket } from 'socket.io-client';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BACKEND_URL = 'http://192.168.1.2:4000'; // Change to your local IP if needed

import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';

import { Text } from '@/components/common';
import { colors, radius, spacing } from '@/theme';

interface Passenger {
  id: string;
  name: string;
  matchScore: number;
  detour: string;
}

interface MatchingPanelProps {
  initialFare: number;
  onCancel: () => void;
}

export function MatchingPanel({ initialFare, onCancel }: MatchingPanelProps) {
  const [matchingStatus, setMatchingStatus] = useState<'searching' | 'matched'>('searching');
  const [currentFare, setCurrentFare] = useState(initialFare);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  // Radar animation
  const radarScale = useSharedValue(1);
  const radarOpacity = useSharedValue(0.8);

  useEffect(() => {
    radarScale.value = withRepeat(
      withTiming(2.5, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    radarOpacity.value = withRepeat(
      withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );

    // Connect to Socket.io backend
    const socket: Socket = io(BACKEND_URL);

    socket.on('connect', () => {
      console.log('Connected to backend:', socket.id);
      
      // Request to join a shared ride
      socket.emit('request_join_ride', {
        rideType: 'shared',
        currentFare: initialFare
      });
    });

    socket.on('new_match_found', (data) => {
      setMatchingStatus('matched');
      setPassengers([
        { id: '1', name: 'Rahul M.', matchScore: 92, detour: `+${data.eta}` || '+2 mins' }
      ]);
    });

    socket.on('fare_updated', (data) => {
      // Animate fare reduction
      let fare = initialFare;
      const targetFare = data.newFare;
      const interval = setInterval(() => {
        fare -= 1;
        setCurrentFare(fare);
        if (fare <= targetFare) {
          clearInterval(interval);
        }
      }, 40);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const animatedRadar = useAnimatedStyle(() => ({
    transform: [{ scale: radarScale.value }],
    opacity: radarOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.pulseContainer}>
          {matchingStatus === 'searching' ? (
            <>
              <Animated.View style={[styles.radarCircle, animatedRadar]} />
              <View style={styles.radarCenter}>
                <MaterialCommunityIcons name="radar" size={24} color={colors.text.inverse} />
              </View>
            </>
          ) : (
            <Animated.View entering={FadeIn} style={[styles.radarCenter, { backgroundColor: colors.status.success }]}>
              <MaterialCommunityIcons name="check" size={24} color={colors.text.inverse} />
            </Animated.View>
          )}
        </View>
        
        <View style={styles.headerText}>
          <Text variant="title2" tone="primary" weight="bold">
            {matchingStatus === 'searching' ? 'Finding co-passengers...' : 'Route Matched!'}
          </Text>
          <Text variant="caption" tone="secondary">
            {matchingStatus === 'searching' ? 'Analyzing 12 active routes nearby' : 'Smart split applied to your fare'}
          </Text>
        </View>
      </View>

      <View style={styles.fareContainer}>
        <Text variant="label" tone="secondary">Estimated Fare</Text>
        <View style={styles.fareRow}>
          <Text variant="display" tone="primary" style={{ color: matchingStatus === 'matched' ? colors.status.success : colors.text.primary }}>
            ₹{currentFare}
          </Text>
          {matchingStatus === 'matched' && (
            <Animated.View entering={FadeIn} style={styles.savedBadge}>
              <MaterialCommunityIcons name="arrow-down" size={14} color={colors.status.success} />
              <Text variant="caption" weight="bold" style={{ color: colors.status.success }}>
                Saved ₹{initialFare - currentFare}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>

      <View style={styles.passengersContainer}>
        <Text variant="label" tone="secondary" style={styles.sectionTitle}>
          Your Shared Route
        </Text>
        
        {/* You (Always present) */}
        <View style={styles.passengerCard}>
          <View style={styles.avatar}>
            <Text variant="body" weight="bold" tone="primary">You</Text>
          </View>
          <View style={styles.passengerInfo}>
            <Text variant="body" tone="primary" weight="bold">Your Ride</Text>
            <Text variant="caption" tone="secondary">On time</Text>
          </View>
          <View style={styles.badge}>
            <Text variant="micro" tone="secondary">Drop 1</Text>
          </View>
        </View>

        {/* Matched Passengers */}
        {passengers.map((p) => (
          <Animated.View key={p.id} entering={FadeIn.delay(300)} style={styles.passengerCard}>
            <View style={[styles.avatar, { backgroundColor: colors.brand.secondary }]}>
              <Text variant="body" weight="bold" tone="primary">{p.name.charAt(0)}</Text>
            </View>
            <View style={styles.passengerInfo}>
              <Text variant="body" tone="primary" weight="bold">{p.name}</Text>
              <Text variant="caption" style={{ color: colors.status.success }}>{p.matchScore}% route match</Text>
            </View>
            <View style={styles.badge}>
              <Text variant="micro" tone="secondary">Drop 2 ({p.detour})</Text>
            </View>
          </Animated.View>
        ))}

        {matchingStatus === 'searching' && (
          <Animated.View exiting={FadeOut} style={styles.skeletonCard}>
            <View style={styles.skeletonAvatar} />
            <View style={styles.skeletonLines}>
              <View style={styles.skeletonLineLong} />
              <View style={styles.skeletonLineShort} />
            </View>
          </Animated.View>
        )}
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text variant="body" tone="secondary">Cancel Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  pulseContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  radarCircle: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brand.primary,
  },
  radarCenter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  fareContainer: {
    backgroundColor: colors.surface.panel,
    padding: spacing.md,
    borderRadius: radius.panel,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.status.success}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  passengersContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  passengerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.glassStrong,
    padding: spacing.md,
    borderRadius: radius.panel,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  passengerInfo: {
    flex: 1,
  },
  badge: {
    backgroundColor: colors.surface.glass,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.panel,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border.strong,
    marginRight: spacing.md,
  },
  skeletonLines: {
    flex: 1,
    gap: 8,
  },
  skeletonLineLong: {
    height: 12,
    width: '60%',
    backgroundColor: colors.border.strong,
    borderRadius: 6,
  },
  skeletonLineShort: {
    height: 12,
    width: '40%',
    backgroundColor: colors.border.strong,
    borderRadius: 6,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});
