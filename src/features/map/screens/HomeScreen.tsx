import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, Button } from '@/components/common';
import { SafeMapView, SafeCamera, SafeShapeSource, SafeLineLayer } from '@/components/map/SafeMapView';
import { BottomSheet } from '@/components/motion';
import { RideOptionCard } from '@/features/booking/components/RideOptionCard';
import { MatchingPanel } from '@/features/sharedRide/components/MatchingPanel';
import { colors, radius, shadows, spacing } from '@/theme';
import { LogoSvg } from '@/components/common/LogoSvg';

// Mock route data — Greater Noida: Pari Chowk → Knowledge Park III
const MOCK_ROUTE = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [77.5040, 28.4747], // Pari Chowk, Greater Noida
          [77.4920, 28.4812],
          [77.4790, 28.4890], // Knowledge Park III
        ],
      },
    },
  ],
} as const;

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'search' | 'selection' | 'matching'>('search');
  const [selectedRide, setSelectedRide] = useState<'shared' | 'private'>('shared');

  const handleOpenSearch = () => {
    router.push('/search');
  };

  const handleSelectRoute = () => {
    setStep('selection');
  };

  const handleBackToSearch = () => {
    setStep('search');
  };

  const handleConfirmRide = () => {
    if (selectedRide === 'shared') {
      setStep('matching');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Full-screen Map */}
      <SafeMapView style={styles.map} styleURL="mapbox://styles/mapbox/dark-v11" logoEnabled={false} compassEnabled={false}>
        <SafeCamera
          zoomLevel={13}
          centerCoordinate={[77.5040, 28.4747]}
          animationMode="flyTo"
          animationDuration={2000}
        />
        {step !== 'search' && (
          <SafeShapeSource id="routeSource" shape={MOCK_ROUTE}>
            <SafeLineLayer
              id="routeLine"
              style={{
                lineColor: colors.brand.primary,
                lineWidth: 4,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </SafeShapeSource>
        )}
      </SafeMapView>

      {/* Floating Header */}
      <View style={[styles.header, { top: insets.top + spacing.sm }]}>
        <TouchableOpacity style={styles.iconButton}>
          <LogoSvg width={40} height={40} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text.primary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
              style={styles.profileImage}
            />
            <View style={styles.profileOnlineDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Secondary Header Elements (Weather & Status) */}
      <View style={[styles.secondaryHeader, { top: insets.top + spacing.sm + 60 }]}>
        <View style={styles.weatherWidget}>
          <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="#FFD700" />
          <View style={{ marginLeft: 8 }}>
            <Text variant="body" weight="bold" tone="primary">28°</Text>
            <Text variant="micro" tone="secondary">Partly Cloudy</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text variant="caption" tone="primary" weight="bold">Online</Text>
        </View>
      </View>

      {/* Map Side Buttons */}
      <View style={[styles.mapSideButtons, { bottom: step === 'search' ? 440 : 380 }]}>
        <TouchableOpacity style={styles.mapButton}>
          <MaterialCommunityIcons name="crosshairs-gps" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapButton}>
          <MaterialCommunityIcons name="layers-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Smooth Bottom Sheet */}
      <BottomSheet snapPoints={step === 'search' ? [0.45, 0.85] : [0.4, 0.8]} initialSnapIndex={0}>
        <View style={styles.sheetContent}>
          {step === 'search' ? (
            <View style={{ paddingBottom: 100 }}>
              <View style={styles.sheetHeaderRow}>
                <Text variant="title2" tone="primary" weight="bold">
                  Where are you going?
                </Text>
                <TouchableOpacity style={styles.savedPlacesButton}>
                  <MaterialCommunityIcons name="star-outline" size={16} color={colors.text.primary} />
                  <Text variant="caption" tone="primary" style={{ marginLeft: 4 }}>Saved Places</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.searchBar} onPress={handleOpenSearch} activeOpacity={0.8}>
                <MaterialCommunityIcons name="magnify" size={24} color={colors.brand.primary} />
                <Text variant="body" tone="secondary" style={styles.searchPlaceholder}>Search destination</Text>
                <MaterialCommunityIcons name="microphone" size={24} color={colors.text.primary} />
              </TouchableOpacity>

              <View style={styles.quickActionsRow}>
                <TouchableOpacity style={styles.quickActionBtn}>
                  <MaterialCommunityIcons name="home" size={24} color={colors.brand.primary} />
                  <Text variant="caption" tone="primary" weight="bold" style={{ marginTop: 4 }}>Home</Text>
                  <Text variant="micro" tone="secondary">Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionBtn}>
                  <MaterialCommunityIcons name="briefcase" size={24} color={colors.brand.primary} />
                  <Text variant="caption" tone="primary" weight="bold" style={{ marginTop: 4 }}>Work</Text>
                  <Text variant="micro" tone="secondary">Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionBtn}>
                  <MaterialCommunityIcons name="airplane" size={24} color={colors.brand.primary} />
                  <Text variant="caption" tone="primary" weight="bold" style={{ marginTop: 4 }}>Airport</Text>
                  <Text variant="micro" tone="secondary">BLR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionBtn}>
                  <MaterialCommunityIcons name="dots-grid" size={24} color={colors.text.secondary} />
                  <Text variant="caption" tone="primary" weight="bold" style={{ marginTop: 4 }}>More</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sectionHeaderRow}>
                <Text variant="body" tone="secondary">
                  Recent Routes
                </Text>
                <TouchableOpacity>
                  <Text variant="caption" tone="primary" weight="bold" style={{ color: colors.brand.primary }}>See all</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.recentCards}>
                {[
                  { id: 1, name: 'Pari Chowk Metro Station', detail: '2.1 km • 6 min', icon: 'train' },
                  { id: 2, name: 'Sector 62, Noida', detail: '11 km • 22 min', icon: 'briefcase' },
                  { id: 3, name: 'Botanical Garden Metro', detail: '14 km • 28 min', icon: 'star' },
                ].map(place => (
                  <TouchableOpacity key={place.id} style={styles.recentCard} onPress={handleOpenSearch}>
                    <View style={styles.recentIcon}>
                      <MaterialCommunityIcons name={place.icon as any} size={20} color={colors.brand.primary} />
                    </View>
                    <View style={styles.recentInfo}>
                      <Text variant="body" tone="primary">{place.name}</Text>
                      <Text variant="caption" tone="secondary">{place.detail}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.secondary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : step === 'selection' ? (
            <View>
              <View style={styles.selectionHeader}>
                <TouchableOpacity onPress={handleBackToSearch} style={styles.backButton}>
                  <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text variant="title2" tone="primary" weight="bold">
                  Choose a ride
                </Text>
                <View style={{ width: 24 }} />
              </View>

              <View style={styles.rideOptionsContainer}>
                <RideOptionCard
                  type="shared"
                  title="MOVI Shared"
                  price={65}
                  originalPrice={110}
                  eta="2 min"
                  matchCount={1}
                  isSelected={selectedRide === 'shared'}
                  onSelect={() => setSelectedRide('shared')}
                />
                <RideOptionCard
                  type="private"
                  title="MOVI Private"
                  subtitle="Direct route"
                  price={110}
                  eta="2 min"
                  isSelected={selectedRide === 'private'}
                  onSelect={() => setSelectedRide('private')}
                />
              </View>

              <View style={styles.paymentRow}>
                <View style={styles.cashPill}>
                  <MaterialCommunityIcons name="cash" size={20} color={colors.brand.primary} />
                  <Text variant="body" tone="primary" weight="bold" style={{ marginLeft: 8 }}>Cash</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color={colors.text.secondary} style={{ marginLeft: 4 }} />
                </View>
              </View>

              <Button
                title={selectedRide === 'shared' ? 'Confirm Shared Ride' : 'Confirm Private Ride'}
                onPress={handleConfirmRide}
                size="lg"
                fullWidth
              />
            </View>
          ) : (
            <MatchingPanel
              initialFare={65}
              onCancel={() => setStep('selection')}
            />
          )}
        </View>
      </BottomSheet>

      {/* Bottom Navigation */}
      {step === 'search' && (
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons name="home" size={24} color={colors.brand.primary} />
            <Text variant="micro" style={{ color: colors.brand.primary, marginTop: 4 }}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons name="transit-connection-variant" size={24} color={colors.text.secondary} />
            <Text variant="micro" tone="secondary" style={{ marginTop: 4 }}>Routes</Text>
          </TouchableOpacity>

          <View style={styles.navItemCentralPlaceholder} />

          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={24} color={colors.text.secondary} />
            <Text variant="micro" tone="secondary" style={{ marginTop: 4 }}>Tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons name="account-outline" size={24} color={colors.text.secondary} />
            <Text variant="micro" tone="secondary" style={{ marginTop: 4 }}>Profile</Text>
          </TouchableOpacity>

          {/* Central Go Button */}
          <TouchableOpacity style={styles.goButton}>
            <MaterialCommunityIcons name="navigation-variant" size={28} color="#FFF" style={{ transform: [{ rotate: '45deg' }] }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.screen,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    left: spacing.screenX,
    right: spacing.screenX,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface.glassStrong,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.accent,
    ...shadows.sm,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand.primary,
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border.accent,
  },
  profileOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.brand.primary,
    borderWidth: 2,
    borderColor: colors.background.screen,
  },
  secondaryHeader: {
    position: 'absolute',
    left: spacing.screenX,
    right: spacing.screenX,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  weatherWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.glassStrong,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.accent,
    ...shadows.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.glassStrong,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.accent,
    gap: spacing.xs,
    ...shadows.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand.primary,
  },
  mapSideButtons: {
    position: 'absolute',
    right: spacing.screenX,
    gap: spacing.sm,
    zIndex: 10,
  },
  mapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface.glassStrong,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.accent,
    ...shadows.md,
  },
  sheetContent: {
    padding: spacing.screenX,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  savedPlacesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.glass,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.input,
    paddingHorizontal: spacing.md,
    height: 56,
    borderRadius: radius.panel,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginBottom: spacing.lg,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: spacing.md,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  quickActionBtn: {
    width: '23%',
    backgroundColor: colors.surface.panel,
    borderRadius: radius.panel,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  recentCards: {
    gap: spacing.sm,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.panel,
    borderRadius: radius.panel,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  recentInfo: {
    flex: 1,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.glass,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rideOptionsContainer: {
    marginBottom: spacing.lg,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  cashPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.glassStrong,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: '#0A0C10',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: radius.panel,
    borderTopRightRadius: radius.panel,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingBottom: 20,
    zIndex: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemCentralPlaceholder: {
    width: 80,
  },
  goButton: {
    position: 'absolute',
    top: -24,
    alignSelf: 'center',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#0A0C10',
    ...shadows.glow,
  },
});
