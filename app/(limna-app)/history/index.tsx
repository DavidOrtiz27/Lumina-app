import { ProtectedRoute } from '@/presentation/auth/components'
import {
    HistoryFilters,
    HistoryHeader,
    HistoryList,
    HistoryTabs
} from '@/presentation/history/components'
import { mockHistoryEntries } from '@/presentation/history/data/mockHistory'
import type { FilterPeriod, TabType } from '@/presentation/history/types'
import { filterEntriesByPeriod, sortEntriesByDate } from '@/presentation/history/utils/filters'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import React, { useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const HistoryScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('all')
  const [activeTab, setActiveTab] = useState<TabType>('ingreso')

  const filteredEntries = useMemo(() => {
    // Filtrar por tab (ingreso/egreso)
    const tabFiltered = mockHistoryEntries.filter(entry => entry.type === activeTab)
    // Filtrar por período
    const periodFiltered = filterEntriesByPeriod(tabFiltered, selectedPeriod)
    return sortEntriesByDate(periodFiltered)
  }, [selectedPeriod, activeTab])

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
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
          
          <HistoryList entries={filteredEntries} />
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
})

export default HistoryScreen
