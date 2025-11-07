import { ThemedText } from '@/presentation/theme/components/themed-text'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export const LoginHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <ThemedText type="h1" style={styles.title}>
        LUMINA
      </ThemedText>
      
      <ThemedText type="body1" style={styles.subtitle}>
        Inicia sesión en tu cuenta
      </ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  title: {
    fontSize: 42,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
})