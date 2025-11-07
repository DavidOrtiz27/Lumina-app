import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import type { FilterPeriod } from '../types'

interface HistoryFiltersProps {
  selectedPeriod: FilterPeriod
  onPeriodChange: (period: FilterPeriod) => void
}

const filterOptions: { key: FilterPeriod; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'dia', label: 'Hoy', icon: 'today' },
  { key: 'semana', label: 'Esta semana', icon: 'calendar' },
  { key: 'mes', label: 'Este mes', icon: 'calendar-outline' },
  { key: 'all', label: 'Todo', icon: 'time' },
]

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <View style={styles.container}>
      <ThemedText type="h3" style={styles.title}>
        Filtrar por período
      </ThemedText>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContainer}
      >
        {filterOptions.map((option) => {
          const isSelected = selectedPeriod === option.key
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterButton,
                {
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                }
              ]}
              onPress={() => onPeriodChange(option.key)}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={isSelected ? 'white' : colors.text}
              />
              <ThemedText
                type="body2"
                style={[
                  styles.filterText,
                  { color: isSelected ? 'white' : colors.text }
                ]}
              >
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
    marginHorizontal: 20,
  },
  filtersScroll: {
    paddingHorizontal: 20,
  },
  filtersContainer: {
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
})