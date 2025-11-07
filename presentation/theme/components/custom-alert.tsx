import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import React from 'react';
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  buttons?: Array<{
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
  }>;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function CustomAlert({
  visible,
  title,
  message,
  type = 'info',
  buttons = [{ text: 'OK', style: 'default' }],
  onClose
}: CustomAlertProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getTypeConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: '❌',
          titleColor: '#E53E3E',
          borderColor: '#E53E3E20'
        };
      case 'warning':
        return {
          icon: '⚠️',
          titleColor: '#D69E2E',
          borderColor: '#D69E2E20'
        };
      case 'success':
        return {
          icon: '✅',
          titleColor: '#38A169',
          borderColor: '#38A16920'
        };
      default:
        return {
          icon: 'ℹ️',
          titleColor: colors.primary,
          borderColor: colors.primary + '20'
        };
    }
  };

  const typeConfig = getTypeConfig();

  const handleButtonPress = (button: typeof buttons[0]) => {
    if (button.onPress) {
      button.onPress();
    }
    onClose();
  };

  const getButtonStyle = (buttonStyle: string) => {
    switch (buttonStyle) {
      case 'destructive':
        return {
          backgroundColor: '#E53E3E',
          color: 'white'
        };
      case 'cancel':
        return {
          backgroundColor: 'transparent',
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.icon
        };
      default:
        return {
          backgroundColor: colors.primary,
          color: 'white'
        };
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.alertContainer, 
          { 
            backgroundColor: colors.background,
            borderColor: typeConfig.borderColor
          }
        ]}>
          {/* Header con icono y título */}
          <View style={styles.header}>
            <ThemedText style={styles.icon}>
              {typeConfig.icon}
            </ThemedText>
            <ThemedText 
              type="h4" 
              style={[styles.title, { color: typeConfig.titleColor }]}
            >
              {title}
            </ThemedText>
          </View>

          {/* Mensaje */}
          <View style={styles.messageContainer}>
            <ThemedText type="body1" style={styles.message}>
              {message}
            </ThemedText>
          </View>

          {/* Botones */}
          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => {
              const buttonStyleConfig = getButtonStyle(button.style || 'default');
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    {
                      backgroundColor: buttonStyleConfig.backgroundColor,
                      borderWidth: buttonStyleConfig.borderWidth || 0,
                      borderColor: buttonStyleConfig.borderColor,
                      marginLeft: index > 0 ? 12 : 0
                    }
                  ]}
                  onPress={() => handleButtonPress(button)}
                >
                  <ThemedText 
                    type="button" 
                    style={[
                      styles.buttonText,
                      { color: buttonStyleConfig.color }
                    ]}
                  >
                    {button.text}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: Math.min(screenWidth * 0.85, 400),
    borderRadius: 20,
    borderWidth: 2,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
  },
  messageContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});