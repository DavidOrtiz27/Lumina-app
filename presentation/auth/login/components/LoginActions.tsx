import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

interface LoginActionsProps {
  isLoading: boolean
  onLogin: () => void
}

export const LoginActions: React.FC<LoginActionsProps> = ({ isLoading, onLogin }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity 
        style={[styles.loginButton, { backgroundColor: colors.primary }]}
        onPress={onLogin}
        disabled={isLoading}
      >
        <ThemedText type="button" style={styles.loginButtonText}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.forgotButton}
          onPress={() => router.push('/auth/recovery')}
        >
          <ThemedText type="body2" style={[styles.forgotText, { color: colors.primary }]}>
            ¿Olvidaste tu contraseña?
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  actionsContainer: {
    marginTop: 24,
    gap: 16,
  },
  loginButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  footerContainer: {
    alignItems: 'center',
  },
  forgotButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  forgotText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
})