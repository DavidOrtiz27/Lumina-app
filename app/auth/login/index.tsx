import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { PublicOnlyRoute } from '@/presentation/auth/components'
import { useAuthStore } from '@/presentation/auth/store/useAuthStore'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

const LoginScreen = () => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const { login } = useAuthStore()

  // Función para limpiar errores visuales
  const clearErrors = () => {
    setHasError(false)
    setEmailError(false)
    setPasswordError(false)
    setErrorMessage('')
  }

  // Función para mostrar errores visuales en los inputs
  const showInputErrors = (type: 'credentials' | 'empty') => {
    if (type === 'credentials') {
      setHasError(true)
      setEmailError(true)
      setPasswordError(true)
    } else if (type === 'empty') {
      const emailEmpty = !email.trim()
      const passwordEmpty = !password.trim()
      
      setEmailError(emailEmpty)
      setPasswordError(passwordEmpty)
      setHasError(emailEmpty || passwordEmpty)
    }
  }

  const handleLogin = async () => {
    // Limpiar errores previos
    clearErrors()

    if (!email.trim() || !password.trim()) {
      showInputErrors('empty')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await login(email.trim(), password)
      
      if (result.success) {
        // La navegación se manejará automáticamente por el layout principal
        router.replace('/(limna-app)/(home)')
      } else if (result.error) {
        // Manejar diferentes tipos de error solo con visualización
        switch (result.error.type) {
          case 'INVALID_CREDENTIALS':
            // Solo mostrar error visual en los inputs con mensaje específico
            showInputErrors('credentials')
            setErrorMessage(result.error.message)
            break;
            
          case 'NETWORK_ERROR':
            // Solo mostrar error visual para problemas de red
            showInputErrors('credentials')
            setErrorMessage('Problema de conexión. Verifica tu internet.')
            break;
            
          case 'SERVER_ERROR':
            // Mostrar error visual en inputs para errores del servidor
            showInputErrors('credentials')
            setErrorMessage('Error del servidor. Intenta más tarde.')
            break;
            
          default:
            // Para errores desconocidos, solo mostrar error visual
            showInputErrors('credentials')
            setErrorMessage('Error inesperado. Intenta de nuevo.')
        }
      } else {
        // Fallback - solo error visual
        showInputErrors('credentials')
      }
    } catch (error: any) {
      // Solo mostrar error visual para errores inesperados
      showInputErrors('credentials')
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToRecovery = () => {
    router.push('/auth/recovery')
  }

  // Manejar cambio de email y limpiar errores
  const handleEmailChange = (text: string) => {
    setEmail(text)
    if (hasError && emailError) {
      setEmailError(false)
      if (!passwordError || password.trim()) {
        setHasError(false)
        setErrorMessage('')
      }
    }
  }

  // Manejar cambio de contraseña y limpiar errores
  const handlePasswordChange = (text: string) => {
    setPassword(text)
    if (hasError && passwordError) {
      setPasswordError(false)
      if (!emailError || email.trim()) {
        setHasError(false)
        setErrorMessage('')
      }
    }
  }

  return (
    <PublicOnlyRoute>
      <ThemedView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Logo SVG */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/lumina.svg')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            
            <ThemedText type="h1" style={styles.title}>
              LUMINA
            </ThemedText>
            
            <ThemedText type="body1" style={styles.subtitle}>
              Inicia sesión en tu cuenta
            </ThemedText>
            
            <View style={[styles.formContainer, { 
              backgroundColor: colors.card,
            }]}>
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <ThemedText type="body2" style={styles.label}>
                    Email
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        borderColor: emailError ? '#E53E3E' : colors.icon,
                        backgroundColor: colors.card,
                        color: colors.text,
                        borderWidth: emailError ? 2 : 1,
                      }
                    ]}
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="tu@email.com"
                    placeholderTextColor={colors.icon}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  {emailError && (
                    <ThemedText type="body2" style={styles.errorText}>
                      {!email.trim() 
                        ? 'El email es requerido' 
                        : hasError && errorMessage && errorMessage.includes('contraseña')
                          ? 'Email o contraseña incorrectos'
                          : 'Email o contraseña incorrectos'
                      }
                    </ThemedText>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <ThemedText type="body2" style={styles.label}>
                    Contraseña
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        borderColor: passwordError ? '#E53E3E' : colors.icon,
                        backgroundColor: colors.card,
                        color: colors.text,
                        borderWidth: passwordError ? 2 : 1,
                      }
                    ]}
                    value={password}
                    onChangeText={handlePasswordChange}
                    placeholder="Tu contraseña"
                    placeholderTextColor={colors.icon}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  {passwordError && (
                    <ThemedText type="body2" style={styles.errorText}>
                      {!password.trim() 
                        ? 'La contraseña es requerida' 
                        : hasError && errorMessage
                          ? errorMessage
                          : hasError 
                            ? 'Verifica que tu contraseña tenga: mínimo 6 caracteres, mayúsculas, minúsculas y números'
                            : 'Email o contraseña incorrectos'
                      }
                    </ThemedText>
                  )}
                </View>

                <TouchableOpacity 
                  style={[styles.loginButton, { backgroundColor: colors.primary }]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <ThemedText type="button" style={styles.loginButtonText}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.recoveryButton}
                  onPress={navigateToRecovery}
                  disabled={isLoading}
                >
                  <ThemedText type="body2" style={[styles.recoveryText, { color: colors.primary }]}>
                    ¿Olvidaste tu contraseña?
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView> 
      </KeyboardAvoidingView>
    </ThemedView>
    </PublicOnlyRoute>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  recoveryButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  recoveryText: {
    fontSize: 14,
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
})

export default LoginScreen