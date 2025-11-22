import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PublicOnlyRoute } from '@/presentation/auth/components';
import {
  ResetPasswordStep,
  SendCodeStep,
  VerifyCodeStep,
} from '@/presentation/auth/recovery/components';
import { useRecoveryStore } from '@/presentation/auth/store/useRecoveryStore';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import { ThemedView } from '@/presentation/theme/components/themed-view';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const RecoveryScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const {
    currentStep,
    email,
    code,
    newPassword,
    confirmPassword,
    isLoading,
    error,
    setStep,
    setEmail,
    setCode,
    setNewPassword,
    setConfirmPassword,
    sendCode,
    verifyCode,
    resetPassword: resetPasswordAction,
    resetState,
    clearErrors,
  } = useRecoveryStore();

  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Reset state when the component unmounts
    return () => {
      resetState();
    };
  }, [resetState]);

  const handleResetPassword = async () => {
    const success = await resetPasswordAction();
    if (success) {
      setSuccessMessage('¡Contraseña actualizada correctamente! Serás redirigido al inicio de sesión.');
      setTimeout(() => {
        router.replace('/auth/login');
      }, 2500);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) {
      clearErrors();
    }
  };

  const handleCodeChange = (text: string) => {
    setCode(text.toUpperCase());
    if (error) {
      clearErrors();
    }
  };

  const handlePasswordChange = (text: string, field: 'new' | 'confirm') => {
    if (field === 'new') {
        setNewPassword(text);
    } else {
        setConfirmPassword(text);
    }
    if (error) {
        clearErrors();
    }
  }


  const getStepContent = () => {
    switch (currentStep) {
      case 'send-code':
        return {
          title: 'Recuperar Contraseña',
          subtitle: 'Ingresa tu email y te enviaremos un código.',
        };
      case 'verify-code':
        return {
          title: 'Verificar Código',
          subtitle: `Ingresa el código de 6 dígitos que enviamos a ${email}`,
        };
      case 'reset-password':
        return {
          title: 'Nueva Contraseña',
          subtitle: 'Crea tu nueva contraseña.',
        };
    }
  };

  const { title, subtitle } = getStepContent();

  const renderStep = () => {
    switch (currentStep) {
      case 'send-code':
        return (
          <SendCodeStep
            email={email}
            onEmailChange={handleEmailChange}
            onSendCode={sendCode}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'verify-code':
        return (
          <VerifyCodeStep
            code={code}
            onCodeChange={handleCodeChange}
            onVerifyCode={verifyCode}
            onGoBack={() => setStep('send-code')}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordStep
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onNewPasswordChange={(text) => handlePasswordChange(text, 'new')}
            onConfirmPasswordChange={(text) => handlePasswordChange(text, 'confirm')}
            onResetPassword={handleResetPassword}
            isLoading={isLoading}
            error={error}
          />
        );
    }
  };

  return (
    <PublicOnlyRoute>
      <ThemedView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('@/assets/images/lumina.svg')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <ThemedText type="h1" style={styles.title}>
                {title}
              </ThemedText>
              
              <ThemedText type="body1" style={styles.subtitle}>
                {subtitle}
              </ThemedText>

              <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
                {successMessage ? (
                  <ThemedText style={[styles.successText, { color: colors.primary }]}>
                    {successMessage}
                  </ThemedText>
                ) : (
                  renderStep()
                )}
              </View>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                disabled={isLoading}
              >
                <ThemedText type="body2" style={[styles.backText, { color: colors.primary }]}>
                  Volver al inicio de sesión
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    </PublicOnlyRoute>
  );
};

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
  successText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  backText: {
    fontSize: 14,
  },
});

export default RecoveryScreen;