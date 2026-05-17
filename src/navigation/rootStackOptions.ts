import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { colors } from '@/theme';

export const rootStackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'fade_from_bottom',
  contentStyle: {
    backgroundColor: colors.background.app
  }
};
