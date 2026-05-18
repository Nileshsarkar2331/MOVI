import 'react-native-gesture-handler';
import '../global.css';

import { Stack } from 'expo-router';

import { AppProviders } from '@/providers/AppProviders';
import { rootStackScreenOptions } from '@/navigation/rootStackOptions';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={rootStackScreenOptions}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="home" options={{ animation: 'fade' }} />
        <Stack.Screen name="search" options={{ animation: 'slide_from_bottom', headerShown: false }} />
        <Stack.Screen name="ride-options" options={{ animation: 'slide_from_bottom', headerShown: false }} />
      </Stack>
    </AppProviders>
  );
}
