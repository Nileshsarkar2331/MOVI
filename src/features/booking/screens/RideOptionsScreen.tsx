import { getDistance } from 'geolib';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/common';
import { colors, radius, shadows, spacing } from '@/theme';

// ─── Fare Engine ──────────────────────────────────────────────────────────────

const FARE_CONFIG = {
  auto: {
    label: 'Auto',
    icon: 'rickshaw' as const,
    color: '#FFB800',
    base: 30,
    perKm: 10,
    perMin: 1,
    seatsLabel: '3 seats',
    etaOffset: 2,      // mins extra for arrival
    avgSpeedKmh: 22,   // city speed for time estimate
  },
  car: {
    label: 'Car',
    icon: 'car-side' as const,
    color: '#58B7FF',
    base: 50,
    perKm: 15,
    perMin: 2,
    seatsLabel: '4 seats',
    etaOffset: 4,
    avgSpeedKmh: 30,
  },
} as const;

type VehicleType = keyof typeof FARE_CONFIG;

// ── Haversine distance via geolib ──────────────────────────────────────────────
function calcDistanceKm(
  pickupLat: number, pickupLng: number,
  dropLat: number,   dropLng: number
): number {
  // getDistance returns metres; apply 1.25× road-factor for actual road distance
  const straightLineM = getDistance(
    { latitude: pickupLat, longitude: pickupLng },
    { latitude: dropLat,   longitude: dropLng   }
  );
  const roadDistanceKm = (straightLineM / 1000) * 1.25;
  return Math.max(0.5, Math.round(roadDistanceKm * 10) / 10); // min 0.5 km, 1dp
}

// ── Travel time: distance ÷ avg speed, rounded up ─────────────────────────────
function calcTimeMin(distanceKm: number, avgSpeedKmh: number): number {
  return Math.max(3, Math.ceil((distanceKm / avgSpeedKmh) * 60));
}

// ── Surge logic based on current hour ─────────────────────────────────────────
function getSurge(hour: number): { multiplier: number; label: string; active: boolean } {
  if ((hour >= 8 && hour < 10) || (hour >= 17 && hour < 20))
    return { multiplier: 1.3, label: '1.3×', active: true };
  if ((hour >= 10 && hour < 12) || (hour >= 20 && hour < 22))
    return { multiplier: 1.1, label: '1.1×', active: true };
  return { multiplier: 1.0, label: '1×', active: false };
}

function calcFare(type: VehicleType, distKm: number, timeMin: number, surgeMultiplier: number): number {
  const c = FARE_CONFIG[type];
  return Math.round((c.base + distKm * c.perKm + timeMin * c.perMin) * surgeMultiplier);
}

// ─── Surge Pulsing Badge ──────────────────────────────────────────────────────

function SurgeBadge({ label }: { label: string }) {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.45, { duration: 650 }), withTiming(1, { duration: 650 })),
      -1, false
    );
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={[surgeStyles.badge, style]}>
      <MaterialCommunityIcons name="lightning-bolt" size={11} color="#FF8C00" />
      <Text variant="micro" weight="bold" style={{ color: '#FF8C00', marginLeft: 2 }}>
        Surge {label}
      </Text>
    </Animated.View>
  );
}

const surgeStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,140,0,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,140,0,0.4)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

