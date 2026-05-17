import 'react-native-gesture-handler';
import '../global.css';

import { Stack } from 'expo-router';

import { AppProviders } from '@/providers/AppProviders';
import { rootStackScreenOptions } from '@/navigation/rootStackOptions';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={rootStackScreenOptions}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="home" />
      </Stack>
    </AppProviders>
  );
}
