import { DarkTheme, Theme } from '@react-navigation/native';

import { colors } from '@/theme';

export const moviNavigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.brand.primary,
    background: colors.background.app,
    card: colors.surface.base,
    text: colors.text.primary,
    border: colors.border.subtle,
    notification: colors.brand.secondary
  }
};
