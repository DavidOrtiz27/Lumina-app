import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useDrawer } from '@/presentation/navigation/hooks/useDrawer'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

interface HistoryHeaderProps {
  title?: string
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({ 
  title = 'Historial de Ingreso' 
}) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const { openDrawer } = useDrawer()

  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={openDrawer}
      >
        <Ionicons name="menu" size={28} color="white" />
      </TouchableOpacity>
      <ThemedText type="h2" style={styles.headerTitle}>
        {title}
      </ThemedText>
      <View style={styles.menuButton} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 8,
    width: 44,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
})