interface VehicleCardProps {
  type: VehicleType;
  distanceKm: number;
  surge: ReturnType<typeof getSurge>;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function VehicleCard({ type, distanceKm, surge, isSelected, onSelect, index }: VehicleCardProps) {
  const cfg = FARE_CONFIG[type];
  const timeMin  = calcTimeMin(distanceKm, cfg.avgSpeedKmh);
  const fare     = calcFare(type, distanceKm, timeMin, surge.multiplier);
  const baseFare = calcFare(type, distanceKm, timeMin, 1);
  const isSurged = surge.active && fare !== baseFare;
  const etaLabel = `${timeMin + cfg.etaOffset} min`;

  const borderAnim = useSharedValue(0);
  const bgAnim     = useSharedValue(0);

  useEffect(() => {
    borderAnim.value = withTiming(isSelected ? 1 : 0, { duration: 200, easing: Easing.out(Easing.ease) });
    bgAnim.value     = withTiming(isSelected ? 1 : 0, { duration: 220 });
  }, [isSelected]);

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: borderAnim.value > 0.5 ? cfg.color : colors.border.subtle,
    backgroundColor: bgAnim.value > 0.5 ? `${cfg.color}12` : colors.surface.panel,
  }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 90).duration(320).easing(Easing.out(Easing.cubic))}>
      <TouchableOpacity activeOpacity={0.82} onPress={onSelect}>
        <Animated.View style={[styles.card, cardStyle]}>

          {/* Icon */}
          <View style={[styles.vehicleIconWrap, { backgroundColor: `${cfg.color}20` }]}>
            <MaterialCommunityIcons name={cfg.icon} size={28} color={cfg.color} />
          </View>

          {/* Info */}
          <View style={styles.cardInfo}>
            <View style={styles.cardTopRow}>
              <Text variant="body" weight="bold" tone="primary">{cfg.label}</Text>
              {isSurged && <SurgeBadge label={surge.label} />}
            </View>
            <View style={styles.cardMetaRow}>
              <MaterialCommunityIcons name="clock-outline" size={13} color={colors.text.secondary} />
              <Text variant="caption" tone="secondary" style={{ marginLeft: 4 }}>{etaLabel} away</Text>
              <View style={styles.metaDot} />
              <MaterialCommunityIcons name="account-outline" size={13} color={colors.text.secondary} />
              <Text variant="caption" tone="secondary" style={{ marginLeft: 4 }}>{cfg.seatsLabel}</Text>
            </View>
          </View>

          {/* Fare */}
          <View style={styles.fareWrap}>
            {isSurged && (
              <Text variant="micro" tone="secondary" style={styles.strikethrough}>₹{baseFare}</Text>
            )}
            <Text variant="title2" weight="bold" style={{ color: isSelected ? cfg.color : colors.text.primary }}>
              ₹{fare}
            </Text>
          </View>

          {/* Selected tick */}
          {isSelected && (
            <Animated.View entering={FadeIn.duration(160)} style={[styles.selectedTick, { backgroundColor: cfg.color }]}>
              <MaterialCommunityIcons name="check" size={12} color="#000" />
            </Animated.View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  const shimmer = useSharedValue(0.4);
  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(withTiming(1, { duration: 700 }), withTiming(0.4, { duration: 700 })),
      -1, false
    );
  }, []);
  const shimmerStyle = useAnimatedStyle(() => ({ opacity: shimmer.value }));

  return (
    <View style={{ paddingHorizontal: spacing.screenX, paddingTop: spacing.lg }}>
      {[0, 1].map(i => (
        <Animated.View key={i} style={[styles.skeletonCard, shimmerStyle, { marginBottom: spacing.sm }]} />
      ))}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export function RideOptionsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    pickupAddress: string;
    dropAddress:   string;
    pickupLat:     string;
    pickupLng:     string;
    dropLat:       string;
    dropLng:       string;
  }>();

  const pickup = params.pickupAddress ?? 'Current Location';
  const drop   = params.dropAddress   ?? 'Destination';

  // ── Real Haversine distance via geolib ──────────────────────────────────────
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [calcError,  setCalcError]  = useState(false);
  const [selected,   setSelected]   = useState<VehicleType>('auto');

  useEffect(() => {
    try {
      const pLat = parseFloat(params.pickupLat ?? '28.4747');
      const pLng = parseFloat(params.pickupLng ?? '77.5040');
      const dLat = parseFloat(params.dropLat   ?? '28.4697');
      const dLng = parseFloat(params.dropLng   ?? '77.4935');

      if (isNaN(pLat) || isNaN(pLng) || isNaN(dLat) || isNaN(dLng)) throw new Error('Bad coords');

      // Simulate brief loading for UX polish (geolib is synchronous)
      setTimeout(() => {
        const km = calcDistanceKm(pLat, pLng, dLat, dLng);
        setDistanceKm(km);
      }, 600);
    } catch {
      setCalcError(true);
    }
  }, []);

  const surge = getSurge(new Date().getHours());
  const isLoading = distanceKm === null && !calcError;

  const selectedCfg  = FARE_CONFIG[selected];
  const selectedTime = distanceKm != null ? calcTimeMin(distanceKm, selectedCfg.avgSpeedKmh) : 0;
  const selectedFare = distanceKm != null ? calcFare(selected, distanceKm, selectedTime, surge.multiplier) : 0;

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ──────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <Text variant="title2" tone="primary" weight="bold">Choose a ride</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Route Summary Card ───────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(280)} style={styles.routeCard}>

          <View style={styles.routeRow}>
            <View style={styles.routeDotWrap}>
              <View style={styles.dotGreen} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" tone="secondary">PICKUP</Text>
              <Text variant="body" weight="medium" tone="primary" numberOfLines={1}>{pickup}</Text>
            </View>
          </View>

          <View style={styles.connector}>
            <View style={styles.connectorLine} />
          </View>

          <View style={styles.routeRow}>
            <View style={styles.routeDotWrap}>
              <MaterialCommunityIcons name="map-marker" size={16} color={colors.brand.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="micro" tone="secondary">DROP-OFF</Text>
              <Text variant="body" weight="medium" tone="primary" numberOfLines={1}>{drop}</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            {isLoading ? (
              <View style={styles.statsLoading}>
                <ActivityIndicator size={14} color={colors.brand.primary} />
                <Text variant="caption" tone="secondary" style={{ marginLeft: 8 }}>
                  Calculating distance…
                </Text>
              </View>
            ) : calcError ? (
              <Text variant="caption" tone="danger">⚠️ Could not calculate distance</Text>
            ) : (
              <>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="map-marker-distance" size={15} color={colors.brand.primary} />
                  <Text variant="caption" tone="primary" weight="bold" style={{ marginLeft: 5 }}>
                    {distanceKm} km
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="clock-fast" size={15} color={colors.brand.primary} />
                  <Text variant="caption" tone="primary" weight="bold" style={{ marginLeft: 5 }}>
                    ~{selectedTime} min
                  </Text>
                </View>
                {surge.active && (
                  <>
                    <View style={styles.statDivider} />
                    <SurgeBadge label={surge.label} />
                  </>
                )}
              </>
            )}
          </View>
        </Animated.View>

        {/* ── Vehicle Cards or Skeleton ────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(80).duration(240)}>
          <Text variant="label" tone="secondary" style={styles.sectionLabel}>AVAILABLE RIDES</Text>
        </Animated.View>

        {isLoading ? (
          <LoadingSkeleton />
        ) : calcError ? (
          <Animated.View entering={FadeIn} style={styles.errorCard}>
            <MaterialCommunityIcons name="alert-circle-outline" size={32} color={colors.state.danger} />
            <Text variant="body" tone="secondary" style={{ marginTop: 10, textAlign: 'center' }}>
              Unable to calculate route.{'\n'}Please go back and try again.
            </Text>
          </Animated.View>
        ) : (
          (Object.keys(FARE_CONFIG) as VehicleType[]).map((type, i) => (
            <VehicleCard
              key={type}
              type={type}
              distanceKm={distanceKm!}
              surge={surge}
              isSelected={selected === type}
              onSelect={() => setSelected(type)}
              index={i}
            />
          ))
        )}

        {/* ── Fare Breakdown ───────────────────────────────────── */}
        {!isLoading && !calcError && distanceKm != null && (
          <Animated.View entering={FadeInDown.delay(220).duration(300)} style={styles.breakdownCard}>
            <Text variant="label" tone="secondary" style={{ marginBottom: spacing.md }}>FARE BREAKDOWN</Text>

            {[
              {
                label: 'Base fare',
                value: `₹${selectedCfg.base}`,
              },
              {
                label: `Distance  ${distanceKm} km × ₹${selectedCfg.perKm}/km`,
                value: `₹${Math.round(distanceKm * selectedCfg.perKm)}`,
              },
              {
                label: `Time  ~${selectedTime} min × ₹${selectedCfg.perMin}/min`,
                value: `₹${selectedTime * selectedCfg.perMin}`,
              },
            ].map(row => (
              <View key={row.label} style={styles.breakdownRow}>
                <Text variant="caption" tone="secondary">{row.label}</Text>
                <Text variant="caption" tone="primary" weight="medium">{row.value}</Text>
              </View>
            ))}

            {surge.active && (
              <View style={styles.breakdownRow}>
                <Text variant="caption" style={{ color: '#FF8C00' }}>Surge multiplier</Text>
                <Text variant="caption" weight="medium" style={{ color: '#FF8C00' }}>×{surge.multiplier}</Text>
              </View>
            )}

            <View style={styles.breakdownDivider} />

            <View style={styles.breakdownRow}>
              <Text variant="body" tone="primary" weight="bold">Total</Text>
              <Text variant="body" weight="bold" style={{ color: selectedCfg.color }}>₹{selectedFare}</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* ── Confirm Button ───────────────────────────────────────── */}
      {!isLoading && !calcError && (
        <Animated.View
          entering={FadeInDown.delay(260).duration(300)}
          style={[styles.confirmWrap, { paddingBottom: insets.bottom + spacing.md }]}
        >
          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: selectedCfg.color }]}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name={selectedCfg.icon} size={20} color="#000" style={{ marginRight: 8 }} />
            <Text variant="label" style={{ color: '#000' }} weight="bold">
              Book {selectedCfg.label} · ₹{selectedFare}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.app },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenX,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surface.glassStrong,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border.strong,
  },

  scrollContent: { paddingHorizontal: spacing.screenX, paddingBottom: spacing.xl },

  // Route card
  routeCard: {
    backgroundColor: colors.surface.panel,
    borderRadius: radius.panel,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  routeDotWrap: { width: 28, alignItems: 'center', marginRight: spacing.md },
  dotGreen: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.brand.primary,
    borderWidth: 2, borderColor: `${colors.brand.primary}40`,
  },
  connector: { paddingLeft: 13, height: 16, justifyContent: 'center' },
  connectorLine: {
    width: 2, height: '100%',
    backgroundColor: colors.border.strong,
    borderRadius: 1, marginLeft: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    flexWrap: 'wrap',
    gap: spacing.sm,
    minHeight: 34,
  },
  statsLoading: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center' },
  statDivider: {
    width: 1, height: 14,
    backgroundColor: colors.border.strong,
    marginHorizontal: spacing.sm,
  },

  sectionLabel: { marginBottom: spacing.md, letterSpacing: 0.6 },

  // Vehicle card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.panel,
    borderWidth: 1.5,
    padding: spacing.md,
    marginBottom: spacing.sm,
    position: 'relative',
  },
  vehicleIconWrap: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardInfo: { flex: 1 },
  cardTopRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.sm, marginBottom: 4,
  },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center' },
  metaDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: colors.border.strong,
    marginHorizontal: spacing.xs,
  },
  fareWrap: { alignItems: 'flex-end', justifyContent: 'center', marginLeft: spacing.sm },
  strikethrough: { textDecorationLine: 'line-through', marginBottom: 2 },
  selectedTick: {
    position: 'absolute', top: -7, right: -7,
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },

  // Skeleton
  skeletonCard: {
    height: 76,
    backgroundColor: colors.surface.panel,
    borderRadius: radius.panel,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },

  // Error
  errorCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },

  // Breakdown card
  breakdownCard: {
    backgroundColor: colors.surface.panel,
    borderRadius: radius.panel,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.sm,
  },

  // Confirm button
  confirmWrap: {
    paddingHorizontal: spacing.screenX,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    backgroundColor: colors.background.app,
  },
  confirmBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow,
  },
});
