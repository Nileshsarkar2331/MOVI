import * as ExpoLocation from 'expo-location';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/common';
import { colors, radius, shadows, spacing } from '@/theme';

// ─── Types ───────────────────────────────────────────────────────────────────

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  distance?: string;
  icon: string;
  lat: number;
  lng: number;
}

// ─── Location data — Greater Noida & Noida (Phase 1 MVP) — with real GPS coords
const QUICK_PICKS: LocationSuggestion[] = [
  { id: 'q1',  name: 'Pari Chowk Metro Station',   address: 'Pari Chowk, Greater Noida',         distance: '2.1 km', icon: 'train',         lat: 28.4753, lng: 77.5035 },
  { id: 'q2',  name: 'Knowledge Park III',          address: 'Knowledge Park, Greater Noida',     distance: '4.5 km', icon: 'school',        lat: 28.4697, lng: 77.4935 },
  { id: 'q3',  name: 'Sector 62 IT Hub',            address: 'Sector 62, Noida',                  distance: '11 km',  icon: 'briefcase',     lat: 28.6144, lng: 77.3628 },
  { id: 'q4',  name: 'Botanical Garden Metro',      address: 'Sector 24, Noida',                  distance: '14 km',  icon: 'tree',          lat: 28.5680, lng: 77.3217 },
  { id: 'q5',  name: 'Omaxe Connaught Place Mall',  address: 'Beta II, Greater Noida',            distance: '6.2 km', icon: 'shopping',      lat: 28.4665, lng: 77.5078 },
  { id: 'q6',  name: 'Sharda University',           address: 'Knowledge Park III, Greater Noida', distance: '5.0 km', icon: 'school-outline',lat: 28.4690, lng: 77.4914 },
  { id: 'q7',  name: 'Delta I Market',              address: 'Delta I, Greater Noida',            distance: '3.8 km', icon: 'store',         lat: 28.4810, lng: 77.4950 },
  { id: 'q8',  name: 'Sector 18 Noida Market',      address: 'Sector 18, Noida',                  distance: '15 km',  icon: 'map-marker',    lat: 28.5697, lng: 77.3213 },
  { id: 'q9',  name: 'Jaypee Hospital',             address: 'Sector 128, Noida',                 distance: '9.5 km', icon: 'hospital-box',  lat: 28.5410, lng: 77.3315 },
  { id: 'q10', name: 'Jewar International Airport', address: 'Jewar, Gautam Buddha Nagar',        distance: '42 km',  icon: 'airplane',      lat: 28.1260, lng: 77.5909 },
];

