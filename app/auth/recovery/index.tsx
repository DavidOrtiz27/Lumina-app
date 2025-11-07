import { Colors } from '@/constants/theme'
import { resetPassword, sendRecoveryCode, verifyRecoveryCode, type RecoveryError, type RecoveryStep } from '@/core/auth/actions/auth-recovery-actions'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { PublicOnlyRoute } from '@/presentation/auth/components'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { ThemedView } from '@/presentation/theme/components/themed-view'
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

const RecoveryScreen = () => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  
  // Estados para los 3 pasos
  const [currentStep, setCurrentStep] = useState<RecoveryStep>('send-code')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recoveryToken, setRecoveryToken] = useState('')
  
  // Estados de error visual
  const [hasError, setHasError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [codeError, setCodeError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Limpiar errores visuales después de 3 segundos
  const clearErrors = () => {
    setTimeout(() => {
      setHasError(false)
      setEmailError(false)
      setCodeError(false)
      setPasswordError(false)
      setErrorMessage('')
    }, 3000)
  }

  // Manejar errores con validación visual
  const handleError = (error: RecoveryError) => {
    setHasError(true)
    setErrorMessage(error.message)
    
    if (error.field === 'email') {
      setEmailError(true)
    } else if (error.field === 'code') {
      setCodeError(true)  
    } else if (error.field === 'password') {
      setPasswordError(true)
    }
    
    clearErrors()
  }

  // Paso 1: Enviar código
  const handleSendCode = async () => {
    if (!email.trim()) {
      handleError({
        type: 'validation',
        message: 'Por favor ingresa tu email',
        field: 'email'
      })
      return
    }

    setIsLoading(true)
    
    const result = await sendRecoveryCode(email)
    
    if ('success' in result) {
      setCurrentStep('verify-code')
      setErrorMessage('Código enviado a tu email ✅')
      setHasError(false)
    } else {
      handleError(result)
    }
    
    setIsLoading(false)
  }

  // Paso 2: Verificar código
  const handleVerifyCode = async () => {
    if (!code.trim()) {
      handleError({
        type: 'validation',
        message: 'Por favor ingresa el código',
        field: 'code'
      })
      return
    }

    setIsLoading(true)
    
    const result = await verifyRecoveryCode(email, code)
    
    if ('success' in result) {
      setRecoveryToken(result.token)
      setCurrentStep('reset-password')
      setErrorMessage('Código verificado ✅')
      setHasError(false)
    } else {
      handleError(result)
    }
    
    setIsLoading(false)
  }

  // Paso 3: Restablecer contraseña
  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      handleError({
        type: 'validation',
        message: 'Por favor ingresa una nueva contraseña',
        field: 'password'
      })
      return
    }

    if (newPassword !== confirmPassword) {
      handleError({
        type: 'validation',
        message: 'Las contraseñas no coinciden',
        field: 'password'
      })
      return
    }

    setIsLoading(true)
    
    const result = await resetPassword(recoveryToken, newPassword)
    
    if ('success' in result) {
      setErrorMessage('¡Contraseña actualizada! ✅')
      setHasError(false)
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } else {
      handleError(result)
    }
    
    setIsLoading(false)
  }

  // Limpiar errores al escribir
  const handleEmailChange = (text: string) => {
    setEmail(text)
    if (hasError && emailError) {
      setHasError(false)
      setEmailError(false)
      if (!codeError && !passwordError) {
        setErrorMessage('')
      }
    }
  }

  const handleCodeChange = (text: string) => {
    setCode(text.toUpperCase())
    if (hasError && codeError) {
      setHasError(false)
      setCodeError(false)
      if (!emailError && !passwordError) {
        setErrorMessage('')
      }
    }
  }

  const handlePasswordChange = (text: string, field: 'new' | 'confirm') => {
    if (field === 'new') {
      setNewPassword(text)
    } else {
      setConfirmPassword(text)
    }
    
    if (hasError && passwordError) {
      setHasError(false)
      setPasswordError(false)
      if (!emailError && !codeError) {
        setErrorMessage('')
      }
    }
  }

  const navigateToLogin = () => {
    router.back()
  }

  // Títulos y subtítulos por paso
  const getStepContent = () => {
    switch (currentStep) {
      case 'send-code':
        return {
          title: 'Recuperar Contraseña',
          subtitle: 'Ingresa tu email y te enviaremos un código de 6 dígitos'
        }
      case 'verify-code':
        return {
          title: 'Verificar Código',
          subtitle: `Ingresa el código que enviamos a ${email}`
        }
      case 'reset-password':
        return {
          title: 'Nueva Contraseña',
          subtitle: 'Crea tu nueva contraseña'
        }
    }
  }

  const { title, subtitle } = getStepContent()

  return (
    <PublicOnlyRoute>
      <ThemedView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <ThemedText type="h1" style={styles.title}>
                {title}
              </ThemedText>
              
              <ThemedText type="body1" style={styles.subtitle}>
                {subtitle}
              </ThemedText>

              <View style={[styles.formContainer, { 
                backgroundColor: colors.card,
              }]}>
                <View style={styles.form}>
                {/* Paso 1: Enviar código */}
                {currentStep === 'send-code' && (
                  <>
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
                        <ThemedText style={[styles.errorText, { color: '#E53E3E' }]}>
                          {errorMessage || 'Email inválido'}
                        </ThemedText>
                      )}
                    </View>

                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: colors.primary }]}
                      onPress={handleSendCode}
                      disabled={isLoading}
                    >
                      <ThemedText type="button" style={styles.actionButtonText}>
                        {isLoading ? 'Enviando...' : 'Enviar Código'}
                      </ThemedText>
                    </TouchableOpacity>
                  </>
                )}

                {/* Paso 2: Verificar código */}
                {currentStep === 'verify-code' && (
                  <>
                    <View style={styles.inputContainer}>
                      <ThemedText type="body2" style={styles.label}>
                        Código de 6 dígitos
                      </ThemedText>
                      <TextInput
                        style={[
                          styles.input,
                          styles.codeInput,
                          { 
                            borderColor: codeError ? '#E53E3E' : colors.icon,
                            backgroundColor: colors.card,
                            color: colors.text,
                            borderWidth: codeError ? 2 : 1,
                          }
                        ]}
                        value={code}
                        onChangeText={handleCodeChange}
                        placeholder="ABC123"
                        placeholderTextColor={colors.icon}
                        maxLength={6}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        editable={!isLoading}
                      />
                      {codeError && (
                        <ThemedText style={[styles.errorText, { color: '#E53E3E' }]}>
                          {errorMessage || 'Código inválido'}
                        </ThemedText>
                      )}
                    </View>

                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: colors.primary }]}
                      onPress={handleVerifyCode}
                      disabled={isLoading}
                    >
                      <ThemedText type="button" style={styles.actionButtonText}>
                        {isLoading ? 'Verificando...' : 'Verificar Código'}
                      </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.secondaryButton}
                      onPress={() => setCurrentStep('send-code')}
                      disabled={isLoading}
                    >
                      <ThemedText type="body2" style={[styles.secondaryButtonText, { color: colors.primary }]}>
                        Enviar nuevo código
                      </ThemedText>
                    </TouchableOpacity>
                  </>
                )}

                {/* Paso 3: Nueva contraseña */}
                {currentStep === 'reset-password' && (
                  <>
                    <View style={styles.inputContainer}>
                      <ThemedText type="body2" style={styles.label}>
                        Nueva Contraseña
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
                        value={newPassword}
                        onChangeText={(text) => handlePasswordChange(text, 'new')}
                        placeholder="Mínimo 8 caracteres"
                        placeholderTextColor={colors.icon}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isLoading}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <ThemedText type="body2" style={styles.label}>
                        Confirmar Contraseña
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
                        value={confirmPassword}
                        onChangeText={(text) => handlePasswordChange(text, 'confirm')}
                        placeholder="Confirma tu contraseña"
                        placeholderTextColor={colors.icon}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isLoading}
                      />
                      {passwordError && (
                        <ThemedText style={[styles.errorText, { color: '#E53E3E' }]}>
                          {errorMessage || 'Error en contraseña'}
                        </ThemedText>
                      )}
                    </View>

                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: colors.primary }]}
                      onPress={handleResetPassword}
                      disabled={isLoading}
                    >
                      <ThemedText type="button" style={styles.actionButtonText}>
                        {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                      </ThemedText>
                    </TouchableOpacity>
                  </>
                )}

                {/* Mensaje de éxito o error */}
                {errorMessage && !hasError && (
                  <ThemedText style={[styles.successText, { color: colors.primary }]}>
                    {errorMessage}
                  </ThemedText>
                )}

                {/* Botón para volver */}
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={navigateToLogin}
                  disabled={isLoading}
                >
                  <ThemedText type="body2" style={[styles.backText, { color: colors.primary }]}>
                    Volver al inicio de sesión
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
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
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
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  actionButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  codeInput: {
    textAlign: 'center',
    letterSpacing: 4,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-Bold',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  recoveryButton: {
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  recoveryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backText: {
    fontSize: 14,
  },
})

export default RecoveryScreen