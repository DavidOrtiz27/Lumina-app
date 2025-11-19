import luminaApi from '@/core/auth/api/luminaApi';
import type {
    ExpoPushToken,
    NotificationsResponse,
    PushNotification,
    RegisterTokenResponse
} from '../interface/notification';

/**
 * Registra el token de notificaciones push del dispositivo en el backend
 */
export const registerPushToken = async (tokenData: ExpoPushToken): Promise<RegisterTokenResponse> => {
  try {
    const { data } = await luminaApi.post<RegisterTokenResponse>('/usuario/push-token', tokenData);
    console.log('✅ Push token registrado en el servidor');
    return data;
  } catch (error) {
    console.error('❌ Error registrando push token:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de notificaciones del usuario
 */
export const getNotifications = async (): Promise<PushNotification[]> => {
  try {
    const { data } = await luminaApi.get<NotificationsResponse>('/usuario/notifications');
    return data.data;
  } catch (error) {
    console.error('❌ Error obteniendo notificaciones:', error);
    throw error;
  }
};

/**
 * Marca una notificación como leída
 */
export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  try {
    await luminaApi.patch(`/usuario/notifications/${notificationId}/read`);
    console.log(`✅ Notificación ${notificationId} marcada como leída`);
  } catch (error) {
    console.error('❌ Error marcando notificación como leída:', error);
    throw error;
  }
};

/**
 * Marca todas las notificaciones como leídas
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await luminaApi.patch('/usuario/notifications/read-all');
    console.log('✅ Todas las notificaciones marcadas como leídas');
  } catch (error) {
    console.error('❌ Error marcando todas las notificaciones como leídas:', error);
    throw error;
  }
};

/**
 * Elimina una notificación
 */
export const deleteNotification = async (notificationId: number): Promise<void> => {
  try {
    await luminaApi.delete(`/usuario/notifications/${notificationId}`);
    console.log(`✅ Notificación ${notificationId} eliminada`);
  } catch (error) {
    console.error('❌ Error eliminando notificación:', error);
    throw error;
  }
};
