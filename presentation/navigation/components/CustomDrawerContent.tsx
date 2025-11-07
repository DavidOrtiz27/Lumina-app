import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useThemeColor } from '../../../hooks/use-theme-color'
import { useAuthStore } from '../../auth/store/useAuthStore'
import { useDrawer } from '../hooks/useDrawer'

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  onPress: () => void
  textColor: string
}

const MenuItem = ({ icon, title, onPress, textColor }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color={textColor} />
    <Text style={[styles.menuText, { color: textColor }]}>{title}</Text>
  </TouchableOpacity>
)

export const CustomDrawerContent = () => {
  const { closeDrawer } = useDrawer()
  const backgroundColor = useThemeColor({}, 'card')
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    router.replace('/auth/login')
  }

  const navigateToScreen = (screen: string) => {
    console.log(`Navigate to ${screen}`)
    closeDrawer()
    router.push(screen as any)
  }

  const navigateToHome = () => navigateToScreen('/(limna-app)/(home)/')
  const navigateToHistory = () => navigateToScreen('/(limna-app)/history/')
  const navigateToSettings = () => navigateToScreen('/(limna-app)/settings/')

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: user?.avatarUrl || 'https://via.placeholder.com/60x60.png?text=U'
            }}
            style={styles.avatar}
          />
        </View>
        <Text style={[styles.userName, { color: textColor }]}>
          {user?.fullName || 'Usuario'}
        </Text>
        <Text style={[styles.userEmail, { color: textColor }]}>
          {user?.email || 'usuario@email.com'}
        </Text>
        <Text style={[styles.userType, { color: textColor }]}>
          {user?.userType || 'Usuario'}
        </Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <MenuItem
          icon="home-outline"
          title="Inicio"
          onPress={navigateToHome}
          textColor={textColor}
        />
        <MenuItem
          icon="time-outline"
          title="Historial"
          onPress={navigateToHistory}
          textColor={textColor}
        />
        <MenuItem
          icon="settings-outline"
          title="Configuración"
          onPress={navigateToSettings}
          textColor={textColor}
        />
      </View>

      {/* Logout Button */}
      <View style={[styles.footer, { borderTopColor: borderColor }]}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E1E1E1',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Poppins-SemiBold',
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 5,
    fontFamily: 'Poppins-Regular',
  },
  userType: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    fontFamily: 'Poppins-Regular',
  },
  footer: {
    borderTopWidth: 1,
    padding: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#FF6B6B',
    fontFamily: 'Poppins-Regular',
  },
})