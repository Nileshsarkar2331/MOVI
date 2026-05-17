import { View, StyleSheet, Text as RNText } from 'react-native';
import { colors } from '@/theme';

let Mapbox: any = null;
try {
  Mapbox = require('@rnmapbox/maps').default;
} catch {
  // Not available in Expo Go
}

export const isMapboxAvailable = Mapbox !== null;

interface MapPlaceholderProps {
  style?: any;
  children?: React.ReactNode;
}

/**
 * A placeholder map view for when Mapbox native code is not available (Expo Go).
 * Shows a styled dark background that mimics the dark map aesthetic.
 */
export function MapPlaceholder({ style, children }: MapPlaceholderProps) {
  return (
    <View style={[styles.placeholder, style]}>
      <View style={styles.grid}>
        {/* Simulated road grid lines */}
        <View style={[styles.gridLine, styles.horizontal, { top: '20%' }]} />
        <View style={[styles.gridLine, styles.horizontal, { top: '45%' }]} />
        <View style={[styles.gridLine, styles.horizontal, { top: '70%' }]} />
        <View style={[styles.gridLine, styles.vertical, { left: '25%' }]} />
        <View style={[styles.gridLine, styles.vertical, { left: '55%' }]} />
        <View style={[styles.gridLine, styles.vertical, { left: '80%' }]} />
      </View>
      <View style={styles.label}>
        <RNText style={styles.labelText}>Map Preview</RNText>
        <RNText style={styles.sublabel}>Requires development build</RNText>
      </View>
      {children}
    </View>
  );
}

/**
 * Safe MapView wrapper. Returns Mapbox.MapView if available, MapPlaceholder otherwise.
 */
export function SafeMapView({ style, children, ...props }: any) {
  if (!isMapboxAvailable || !Mapbox) {
    return <MapPlaceholder style={style}>{children}</MapPlaceholder>;
  }

  return (
    <Mapbox.MapView style={style} {...props}>
      {children}
    </Mapbox.MapView>
  );
}

/**
 * Re-export Mapbox sub-components safely.
 * Usage: <SafeCamera ... /> — renders nothing if Mapbox is unavailable.
 */
export function SafeCamera(props: any) {
  if (!isMapboxAvailable || !Mapbox) return null;
  return <Mapbox.Camera {...props} />;
}

export function SafeShapeSource({ children, ...props }: any) {
  if (!isMapboxAvailable || !Mapbox) return null;
  return <Mapbox.ShapeSource {...props}>{children}</Mapbox.ShapeSource>;
}

export function SafeLineLayer(props: any) {
  if (!isMapboxAvailable || !Mapbox) return null;
  return <Mapbox.LineLayer {...props} />;
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  horizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  vertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  label: {
    alignItems: 'center',
    opacity: 0.5,
  },
  labelText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sublabel: {
    color: colors.text.secondary,
    fontSize: 12,
  },
});
