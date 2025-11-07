import { useState } from 'react';

interface AlertConfig {
  title: string;
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  buttons?: Array<{
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
  }>;
}

export function useCustomAlert() {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = (config: AlertConfig) => {
    setAlertConfig(config);
    setIsVisible(true);
  };

  const hideAlert = () => {
    setIsVisible(false);
    setTimeout(() => {
      setAlertConfig(null);
    }, 200); // Esperar a que termine la animación
  };

  // Métodos de conveniencia para diferentes tipos de alertas
  const showError = (title: string, message: string, buttons?: AlertConfig['buttons']) => {
    showAlert({
      title,
      message,
      type: 'error',
      buttons: buttons || [{ text: 'OK' }]
    });
  };

  const showWarning = (title: string, message: string, buttons?: AlertConfig['buttons']) => {
    showAlert({
      title,
      message,
      type: 'warning',
      buttons: buttons || [{ text: 'OK' }]
    });
  };

  const showSuccess = (title: string, message: string, buttons?: AlertConfig['buttons']) => {
    showAlert({
      title,
      message,
      type: 'success',
      buttons: buttons || [{ text: 'OK' }]
    });
  };

  const showInfo = (title: string, message: string, buttons?: AlertConfig['buttons']) => {
    showAlert({
      title,
      message,
      type: 'info',
      buttons: buttons || [{ text: 'OK' }]
    });
  };

  return {
    alertConfig,
    isVisible,
    showAlert,
    hideAlert,
    showError,
    showWarning,
    showSuccess,
    showInfo
  };
}