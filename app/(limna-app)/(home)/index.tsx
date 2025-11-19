import { ProtectedRoute } from '@/presentation/auth/components'
import { EquipmentList, HomeHeader } from '@/presentation/home/components'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import React from 'react'
import { StyleSheet, ActivityIndicator, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useEquipments } from '@/presentation/equipment/hooks/useEquipments'

const HomeScreen = () => {
  const { equipments, isLoading, isError, isEmpty, error, refresh } = useEquipments()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <ProtectedRoute>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <HomeHeader title="Mis Elementos" />
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <ThemedText style={styles.loadingText}>Cargando equipos...</ThemedText>
            </View>
          )}

          {isError && error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}> {error.message}</ThemedText>
              <ThemedText 
                style={[styles.retryText, { color: colors.primary }]}
                onPress={refresh}
              >
                Reintentar
              </ThemedText>
            </View>
          )}

          {isEmpty && (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                📦 No tienes equipos asignados
              </ThemedText>
            </View>
          )}

          {!isLoading && !isError && !isEmpty && (
            <EquipmentList equipments={equipments} />
          )}
        </SafeAreaView>
      </ThemedView>
    </ProtectedRoute>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
})

export default HomeScreen