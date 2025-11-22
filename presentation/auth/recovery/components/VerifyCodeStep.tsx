import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface VerifyCodeStepProps {
  code: string;
  onCodeChange: (code: string) => void;
  onVerifyCode: () => void;
  onGoBack: () => void;
  isLoading: boolean;
  error?: {
    field?: string;
    message: string;
  };
}

export const VerifyCodeStep: React.FC<VerifyCodeStepProps> = ({
  code,
  onCodeChange,
  onVerifyCode,
  onGoBack,
  isLoading,
  error,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const codeError = error?.field === 'code';

  return (
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
              borderColor: codeError ? colors.destructive : colors.border,
              backgroundColor: colors.card,
              color: colors.text,
              borderWidth: codeError ? 2 : 1,
            },
          ]}
          value={code}
          onChangeText={onCodeChange}
          placeholder="123456"
          placeholderTextColor={colors.icon}
          maxLength={6}
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />
        {codeError && (
          <ThemedText style={[styles.errorText, { color: colors.destructive }]}>
            {error?.message || 'Código inválido'}
          </ThemedText>
        )}
      </View>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={onVerifyCode}
        disabled={isLoading}
      >
        <ThemedText type="button" style={styles.actionButtonText}>
          {isLoading ? 'Verificando...' : 'Verificar Código'}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onGoBack}
        disabled={isLoading}
      >
        <ThemedText type="body2" style={[styles.secondaryButtonText, { color: colors.primary }]}>
          Cambiar Email
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
    codeInput: {
        textAlign: 'center',
        letterSpacing: 4,
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Poppins-Bold',
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
    errorText: {
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
    },
});