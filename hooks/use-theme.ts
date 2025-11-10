import type { ColorScheme } from '@/presentation/theme/store/useThemeStore'
import { useThemeStore } from '@/presentation/theme/store/useThemeStore'

/**
 * Hook personalizado que reemplaza useColorScheme de React Native
 * Ahora usa nuestro store de tema personalizado
 */
export const useCustomColorScheme = (): ColorScheme => {
  const { colorScheme } = useThemeStore()
  return colorScheme
}

/**
 * Hook para gestión completa del tema
 */
export const useTheme = () => {
  const { themeMode, colorScheme, setThemeMode, getEffectiveColorScheme } = useThemeStore()
  
  return {
    themeMode,
    colorScheme,
    setThemeMode,
    getEffectiveColorScheme,
    
    // Métodos de conveniencia
    setLightMode: () => setThemeMode('light'),
    setDarkMode: () => setThemeMode('dark'),
    setSystemMode: () => setThemeMode('system'),
    
    // Verificadores
    isLight: colorScheme === 'light',
    isDark: colorScheme === 'dark',
    isSystem: themeMode === 'system',
  }
}