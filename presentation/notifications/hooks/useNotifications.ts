import { registerPushToken } from '@/core/notifications/actions/notification-actions';
import type { ExpoPushToken } from '@/core/notifications/interface/notification';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

/**
 * Configurar cómo se manejan las notificaciones cuando la app está en primer plano
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Hook personalizado para manejar notificaciones push en la app
 * 
 * Funcionalidades:
 * - Solicita permisos de notificaciones
 * - Registra el token de Expo Push
 * - Escucha notificaciones entrantes
 * - Maneja interacciones del usuario con notificaciones
 * 
 * @param isAuthenticated - Si el usuario está autenticado (solo registra token si es true)
 */
export const useNotifications = (isAuthenticated: boolean = false) => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Solo registrar token si el usuario está autenticado
    if (!isAuthenticated) {
      console.log('⏸️ Usuario no autenticado - esperando para registrar notificaciones');
      return;
    }

    // Registrar token de push
    registerForPushNotificationsAsync()
      .then(token => {
        if (token) {
          setExpoPushToken(token);
          
          // Enviar token al backend
          const tokenData: ExpoPushToken = {
            token,
            device_id: Constants.deviceId || 'unknown',
            platform: Platform.OS as 'ios' | 'android',
          };
          
          registerPushToken(tokenData).catch(err => 
            console.error('❌ Error registrando token en el servidor:', err)
          );
        }
      })
      .catch((error: any) => {
        console.error('❌ Error al registrar notificaciones:', error);
        setExpoPushToken(`${error}`);
      });

    // Listener para notificaciones recibidas mientras la app está abierta
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notificación recibida:', notification);
      setNotification(notification);
    });

    // Listener para cuando el usuario toca una notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Usuario interactuó con la notificación:', response);
      
      const data = response.notification.request.content.data;
      
      // Aquí puedes manejar navegación basada en el tipo de notificación
      if (data?.type === 'equipment_assigned') {
        console.log('📦 Navegar a la pantalla de equipos');
        // TODO: Implementar navegación a la pantalla de equipos
      } else if (data?.type === 'equipment_returned') {
        console.log('📋 Navegar al historial');
        // TODO: Implementar navegación al historial
      } else if (data?.type === 'reminder') {
        console.log('⏰ Mostrar recordatorio');
      }
    });

    // Cleanup al desmontar
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [isAuthenticated]);

  return {
    expoPushToken,
    notification,
  };
};

/**
 * Maneja errores durante el registro de notificaciones
 */
function handleRegistrationError(errorMessage: string) {
  console.error('❌ Error de registro:', errorMessage);
  throw new Error(errorMessage);
}

/**
 * Registra el dispositivo para recibir notificaciones push
 * 
 * Proceso:
 * 1. Configura el canal de notificaciones en Android
 * 2. Verifica que sea un dispositivo físico
 * 3. Solicita permisos de notificaciones
 * 4. Obtiene el token de Expo Push
 */
async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  // Configurar canal de notificaciones en Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Verificar que sea un dispositivo físico
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // Solicitar permisos si no están otorgados
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    
    // Obtener el project ID de Expo
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      
      console.log('📱 Push Token obtenido:', pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

/**
 * Función auxiliar para enviar una notificación push de prueba
 * (Solo para desarrollo/testing)
 */
export async function sendTestPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: '🔔 Notificación de Prueba',
    body: 'Esta es una notificación de prueba desde Lumina App',
    data: { 
      type: 'general',
      someData: 'goes here' 
    },
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log('✅ Notificación de prueba enviada:', result);
  } catch (error) {
    console.error('❌ Error enviando notificación de prueba:', error);
  }
}
