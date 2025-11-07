import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

interface LoginFormProps {
  email: string
  password: string
  emailError: boolean
  passwordError: boolean
  hasError: boolean
  errorMessage: string
  isLoading: boolean
  onEmailChange: (text: string) => void
  onPasswordChange: (text: string) => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  emailError,
  passwordError,
  hasError,
  errorMessage,
  isLoading,
  onEmailChange,
  onPasswordChange,
}) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
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
            onChangeText={onEmailChange}
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
            onChangeText={onPasswordChange}
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
                  : 'Email o contraseña incorrectos'
              }
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontWeight: '500',
    opacity: 0.8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
})