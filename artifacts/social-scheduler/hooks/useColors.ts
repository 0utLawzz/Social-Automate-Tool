import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';
import { useThemePreference } from '@/context/ThemeContext';

export function useColors() {
  const { theme } = useThemePreference();
  const systemScheme = useColorScheme();
  const effectiveScheme = theme === 'system' ? systemScheme : theme;
  const palette = effectiveScheme === 'light' ? colors.light : colors.dark;
  return { ...palette, radius: colors.radius };
}