// Full index of Greater Noida / Noida places for keyword search — all with real GPS coordinates
const ALL_PLACES: LocationSuggestion[] = [
  { id: 'p1',  name: 'Pari Chowk',                     address: 'Greater Noida, UP',                 icon: 'map-marker-outline', lat: 28.4747, lng: 77.5040 },
  { id: 'p2',  name: 'Pari Chowk Metro Station',        address: 'Greater Noida Metro, UP',           icon: 'train',              lat: 28.4753, lng: 77.5035 },
  { id: 'p3',  name: 'Alpha 1 Market',                  address: 'Alpha 1, Greater Noida',            icon: 'store',              lat: 28.4765, lng: 77.5115 },
  { id: 'p4',  name: 'Alpha 2 Sector',                  address: 'Alpha 2, Greater Noida',            icon: 'map-marker-outline', lat: 28.4780, lng: 77.5095 },
  { id: 'p5',  name: 'Beta 1 Sector',                   address: 'Beta 1, Greater Noida',             icon: 'map-marker-outline', lat: 28.4690, lng: 77.5060 },
  { id: 'p6',  name: 'Beta 2 Sector',                   address: 'Beta 2, Greater Noida',             icon: 'map-marker-outline', lat: 28.4670, lng: 77.5080 },
  { id: 'p7',  name: 'Gamma 1 Sector',                  address: 'Gamma 1, Greater Noida',            icon: 'map-marker-outline', lat: 28.4722, lng: 77.4995 },
  { id: 'p8',  name: 'Delta I Market',                  address: 'Delta I, Greater Noida',            icon: 'store',              lat: 28.4810, lng: 77.4950 },
  { id: 'p9',  name: 'Omaxe Connaught Place Mall',      address: 'Beta II, Greater Noida',            icon: 'shopping',           lat: 28.4665, lng: 77.5078 },
  { id: 'p10', name: 'Knowledge Park I',                address: 'Knowledge Park, Greater Noida',     icon: 'school-outline',     lat: 28.4705, lng: 77.4940 },
  { id: 'p11', name: 'Knowledge Park II',               address: 'Knowledge Park, Greater Noida',     icon: 'school-outline',     lat: 28.4697, lng: 77.4925 },
  { id: 'p12', name: 'Knowledge Park III',              address: 'Knowledge Park, Greater Noida',     icon: 'school',             lat: 28.4697, lng: 77.4935 },
  { id: 'p13', name: 'Sharda University',               address: 'Knowledge Park III, Greater Noida', icon: 'school',             lat: 28.4690, lng: 77.4914 },
  { id: 'p14', name: 'GL Bajaj Institute',              address: 'Knowledge Park III, Greater Noida', icon: 'school',             lat: 28.4700, lng: 77.4910 },
  { id: 'p15', name: 'Bennett University',              address: 'Greater Noida, UP',                 icon: 'school',             lat: 28.4501, lng: 77.5844 },
  { id: 'p16', name: 'Galgotias University',            address: 'Greater Noida, UP',                 icon: 'school-outline',     lat: 28.4508, lng: 77.5024 },
  { id: 'p17', name: 'Jaypee Hospital',                 address: 'Sector 128, Noida',                 icon: 'hospital-box',       lat: 28.5410, lng: 77.3315 },
  { id: 'p18', name: 'Greater Noida West',              address: 'Noida Extension, UP',               icon: 'city',               lat: 28.6075, lng: 77.4280 },
  { id: 'p19', name: 'Noida-Greater Noida Expressway',  address: 'Noida, UP',                         icon: 'road-variant',       lat: 28.5036, lng: 77.3897 },
  { id: 'p20', name: 'Sector 62 IT Hub',                address: 'Sector 62, Noida',                  icon: 'briefcase',          lat: 28.6144, lng: 77.3628 },
  { id: 'p21', name: 'Sector 18 Market',                address: 'Sector 18, Noida',                  icon: 'store',              lat: 28.5697, lng: 77.3213 },
  { id: 'p22', name: 'Botanical Garden Metro',          address: 'Sector 24, Noida',                  icon: 'tree',               lat: 28.5680, lng: 77.3217 },
  { id: 'p23', name: 'Golf Course Greater Noida',       address: 'Greater Noida, UP',                 icon: 'golf',               lat: 28.4639, lng: 77.5045 },
  { id: 'p24', name: 'Surajpur Wetland',                address: 'Surajpur, Greater Noida',           icon: 'nature',             lat: 28.4534, lng: 77.5149 },
  { id: 'p25', name: 'Jewar International Airport',     address: 'Jewar, Gautam Buddha Nagar',        icon: 'airplane',           lat: 28.1260, lng: 77.5909 },
  { id: 'p26', name: 'Expo Mart',                       address: 'Greater Noida, UP',                 icon: 'office-building',    lat: 28.4732, lng: 77.5003 },
  { id: 'p27', name: 'Radisson Blu Hotel',              address: 'Sector Omega, Greater Noida',       icon: 'bed',                lat: 28.4723, lng: 77.4990 },
  { id: 'p28', name: 'Fortis Hospital Noida',           address: 'Sector 62, Noida',                  icon: 'hospital-box',       lat: 28.6144, lng: 77.3620 },
  { id: 'p29', name: 'DPS Greater Noida',               address: 'Sector Omega, Greater Noida',       icon: 'school-outline',     lat: 28.4725, lng: 77.4985 },
  { id: 'p30', name: 'Gaur City Mall',                  address: 'Greater Noida West, UP',            icon: 'shopping',           lat: 28.6085, lng: 77.4265 },
];

