import Constants from 'expo-constants';

type AppEnvironment = 'development' | 'staging' | 'production';

type AppConfig = {
  apiBaseUrl: string;
  appEnvironment: AppEnvironment;
  mapboxAccessToken: string;
};

const extra = Constants.expoConfig?.extra ?? {};

export const env: AppConfig = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? extra.apiBaseUrl ?? 'http://localhost:4000',
  appEnvironment: (process.env.EXPO_PUBLIC_APP_ENV ??
    extra.environment ??
    'development') as AppEnvironment,
  mapboxAccessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? extra.mapboxAccessToken ?? ''
};
