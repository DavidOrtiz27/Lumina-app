import { Colors } from '@/constants/theme';
import { markAllNotificationsAsRead, markNotificationAsRead } from '@/core/notifications/actions/notification-actions';
import type { PushNotification } from '@/core/notifications/interface/notification';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { sendTestPushNotification, useNotifications } from '@/presentation/notifications/hooks/useNotifications';
import { useNotificationStore } from '@/presentation/notifications/store/useNotificationStore';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import { ThemedView } from '@/presentation/theme/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Pantalla de ejemplo para demostrar el sistema de notificaciones
 * 
 * Puedes copiar partes de este componente en tu app según necesites
 */
export default function NotificationsExampleScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { expoPushToken } = useNotifications();
  const { 
    notifications, 
    unreadCount, 
    markAsRead: markAsReadInStore,
    markAllAsRead: markAllAsReadInStore,
  } = useNotificationStore();

  const handleSendTestNotification = async () => {
    if (expoPushToken) {
      await sendTestPushNotification(expoPushToken);
      alert('✅ Notificación de prueba enviada!');
    } else {
      alert('⚠️ No hay push token disponible');
    }
  };

  const handleMarkAsRead = async (notification: PushNotification) => {
    try {
      await markNotificationAsRead(notification.id);
      markAsReadInStore(notification.id);
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      markAllAsReadInStore();
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  const getNotificationIcon = (type: PushNotification['type']) => {
    switch (type) {
      case 'equipment_assigned':
        return 'briefcase';
      case 'equipment_returned':
        return 'checkmark-circle';
      case 'reminder':
        return 'time';
      case 'alert':
        return 'warning';
      default:
        return 'notifications';
    }
  };

  const renderNotification = ({ item }: { item: PushNotification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: item.read ? 0.6 : 1,
        },
      ]}
      onPress={() => !item.read && handleMarkAsRead(item)}
    >
      <View style={styles.notificationHeader}>
        <Ionicons
          name={getNotificationIcon(item.type) as any}
          size={24}
          color={colors.primary}
        />
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.notificationBody, { color: colors.text }]}>
            {item.body}
          </Text>
          <Text style={[styles.notificationDate, { color: colors.border }]}>
            {new Date(item.created_at).toLocaleString('es-ES')}
          </Text>
        </View>
        {!item.read && (
          <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="h1">🔔 Notificaciones</ThemedText>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Sistema de Push Notifications
          </Text>
        </View>

        {/* Push Token Info */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText type="h3">📱 Estado del Sistema</ThemedText>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.text }]}>Push Token:</Text>
            <Text style={[styles.value, { color: colors.border }]} numberOfLines={1}>
              {expoPushToken || 'No disponible'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.text }]}>No leídas:</Text>
            <Text style={[styles.value, { color: colors.primary }]}>
              {unreadCount}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.text }]}>Total:</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {notifications.length}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSendTestNotification}
          >
            <Ionicons name="send" size={20} color="white" />
            <Text style={styles.buttonText}>Enviar Notificación de Prueba</Text>
          </TouchableOpacity>

          {unreadCount > 0 && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#10B981' }]}
              onPress={handleMarkAllAsRead}
            >
              <Ionicons name="checkmark-done" size={20} color="white" />
              <Text style={styles.buttonText}>Marcar Todas como Leídas</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications List */}
        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            📋 Historial de Notificaciones
          </ThemedText>
          
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off" size={48} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.border }]}>
                No hay notificaciones
              </Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderNotification}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          )}
        </View>

        {/* Integration Instructions */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText type="h3">💡 Cómo Integrar</ThemedText>
          <Text style={[styles.instruction, { color: colors.text }]}>
            1. El sistema ya está integrado en AuthProvider
          </Text>
          <Text style={[styles.instruction, { color: colors.text }]}>
            2. Usa NotificationBadge en tu header
          </Text>
          <Text style={[styles.instruction, { color: colors.text }]}>
            3. Accede al store con useNotificationStore()
          </Text>
          <Text style={[styles.instruction, { color: colors.text }]}>
            4. Configura el backend para enviar notificaciones
          </Text>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  notificationCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  instruction: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
});
