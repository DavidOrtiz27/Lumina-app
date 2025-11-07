/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1a1a2e',
    background: '#f8f9ff',
    tint: '#839cee',
    icon: '#6b7280',
    tabIconDefault: '#6b7280',
    tabIconSelected: '#839cee',
    primary: '#839cee',
    secondary: '#597aff',
    accent: '#e122b1',
    card: '#ffffff',
    border: '#e0e7ff',
    destructive: '#ef4444',
  },
  dark: {
    text: '#d7e0f9',
    background: '#040b1f',
    tint: '#839cee',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#839cee',
    primary: '#839cee',
    secondary: '#597aff',
    accent: '#e122b1',
    card: '#1a1a2e',
    border: '#374151',
    destructive: '#dc2626',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'Poppins-Regular',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Poppins-Regular',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Poppins, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Configuración específica de fuentes Poppins
export const PoppinsFonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};

// Estilos de texto predefinidos con Poppins
export const TextStyles = {
  h1: {
    fontFamily: PoppinsFonts.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: PoppinsFonts.semiBold,
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontFamily: PoppinsFonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontFamily: PoppinsFonts.medium,
    fontSize: 20,
    lineHeight: 28,
  },
  body1: {
    fontFamily: PoppinsFonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: PoppinsFonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: PoppinsFonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontFamily: PoppinsFonts.medium,
    fontSize: 16,
    lineHeight: 24,
  },
};
