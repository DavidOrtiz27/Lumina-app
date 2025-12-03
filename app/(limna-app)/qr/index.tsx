import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ProtectedRoute } from '@/presentation/auth/components'
import { useDrawer } from '@/presentation/navigation/hooks/useDrawer'
import { QRDetailsView, QRMainView } from '@/presentation/qr/components'
import type { EquipmentData, QRViewType } from '@/presentation/qr/types'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
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
    equipmentData?: string
  }>()

  // Parsear el objeto completo del equipo o usar valores por defecto
  let equipmentData: EquipmentData
  
  try {
    equipmentData = params.equipmentData 
      ? JSON.parse(params.equipmentData as string)
      : {
          id: 0,
          sn_equipo: 'N/A',
          marca: 'N/A',
          color: 'N/A',
          tipo_elemento: 'Equipo no seleccionado',
          descripcion: 'Sin descripción disponible',
          qr_hash: 'NO_DATA',
          path_foto_equipo_implemento: 'https://via.placeholder.com/120x120/6B7280/FFFFFF?text=📦',
          elementos_adicionales: []
        }
  } catch {
    equipmentData = {
      id: 0,
      sn_equipo: 'N/A',
      marca: 'N/A',
      color: 'N/A',
      tipo_elemento: 'Equipo no seleccionado',
      descripcion: 'Sin descripción disponible',
      qr_hash: 'NO_DATA',
      path_foto_equipo_implemento: 'https://via.placeholder.com/120x120/6B7280/FFFFFF?text=📦',
      elementos_adicionales: []
    }
  }

  return (
    <ProtectedRoute>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ThemedView style={styles.container}>
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
            <TouchableOpacity 
              style={styles.homeButton} 
              onPress={() => router.push('/(limna-app)/(home)/' as any)}
            >
              <Ionicons name="home-outline" size={24} color="white" />
            </TouchableOpacity>
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
  homeButton: {
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