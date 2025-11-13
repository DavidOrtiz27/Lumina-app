import { ThemedText } from '@/presentation/theme/components/themed-text'
import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import type { HistoryEntry } from '../types'
import { HistoryCard } from './HistoryCard'

interface HistoryListProps {
  entries: HistoryEntry[]
  isLoading?: boolean
}

export const HistoryList: React.FC<HistoryListProps> = ({ 
  entries, 
  isLoading = false 
}) => {
  const renderItem = ({ item }: { item: HistoryEntry }) => (
    <HistoryCard entry={item} />
  )

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <ThemedText type="body1" style={styles.emptyText}>
        No hay registros de ingreso para el período seleccionado
      </ThemedText>
    </View>
  )

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <ThemedText type="h3" style={styles.headerText}>
        Historial de Ingreso ({entries.length} registros)
      </ThemedText>
    </View>
  )

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText type="body1" style={styles.loadingText}>
          Cargando historial...
        </ThemedText>
      </View>
    )
  }

  return (
    <FlatList
      data={entries}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyComponent}
      contentContainerStyle={styles.listContent}
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    opacity: 0.7,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
})