import { StyleSheet, Text, type TextProps } from 'react-native';

import { PoppinsFonts, TextStyles } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'button';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'h1' ? TextStyles.h1 : undefined,
        type === 'h2' ? TextStyles.h2 : undefined,
        type === 'h3' ? TextStyles.h3 : undefined,
        type === 'h4' ? TextStyles.h4 : undefined,
        type === 'body1' ? TextStyles.body1 : undefined,
        type === 'body2' ? TextStyles.body2 : undefined,
        type === 'caption' ? TextStyles.caption : undefined,
        type === 'button' ? TextStyles.button : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: PoppinsFonts.regular,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: PoppinsFonts.semiBold,
  },
  title: {
    fontSize: 32,
    fontFamily: PoppinsFonts.bold,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: PoppinsFonts.semiBold,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    fontFamily: PoppinsFonts.medium,
    color: '#0a7ea4',
  },
});
