import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNotificationStore } from '../store/useNotificationStore';

interface NotificationBadgeProps {
  color?: string;
  size?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Badge que muestra el número de notificaciones no leídas
 * 
 * Uso:
 * ```tsx
 * <View>
 *   <Ionicons name="notifications" size={24} />
 *   <NotificationBadge />
 * </View>
 * ```
 */
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  color = '#FF3B30',
  size = 20,
  position = 'top-right'
}) => {
  const unreadCount = useNotificationStore(state => state.unreadCount);

  // No mostrar badge si no hay notificaciones no leídas
  if (unreadCount === 0) return null;

  const positionStyle = getPositionStyle(position);
  const displayCount = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <View style={[
      styles.badge, 
      positionStyle,
      { 
        backgroundColor: color,
        minWidth: size,
        height: size,
        borderRadius: size / 2,
      }
    ]}>
      <Text style={[
        styles.badgeText,
        { fontSize: size * 0.6 }
      ]}>
        {displayCount}
      </Text>
    </View>
  );
};

/**
 * Obtiene los estilos de posición según la prop position
 */
function getPositionStyle(position: NotificationBadgeProps['position']) {
  switch (position) {
    case 'top-right':
      return { top: -3, right: -6 };
    case 'top-left':
      return { top: -3, left: -6 };
    case 'bottom-right':
      return { bottom: -3, right: -6 };
    case 'bottom-left':
      return { bottom: -3, left: -6 };
    default:
      return { top: -3, right: -6 };
  }
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
