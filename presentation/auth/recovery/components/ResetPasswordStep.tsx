import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ResetPasswordStepProps {
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onResetPassword: () => void;
  isLoading: boolean;
  error?: {
    field?: string;
    message: string;
  };
}

export const ResetPasswordStep: React.FC<ResetPasswordStepProps> = ({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onResetPassword,
  isLoading,
  error,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const passwordError = error?.field === 'password';

  return (
    <>
      <View style={styles.inputContainer}>
        <ThemedText type="body2" style={styles.label}>
          Nueva Contraseña
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: passwordError ? colors.destructive : colors.border,
              backgroundColor: colors.card,
              color: colors.text,
              borderWidth: passwordError ? 2 : 1,
            },
          ]}
          value={newPassword}
          onChangeText={onNewPasswordChange}
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
              borderColor: passwordError ? colors.destructive : colors.border,
              backgroundColor: colors.card,
              color: colors.text,
              borderWidth: passwordError ? 2 : 1,
            },
          ]}
          value={confirmPassword}
          onChangeText={onConfirmPasswordChange}
          placeholder="Confirma tu contraseña"
          placeholderTextColor={colors.icon}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />
        {passwordError && (
          <ThemedText style={[styles.errorText, { color: colors.destructive }]}>
            {error?.message || 'Error en contraseña'}
          </ThemedText>
        )}
      </View>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={onResetPassword}
        disabled={isLoading}
      >
        <ThemedText type="button" style={styles.actionButtonText}>
          {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </ThemedText>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
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
    errorText: {
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
    },
});