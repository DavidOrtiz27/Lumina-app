import { ProtectedRoute } from '@/presentation/auth/components'
import { EquipmentList, HomeHeader } from '@/presentation/home/components'
import { mockEquipments } from '@/presentation/home/data/mockEquipments'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeScreen = () => {
  return (
    <ProtectedRoute>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <HomeHeader title="Mis Elementos" />
          <EquipmentList equipments={mockEquipments} />
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

export default HomeScreen