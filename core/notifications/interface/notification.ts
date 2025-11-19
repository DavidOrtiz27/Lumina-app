/**
 * Tipos de notificaciones push que la app puede recibir
 */
export type NotificationType = 
  | 'equipment_assigned'   // Equipo asignado al usuario
  | 'equipment_returned'   // Equipo devuelto
  | 'reminder'            // Recordatorio
  | 'alert'               // Alerta importante
  | 'general';            // Notificación general

/**
 * Estructura de una notificación push almacenada
 */
export interface PushNotification {
  id: number;
  title: string;
  body: string;
  data?: Record<string, any>;
  type: NotificationType;
  read: boolean;
  created_at: string;
}

/**
 * Token de Expo Push para un dispositivo
 */
export interface ExpoPushToken {
  token: string;
  device_id: string;
  platform: 'ios' | 'android';
}

/**
 * Respuesta del servidor al registrar un token
 */
export interface RegisterTokenResponse {
  success: boolean;
  message: string;
}

/**
 * Respuesta del servidor al obtener notificaciones
 */
export interface NotificationsResponse {
  data: PushNotification[];
}
