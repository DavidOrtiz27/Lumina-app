import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ProtectedRoute } from '@/presentation/auth/components'
import { useDrawer } from '@/presentation/navigation/hooks/useDrawer'
import { QRDetailsView, QRMainView } from '@/presentation/qr/components'
import type { EquipmentData, QRViewType } from '@/presentation/qr/types'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const QRScreen = () => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const { openDrawer } = useDrawer()
  const [currentView, setCurrentView] = useState<QRViewType>('main')
  
  // Obtener parámetros del equipo seleccionado
  const params = useLocalSearchParams<{
    equipmentId?: string
    equipmentName?: string
    equipmentSerial?: string
    equipmentBrand?: string
    equipmentColor?: string
    equipmentImage?: string
    equipmentQrData?: string
  }>()

  // Valores por defecto si no hay parámetros (para compatibilidad)
  const equipmentData: EquipmentData = {
    id: params.equipmentId || 'default',
    name: params.equipmentName || 'Equipo no seleccionado',
    serial: params.equipmentSerial || 'N/A',
    brand: params.equipmentBrand || 'N/A',
    color: params.equipmentColor || 'N/A',
    imageUrl: params.equipmentImage || 'https://via.placeholder.com/120x120/6B7280/FFFFFF?text=📦',
    qrData: params.equipmentQrData || JSON.stringify({ message: 'No hay datos disponibles' })
  }

  return (
    <ProtectedRoute>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header con botón del menú */}
          <View style={[styles.topHeader, { backgroundColor: colors.primary }]}>
            <TouchableOpacity 
              style={styles.menuButton} 
              onPress={openDrawer}
            >
              <Ionicons name="menu" size={28} color="white" />
            </TouchableOpacity>
            <ThemedText type="h2" style={styles.headerTitle}>
              Mi QR
            </ThemedText>
            <View style={styles.menuButton} />
          </View>

          {currentView === 'main' ? (
            <QRMainView 
              equipmentData={equipmentData}
              onMoreInfo={() => setCurrentView('details')}
            />
          ) : (
            <QRDetailsView
              equipmentData={equipmentData}
              onBack={() => setCurrentView('main')}
            />
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
  topHeader: {
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
    fontSize: 20,
  },
})

export default QRScreen