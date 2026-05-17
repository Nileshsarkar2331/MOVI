import { PropsWithChildren, useEffect } from 'react';

let Mapbox: any = null;
try {
  Mapbox = require('@rnmapbox/maps').default;
} catch {
  // @rnmapbox/maps native code is not available (e.g., in Expo Go)
}

export const isMapboxAvailable = Mapbox !== null;

export function MapboxProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    if (isMapboxAvailable && Mapbox) {
      const token = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';
      if (token) {
        Mapbox.setAccessToken(token);
      }
    }
  }, []);

  return children;
}
