import { ProtectedRoute } from '@/presentation/auth/components'
import {
  HistoryFilters,
  HistoryHeader,
  HistoryList,
  HistoryTabs
} from '@/presentation/history/components'
import { useHistory } from '@/presentation/history/hooks/useHistory'
import type { TabType } from '@/presentation/history/types'
import { filterEntriesByDate, sortEntriesByDate } from '@/presentation/history/utils/filters'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import React, { useMemo, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const HistoryScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('ingreso')

  const { history, isLoading, isError, error, isEmpty, refresh } = useHistory()

  const filteredEntries = useMemo(() => {
    if (!history.length) return []
    
    // Filtrar por tab (ingreso/egreso)
    const tabFiltered = history.filter(entry => {
      // Si está "en uso" (salida null) es ingreso, si tiene salida es egreso
      if (activeTab === 'ingreso') {
        return entry.salida === null
      } else {
        return entry.salida !== null
      }
    })
    
    // Filtrar por fecha específica
    const dateFiltered = filterEntriesByDate(tabFiltered, selectedDate)
    return sortEntriesByDate(dateFiltered)
  }, [history, selectedDate, activeTab])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <ThemedView style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            <HistoryHeader title="Historial" />
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <ThemedText style={styles.loadingText}>
                Cargando historial...
              </ThemedText>
            </View>
          </SafeAreaView>
        </ThemedView>
      </ProtectedRoute>
    )
  }

  if (isError) {
    return (
      <ProtectedRoute>
        <ThemedView style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            <HistoryHeader title="Historial" />
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>
                ⚠️ Error al cargar historial
              </ThemedText>
              <ThemedText style={styles.errorSubtext}>
                {typeof error === 'string' ? error : 'Intenta nuevamente más tarde'}
              </ThemedText>
            </View>
          </SafeAreaView>
        </ThemedView>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <HistoryHeader title="Historial" />
          
          <HistoryTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <HistoryFilters
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          
          {isEmpty || filteredEntries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                📋 No hay historial disponible
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                {isEmpty 
                  ? 'Aún no tienes registros de ingreso/salida'
                  : 'No hay registros para los filtros seleccionados'
                }
              </ThemedText>
            </View>
          ) : (
            <HistoryList entries={filteredEntries} />
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
    fontFamily: 'Poppins-Regular',
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    color: '#EF4444',
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    fontFamily: 'Poppins-Regular',
  },
})

export default HistoryScreen
