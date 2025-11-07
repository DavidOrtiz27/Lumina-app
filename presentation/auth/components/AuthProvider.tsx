import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useAuthStore } from '@/presentation/auth/store/useAuthStore'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import { Redirect } from 'expo-router'
import React, { useEffect } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  
  const { status, checkAuthStatus } = useAuthStore()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  if (status === 'checking') {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText type="body1" style={styles.loadingText}>
          Verificando autenticación...
        </ThemedText>
      </ThemedView>
    )
  }

  return <>{children}</>
}

// Componente para proteger rutas que requieren autenticación
interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useAuthStore()

  if (status === 'checking') {
    return null // El AuthProvider ya maneja el loading
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/auth/login" />
  }

  return <>{children}</>
}

// Componente para rutas que solo deben ser accesibles cuando NO estás autenticado
interface PublicOnlyRouteProps {
  children: React.ReactNode
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { status } = useAuthStore()

  if (status === 'checking') {
    return null // El AuthProvider ya maneja el loading
  }

  if (status === 'authenticated') {
    return <Redirect href="/(limna-app)/(home)" />
  }

  return <>{children}</>
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
})