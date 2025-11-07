import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import type { TabType } from '../types'

interface HistoryTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export const HistoryTabs: React.FC<HistoryTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <View style={[styles.tabContainer, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[
          styles.tab,
          {
            backgroundColor: activeTab === 'ingreso' ? colors.primary : 'transparent',
            borderBottomColor: activeTab === 'ingreso' ? colors.primary : 'transparent',
          }
        ]}
        onPress={() => onTabChange('ingreso')}
      >
        <ThemedText
          type="body1"
          style={[
            styles.tabText,
            { color: activeTab === 'ingreso' ? 'white' : colors.text }
          ]}
        >
          Ingreso
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          {
            backgroundColor: activeTab === 'egreso' ? colors.primary : 'transparent',
            borderBottomColor: activeTab === 'egreso' ? colors.primary : 'transparent',
          }
        ]}
        onPress={() => onTabChange('egreso')}
      >
        <ThemedText
          type="body1"
          style={[
            styles.tabText,
            { color: activeTab === 'egreso' ? 'white' : colors.text }
          ]}
        >
          Egreso
        </ThemedText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 8,
    padding: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
})