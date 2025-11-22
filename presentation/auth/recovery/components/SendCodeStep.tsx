import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SendCodeStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSendCode: () => void;
  isLoading: boolean;
  error?: {
    field?: string;
    message: string;
  };
}

export const SendCodeStep: React.FC<SendCodeStepProps> = ({
  email,
  onEmailChange,
  onSendCode,
  isLoading,
  error,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const emailError = error?.field === 'email';

  return (
    <>
      <View style={styles.inputContainer}>
        <ThemedText type="body2" style={styles.label}>
          Email
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: emailError ? colors.destructive : colors.border,
              backgroundColor: colors.card,
              color: colors.text,
              borderWidth: emailError ? 2 : 1,
            },
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
          <ThemedText style={[styles.errorText, { color: colors.destructive }]}>
            {error?.message || 'Por favor ingresa un email válido'}
          </ThemedText>
        )}
      </View>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={onSendCode}
        disabled={isLoading}
      >
        <ThemedText type="button" style={styles.actionButtonText}>
          {isLoading ? 'Enviando...' : 'Enviar Código'}
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