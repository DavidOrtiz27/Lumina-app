import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ProtectedRoute } from '@/presentation/auth/components'
import { useAuthStore } from '@/presentation/auth/store/useAuthStore'
import { useDrawer } from '@/presentation/navigation/hooks/useDrawer'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const InfoScreen = () => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const { user } = useAuthStore()
  const { openDrawer } = useDrawer()

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible'
    return new Date(dateString).toLocaleDateString('es-ES')
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
              Información
            </ThemedText>
            <View style={styles.menuButton} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <View style={[styles.profileHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.avatarSection}>
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                  <Ionicons name="person" size={40} color="white" />
                </View>
                <View style={styles.profileInfo}>
                  <ThemedText type="h3" style={styles.fullName}>
                    {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
                  </ThemedText>
                  <ThemedText type="body2" style={[styles.userType, { color: colors.primary }]}>
                    {user?.role?.nombre_rol || 'Usuario'}
                  </ThemedText>
                  <View style={styles.statusBadge}>
                    <Ionicons 
                      name="checkmark-circle" 
                      size={16} 
                      color={colors.primary} 
                    />
                    <ThemedText 
                      type="body2" 
                      style={[
                        styles.statusText, 
                        { color: colors.primary }
                      ]}
                    >
                      Activo
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>

            {/* Personal Information */}
            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-circle" size={24} color={colors.primary} />
                <ThemedText type="h3" style={styles.sectionTitle}>
                  Información Personal
                </ThemedText>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoLabel}>
                  <Ionicons name="mail" size={16} color={colors.icon} />
                  <ThemedText type="body2" style={styles.labelText}>
                    Email
                  </ThemedText>
                </View>
                <ThemedText type="body1" style={styles.infoValue}>
                  {user?.email || 'No disponible'}
                </ThemedText>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoLabel}>
                  <Ionicons name="id-card" size={16} color={colors.icon} />
                  <ThemedText type="body2" style={styles.labelText}>
                    ID de Usuario
                  </ThemedText>
                </View>
                <ThemedText type="body1" style={styles.infoValue}>
                  {user?.id || 'No disponible'}
                </ThemedText>
              </View>
            </View>

            {/* Roles and Permissions */}
            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
                <ThemedText type="h3" style={styles.sectionTitle}>
                  Información Académica
                </ThemedText>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoLabel}>
                  <Ionicons name="school" size={16} color={colors.icon} />
                  <ThemedText type="body2" style={styles.labelText}>
                    Programa de Formación
                  </ThemedText>
                </View>
                <ThemedText type="body1" style={styles.infoValue}>
                  {user?.formacion?.nombre_programa || 'No disponible'}
                </ThemedText>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoLabel}>
                  <Ionicons name="key" size={16} color={colors.icon} />
                  <ThemedText type="body2" style={styles.labelText}>
                    Ficha
                  </ThemedText>
                </View>
                <ThemedText type="body1" style={styles.infoValue}>
                  {user?.formacion?.ficha || 'No especificada'}
                </ThemedText>
              </View>
            </View>

            {/* System Information */}
            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="settings" size={24} color={colors.primary} />
                <ThemedText type="h3" style={styles.sectionTitle}>
                  Información del Sistema
                </ThemedText>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoLabel}>
                  <Ionicons name="phone-portrait" size={16} color={colors.icon} />
                  <ThemedText type="body2" style={styles.labelText}>
                    Aplicación
                  </ThemedText>
                </View>
                <ThemedText type="body1" style={styles.infoValue}>
                  LUMINA v1.0.0
                </ThemedText>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoLabel}>
                  <Ionicons name="time" size={16} color={colors.icon} />
                  <ThemedText type="body2" style={styles.labelText}>
                    Última Actualización
                  </ThemedText>
                </View>
                <ThemedText type="body1" style={styles.infoValue}>
                  {formatDate(new Date().toISOString())}
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
  profileHeader: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  fullName: {
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  userType: {
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelText: {
    marginLeft: 8,
    fontFamily: 'Poppins-Medium',
    opacity: 0.7,
  },
  infoValue: {
    fontFamily: 'Poppins-Regular',
    paddingLeft: 24,
  },
  bottomSpacing: {
    height: 40,
  },
})

export default InfoScreen