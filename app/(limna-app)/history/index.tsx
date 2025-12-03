import { ProtectedRoute } from '@/presentation/auth/components'
import {
    HistoryFilters,
    HistoryHeader,
    HistoryList,
    HistoryTabs
} from '@/presentation/history/components'
import { useHistory } from '@/presentation/history/hooks/useHistory'
import type { TabType } from '@/presentation/history/types'
import { filterEntriesByDate, filterEntriesByDateRange, sortEntriesByDate } from '@/presentation/history/utils/filters'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const HistoryScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({ 
    start: null, 
    end: null 
  })
  const [activeTab, setActiveTab] = useState<TabType>('ingreso')

  const { history, isLoading, isError, error, isEmpty, refresh } = useHistory()

  // Recargar historial cuando la pantalla obtiene foco (navegación desde banner u otras pantallas)
  useFocusEffect(
    useCallback(() => {
      console.log('📍 Pantalla de historial enfocada - recargando datos...');
      refresh();
    }, [refresh])
  )

  // Handler para cambio de tab que recarga los datos
  const handleTabChange = useCallback((tab: TabType) => {
    console.log('🔄 Cambiando tab a:', tab, '- recargando historial...');
    setActiveTab(tab);
    refresh();
  }, [refresh])

  const filteredEntries = useMemo(() => {
    console.log('🔄 Recalculando filtros...');
    console.log('📅 Fecha seleccionada:', selectedDate);
    console.log('📅 Rango de fechas:', dateRange);
    console.log('📑 Tab activo:', activeTab);
    console.log('📊 Total de registros:', history.length);
    
    if (!history.length) return []
    
    // Filtrar por tab (ingreso/egreso)
    const tabFiltered = history.filter(entry => {
      if (activeTab === 'ingreso') {
        return entry.salida === null
      } else {
        return entry.salida !== null
      }
    })

    // Determinar campo de fecha a filtrar
    const dateField = activeTab === 'ingreso' ? 'ingreso' : 'salida';

    // Filtrar por fecha: día específico o rango
    let dateFiltered = tabFiltered
    if (selectedDate) {
      dateFiltered = filterEntriesByDate(tabFiltered, selectedDate, dateField)
    } else if (dateRange.start || dateRange.end) {
      dateFiltered = filterEntriesByDateRange(tabFiltered, dateRange.start, dateRange.end, dateField)
    }

    const sorted = sortEntriesByDate(dateFiltered, dateField);
    return sorted;
  }, [history, selectedDate, dateRange, activeTab])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <ThemedView style={styles.container}>
            <HistoryHeader title="Historial" />
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <ThemedText style={styles.loadingText}>
                Cargando historial...
              </ThemedText>
            </View>
          </ThemedView>
        </SafeAreaView>
      </ProtectedRoute>
    )
  }

  if (isError) {
    return (
      <ProtectedRoute>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <ThemedView style={styles.container}>
            <HistoryHeader title="Historial" />
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>
                ⚠️ Error al cargar historial
              </ThemedText>
              <ThemedText style={styles.errorSubtext}>
                {typeof error === 'string' ? error : 'Intenta nuevamente más tarde'}
              </ThemedText>
            </View>
          </ThemedView>
        </SafeAreaView>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ThemedView style={styles.container}>
          <HistoryHeader title="Historial" />
          
          <HistoryTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          
          <HistoryFilters
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
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
        </ThemedView>
      </SafeAreaView>
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
