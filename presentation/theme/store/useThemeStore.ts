import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ColorScheme = 'light' | 'dark'

interface ThemeState {
  themeMode: ThemeMode
  colorScheme: ColorScheme
  setThemeMode: (mode: ThemeMode) => void
  getEffectiveColorScheme: () => ColorScheme
}

// Función para obtener el tema del sistema
const getSystemColorScheme = (): ColorScheme => {
  // En React Native, podemos usar Appearance API
  const { Appearance } = require('react-native')
  return Appearance.getColorScheme() || 'light'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      colorScheme: getSystemColorScheme(),

      setThemeMode: (mode: ThemeMode) => {
        set({ themeMode: mode })
        
        // Calcular el color scheme efectivo
        let effectiveColorScheme: ColorScheme
        if (mode === 'system') {
          effectiveColorScheme = getSystemColorScheme()
        } else {
          effectiveColorScheme = mode as ColorScheme
        }
        
        set({ colorScheme: effectiveColorScheme })
      },

      getEffectiveColorScheme: () => {
        const { themeMode } = get()
        if (themeMode === 'system') {
          return getSystemColorScheme()
        }
        return themeMode as ColorScheme
      }
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

// Listener para cambios del tema del sistema
const { Appearance } = require('react-native')
Appearance.addChangeListener(({ colorScheme }: { colorScheme: ColorScheme }) => {
  const store = useThemeStore.getState()
  if (store.themeMode === 'system') {
    useThemeStore.setState({ colorScheme })
  }
})