function getMockSuggestions(query: string): LocationSuggestion[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ALL_PLACES.filter(
    s =>
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
  ).slice(0, 8);
}

// ─── Component ───────────────────────────────────────────────────────────────

export function LocationSearchScreen() {
  const insets = useSafeAreaInsets();
  const dropInputRef = useRef<TextInput>(null);

  // Current location state
  const [currentAddress, setCurrentAddress] = useState('Detecting your location...');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  // Drop-off state
  const [dropQuery, setDropQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dropInputFocused, setDropInputFocused] = useState(false);

  // Animated connector line height
  const connectorHeight = useSharedValue(40);

  // ── Detect current location on mount ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCurrentAddress('Location permission denied');
        setLocationStatus('error');
        return;
      }

      try {
        const loc = await ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.Balanced,
        });
        setCurrentCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });

        // Reverse geocode
        const [place] = await ExpoLocation.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (place) {
          const parts = [place.name, place.street, place.district, place.city].filter(Boolean);
          setCurrentAddress(parts.join(', '));
        } else {
          setCurrentAddress(`${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`);
        }
        setLocationStatus('ready');
      } catch {
        setCurrentAddress('Unable to fetch location');
        setLocationStatus('error');
      }
    })();
  }, []);

  // ── Search suggestions ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!dropQuery.trim()) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSuggestions(getMockSuggestions(dropQuery));
      setIsSearching(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [dropQuery]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelectDrop = (place: LocationSuggestion) => {
    Keyboard.dismiss();
    // Navigate forward to ride options with real GPS coords for Haversine distance
    router.push({
      pathname: '/ride-options',
      params: {
        pickupAddress: currentAddress,
        dropAddress: `${place.name}, ${place.address}`,
        pickupLat: String(currentCoords?.lat ?? 28.4747),
        pickupLng: String(currentCoords?.lng ?? 77.5040),
        dropLat: String(place.lat),
        dropLng: String(place.lng),
      },
    });
  };

  const handleRetryLocation = async () => {
    setLocationStatus('loading');
    setCurrentAddress('Detecting your location...');
    try {
      const loc = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });
      const [place] = await ExpoLocation.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (place) {
        const parts = [place.name, place.street, place.district, place.city].filter(Boolean);
        setCurrentAddress(parts.join(', '));
      }
      setLocationStatus('ready');
    } catch {
      setCurrentAddress('Unable to fetch location');
      setLocationStatus('error');
    }
  };

  // ── Render helpers ─────────────────────────────────────────────────────────
  const renderSuggestion = ({ item, index }: { item: LocationSuggestion; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(220)}>
      <TouchableOpacity style={styles.suggestionRow} onPress={() => handleSelectDrop(item)} activeOpacity={0.7}>
        <View style={styles.suggestionIcon}>
          <MaterialCommunityIcons name={item.icon as any} size={18} color={colors.brand.primary} />
        </View>
        <View style={styles.suggestionText}>
          <Text variant="body" tone="primary" weight="medium">{item.name}</Text>
          <Text variant="caption" tone="secondary">{item.address}</Text>
        </View>
        {item.distance && (
          <Text variant="micro" tone="secondary">{item.distance}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const showQuickPicks = !dropQuery.trim();
  const listData = showQuickPicks ? QUICK_PICKS : suggestions;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />

      {/* ─── Header ─────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <Text variant="title2" tone="primary" weight="bold">Plan your ride</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ─── Route Card ─────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(300).easing(Easing.out(Easing.cubic))} style={styles.routeCard}>

        {/* Current Location Row */}
        <View style={styles.locationRow}>
          <View style={styles.dotWrap}>
            {locationStatus === 'loading' ? (
              <ActivityIndicator size={14} color={colors.brand.primary} />
            ) : locationStatus === 'error' ? (
              <TouchableOpacity onPress={handleRetryLocation}>
                <MaterialCommunityIcons name="refresh" size={16} color={colors.state.danger} />
              </TouchableOpacity>
            ) : (
              <View style={styles.dotGreen} />
            )}
          </View>

          <View style={styles.locationTextWrap}>
            <Text variant="micro" tone="secondary" style={{ marginBottom: 2 }}>PICKUP</Text>
            <Text
              variant="body"
              tone={locationStatus === 'error' ? 'danger' : 'primary'}
              weight="medium"
              numberOfLines={1}
            >
              {currentAddress}
            </Text>
          </View>

          <TouchableOpacity style={styles.gpsBtn} onPress={handleRetryLocation}>
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={18}
              color={locationStatus === 'ready' ? colors.brand.primary : colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Connector */}
        <View style={styles.connectorWrap}>
          <View style={styles.connectorLine} />
        </View>

        {/* Drop-off Row */}
        <View style={[styles.locationRow, { borderBottomWidth: 0 }]}>
          <View style={styles.dotWrap}>
            <MaterialCommunityIcons
              name="map-marker"
              size={18}
              color={dropQuery ? colors.brand.primary : colors.text.secondary}
            />
          </View>
          <View style={styles.locationTextWrap}>
            <Text variant="micro" tone="secondary" style={{ marginBottom: 2 }}>DROP-OFF</Text>
            <TextInput
              ref={dropInputRef}
              style={[styles.dropInput, dropInputFocused && styles.dropInputFocused]}
              placeholder="Search destination..."
              placeholderTextColor={colors.text.tertiary}
              value={dropQuery}
              onChangeText={setDropQuery}
              onFocus={() => setDropInputFocused(true)}
              onBlur={() => setDropInputFocused(false)}
              autoFocus
              returnKeyType="search"
            />
          </View>
          {dropQuery.length > 0 && (
            <TouchableOpacity onPress={() => setDropQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* ─── Suggestions / Quick Picks ──────────────────────────── */}
      <View style={styles.listWrap}>
        <View style={styles.listHeaderRow}>
          {isSearching ? (
            <ActivityIndicator size={14} color={colors.brand.primary} style={{ marginRight: 8 }} />
          ) : (
            <MaterialCommunityIcons
              name={showQuickPicks ? 'history' : 'magnify'}
              size={14}
              color={colors.text.secondary}
              style={{ marginRight: 6 }}
            />
          )}
          <Text variant="micro" tone="secondary">
            {isSearching ? 'Searching...' : showQuickPicks ? 'QUICK PICKS' : 'RESULTS'}
          </Text>
        </View>

        <FlatList
          data={listData}
          keyExtractor={item => item.id}
          renderItem={renderSuggestion}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          ListEmptyComponent={
            !isSearching && dropQuery.trim().length > 0 ? (
              <Animated.View entering={FadeIn} style={styles.emptyWrap}>
                <MaterialCommunityIcons name="map-search-outline" size={36} color={colors.text.tertiary} />
                <Text variant="body" tone="secondary" style={{ marginTop: 12, textAlign: 'center' }}>
                  No places found for "{dropQuery}"
                </Text>
              </Animated.View>
            ) : null
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.app,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenX,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.glassStrong,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.strong,
  },

  // Route card
  routeCard: {
    marginHorizontal: spacing.screenX,
    backgroundColor: colors.surface.panel,
    borderRadius: radius.panel,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: 'hidden',
    ...shadows.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  dotWrap: {
    width: 24,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  dotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.brand.primary,
    borderWidth: 2,
    borderColor: `${colors.brand.primary}40`,
  },
  locationTextWrap: {
    flex: 1,
  },
  gpsBtn: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },

  // Connector
  connectorWrap: {
    paddingLeft: spacing.md + 11, // align with dot center
    paddingVertical: 0,
    height: 16,
    justifyContent: 'center',
    backgroundColor: colors.surface.panel,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border.strong,
    borderRadius: 1,
  },

  // Drop input
  dropInput: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
    padding: 0,
    margin: 0,
    height: 24,
  },
  dropInputFocused: {
    color: colors.text.primary,
  },

  // Suggestions list
  listWrap: {
    flex: 1,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.screenX,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  suggestionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: `${colors.brand.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  suggestionText: {
    flex: 1,
    gap: 2,
  },

  // Empty state
  emptyWrap: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
});
