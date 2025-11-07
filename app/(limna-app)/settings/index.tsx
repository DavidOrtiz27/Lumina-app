import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ProtectedRoute } from '@/presentation/auth/components'
import { useAuthStore } from '@/presentation/auth/store/useAuthStore'
import { useDrawer } from '@/presentation/navigation/hooks/useDrawer'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SettingsScreen = () => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const { user } = useAuthStore()
  const { openDrawer } = useDrawer()

  // Estados para configuraciones
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(false)
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark')
  const [autoSync, setAutoSync] = useState(true)

  const handleNotificationChange = (value: boolean) => {
    setNotifications(value)
    // Aquí implementarías la lógica para guardar la configuración
  }

  const handleBiometricChange = (value: boolean) => {
    setBiometric(value)
    // Aquí implementarías la lógica para configurar biométricos
  }

  const handleDarkModeChange = (value: boolean) => {
    setDarkMode(value)
    // Aquí implementarías la lógica para cambiar el tema
  }

  const handleAutoSyncChange = (value: boolean) => {
    setAutoSync(value)
    // Aquí implementarías la lógica para configurar sincronización
  }

  const handleClearCache = () => {
    Alert.alert(
      'Limpiar Cache',
      '¿Estás seguro de que quieres limpiar el cache de la aplicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          style: 'destructive',
          onPress: () => {
            // Implementar lógica para limpiar cache
            Alert.alert('Cache limpiado', 'El cache se ha limpiado correctamente')
          }
        }
      ]
    )
  }

  const handleResetSettings = () => {
    Alert.alert(
      'Resetear Configuración',
      '¿Estás seguro de que quieres resetear toda la configuración a valores por defecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Resetear', 
          style: 'destructive',
          onPress: () => {
            setNotifications(true)
            setBiometric(false)
            setDarkMode(false)
            setAutoSync(true)
            Alert.alert('Configuración reseteada', 'La configuración se ha reseteado correctamente')
          }
        }
      ]
    )
  }

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    value, 
    onValueChange, 
    type = 'switch' 
  }: {
    icon: keyof typeof Ionicons.glyphMap
    title: string
    description?: string
    value?: boolean
    onValueChange?: (value: boolean) => void
    type?: 'switch' | 'button'
  }) => (
    <View style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={colors.primary} />
        <View style={styles.settingInfo}>
          <ThemedText type="body1" style={styles.settingTitle}>
            {title}
          </ThemedText>
          {description && (
            <ThemedText type="body2" style={[styles.settingDescription, { color: colors.icon }]}>
              {description}
            </ThemedText>
          )}
        </View>
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={value ? 'white' : colors.icon}
        />
      )}
    </View>
  )

  const ActionButton = ({ 
    icon, 
    title, 
    description, 
    onPress, 
    color = colors.primary 
  }: {
    icon: keyof typeof Ionicons.glyphMap
    title: string
    description?: string
    onPress: () => void
    color?: string
  }) => (
    <TouchableOpacity 
      style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={24} color={color} />
      <View style={styles.actionInfo}>
        <ThemedText type="body1" style={[styles.actionTitle, { color }]}>
          {title}
        </ThemedText>
        {description && (
          <ThemedText type="body2" style={[styles.actionDescription, { color: colors.icon }]}>
            {description}
          </ThemedText>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.icon} />
    </TouchableOpacity>
  )

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
              Configuración
            </ThemedText>
            <View style={styles.menuButton} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Sección de Preferencias */}
            <View style={styles.section}>
              <ThemedText type="h3" style={styles.sectionTitle}>
                Preferencias
              </ThemedText>

              <SettingItem
                icon="notifications"
                title="Notificaciones"
                description="Recibir notificaciones de la aplicación"
                value={notifications}
                onValueChange={handleNotificationChange}
              />

              <SettingItem
                icon="finger-print"
                title="Autenticación Biométrica"
                description="Usar huella dactilar o Face ID"
                value={biometric}
                onValueChange={handleBiometricChange}
              />

              <SettingItem
                icon="moon"
                title="Modo Oscuro"
                description="Activar tema oscuro de la aplicación"
                value={darkMode}
                onValueChange={handleDarkModeChange}
              />

              <SettingItem
                icon="sync"
                title="Sincronización Automática"
                description="Sincronizar datos automáticamente"
                value={autoSync}
                onValueChange={handleAutoSyncChange}
              />
            </View>

            {/* Sección de Aplicación */}
            <View style={styles.section}>
              <ThemedText type="h3" style={styles.sectionTitle}>
                Aplicación
              </ThemedText>

              <ActionButton
                icon="trash"
                title="Limpiar Cache"
                description="Eliminar datos temporales"
                onPress={handleClearCache}
                color={colors.secondary}
              />

              <ActionButton
                icon="refresh"
                title="Resetear Configuración"
                description="Restaurar valores por defecto"
                onPress={handleResetSettings}
                color={colors.destructive}
              />
            </View>

            {/* Información de la App */}
            <View style={[styles.infoSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ThemedText type="h3" style={styles.sectionTitle}>
                Información de la Aplicación
              </ThemedText>
              
              <View style={styles.infoRow}>
                <ThemedText type="body2" style={[styles.infoLabel, { color: colors.icon }]}>
                  Versión:
                </ThemedText>
                <ThemedText type="body2" style={styles.infoValue}>
                  1.0.0
                </ThemedText>
              </View>

              <View style={styles.infoRow}>
                <ThemedText type="body2" style={[styles.infoLabel, { color: colors.icon }]}>
                  Build:
                </ThemedText>
                <ThemedText type="body2" style={styles.infoValue}>
                  2025.11.07
                </ThemedText>
              </View>

              <View style={styles.infoRow}>
                <ThemedText type="body2" style={[styles.infoLabel, { color: colors.icon }]}>
                  Usuario:
                </ThemedText>
                <ThemedText type="body2" style={styles.infoValue}>
                  {user?.fullName || 'No disponible'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingInfo: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Poppins-Medium',
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  actionInfo: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontFamily: 'Poppins-Medium',
    marginBottom: 2,
  },
  actionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  infoSection: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontFamily: 'Poppins-Regular',
  },
  infoValue: {
    fontFamily: 'Poppins-Medium',
  },
  bottomSpacing: {
    height: 40,
  },
})

export default SettingsScreen