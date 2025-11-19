import type { PushNotification } from '@/core/notifications/interface/notification';
import { create } from 'zustand';

interface NotificationState {
  // Estado
  notifications: PushNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  setNotifications: (notifications: PushNotification[]) => void;
  addNotification: (notification: PushNotification) => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: number) => void;
  clearNotifications: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Store de Zustand para manejar el estado de las notificaciones push
 * 
 * Funcionalidades:
 * - Almacena lista de notificaciones
 * - Cuenta notificaciones no leídas
 * - Marca notificaciones como leídas
 * - Gestiona estado de carga y errores
 */
export const useNotificationStore = create<NotificationState>((set) => ({
  // Estado inicial
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  /**
   * Establece la lista completa de notificaciones
   * Actualiza automáticamente el contador de no leídas
   */
  setNotifications: (notifications) => set({ 
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    isLoading: false,
    error: null,
  }),

  /**
   * Agrega una nueva notificación al inicio de la lista
   * Incrementa el contador si no está leída
   */
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
  })),

  /**
   * Marca una notificación específica como leída
   * Decrementa el contador de no leídas
   */
  markAsRead: (notificationId) => set((state) => {
    const notification = state.notifications.find(n => n.id === notificationId);
    const wasUnread = notification && !notification.read;
    
    return {
      notifications: state.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ),
      unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    };
  }),

  /**
   * Marca todas las notificaciones como leídas
   * Resetea el contador a 0
   */
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0,
  })),

  /**
   * Elimina una notificación de la lista
   * Decrementa el contador si no estaba leída
   */
  removeNotification: (notificationId) => set((state) => {
    const notification = state.notifications.find(n => n.id === notificationId);
    const wasUnread = notification && !notification.read;
    
    return {
      notifications: state.notifications.filter(n => n.id !== notificationId),
      unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    };
  }),

  /**
   * Limpia todas las notificaciones
   * Resetea el estado completo
   */
  clearNotifications: () => set({ 
    notifications: [], 
    unreadCount: 0,
    error: null,
  }),

  /**
   * Establece el estado de carga
   */
  setLoading: (isLoading) => set({ isLoading }),

  /**
   * Establece un mensaje de error
   */
  setError: (error) => set({ error, isLoading: false }),
}));
