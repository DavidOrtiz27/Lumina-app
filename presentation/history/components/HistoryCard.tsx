import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import type { HistoryEntry } from '../types'

interface HistoryCardProps {
  entry: HistoryEntry
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ entry }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return {
      date: date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const isInUse = !entry.salida
  const ingreso = formatDateTime(entry.ingreso)
  const salida = entry.salida ? formatDateTime(entry.salida) : null

  return (
    <View style={[styles.card, { 
      backgroundColor: colors.card, 
      borderColor: colors.border,
      borderLeftColor: isInUse ? colors.primary : '#10B981',
      borderLeftWidth: 4,
    }]}>
      {/* Badge de estado */}
      <View style={[styles.statusBadge, { 
        backgroundColor: isInUse ? colors.primary : '#10B981'
      }]}>
        <Ionicons 
          name={isInUse ? "time" : "checkmark-circle"} 
          size={12} 
          color="white" 
        />
        <ThemedText style={styles.statusText}>
          {isInUse ? 'En uso' : 'Devuelto'}
        </ThemedText>
      </View>

      {/* Información del equipo */}
      <View style={styles.equipmentSection}>
        <View style={styles.equipmentImageContainer}>
          <Image
            source={{ uri: entry.equipo.path_foto_equipo_implemento }}
            style={styles.equipmentImage}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.equipmentInfo}>
          <ThemedText type="body1" style={styles.equipmentName}>
            {entry.equipo.tipo_elemento}
          </ThemedText>
          <ThemedText type="body2" style={styles.equipmentBrand}>
            {entry.equipo.marca} - {entry.equipo.color}
          </ThemedText>
          <ThemedText type="body2" style={styles.equipmentSerial}>
            SN: {entry.equipo.sn_equipo}
          </ThemedText>
        </View>
      </View>

      {/* Separador */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Fechas y horas */}
      <View style={styles.timesSection}>
        {/* Ingreso */}
        <View style={styles.timeBlock}>
          <View style={styles.timeHeader}>
            <Ionicons name="log-in-outline" size={16} color={colors.primary} />
            <ThemedText type="body2" style={[styles.timeLabel, { color: colors.primary }]}>
              Ingreso
            </ThemedText>
          </View>
          <ThemedText type="body2" style={styles.dateText}>
            📅 {ingreso.date}
          </ThemedText>
          <ThemedText type="body2" style={styles.timeText}>
            🕐 {ingreso.time}
          </ThemedText>
        </View>

        {/* Salida */}
        <View style={styles.timeBlock}>
          <View style={styles.timeHeader}>
            <Ionicons 
              name="log-out-outline" 
              size={16} 
              color={isInUse ? colors.icon : '#10B981'} 
            />
            <ThemedText type="body2" style={[styles.timeLabel, { 
              color: isInUse ? colors.icon : '#10B981'
            }]}>
              Salida
            </ThemedText>
          </View>
          {salida ? (
            <>
              <ThemedText type="body2" style={styles.dateText}>
                📅 {salida.date}
              </ThemedText>
              <ThemedText type="body2" style={styles.timeText}>
                🕐 {salida.time}
              </ThemedText>
            </>
          ) : (
            <ThemedText type="body2" style={styles.pendingText}>
              - - -
            </ThemedText>
          )}
        </View>
      </View>

      {/* Elementos adicionales (si existen) */}
      {entry.equipo.elementos_adicionales && entry.equipo.elementos_adicionales.length > 0 && (
        <View style={styles.additionalSection}>
          <View style={[styles.additionalDivider, { backgroundColor: colors.border }]} />
          <View style={styles.additionalHeader}>
            <Ionicons name="cube-outline" size={14} color={colors.icon} />
            <ThemedText type="body2" style={styles.additionalLabel}>
              Elementos adicionales ({entry.equipo.elementos_adicionales.length})
            </ThemedText>
          </View>
          <View style={styles.additionalList}>
            {entry.equipo.elementos_adicionales.map((elemento) => (
              <View key={elemento.id} style={styles.additionalItem}>
                <Ionicons name="checkmark" size={12} color={colors.primary} />
                <ThemedText type="body2" style={styles.additionalText}>
                  {elemento.nombre_elemento}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  equipmentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  equipmentImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  equipmentImage: {
    width: '100%',
    height: '100%',
  },
  equipmentInfo: {
    flex: 1,
    gap: 2,
  },
  equipmentName: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  equipmentBrand: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    opacity: 0.7,
  },
  equipmentSerial: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    opacity: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  timesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timeBlock: {
    flex: 1,
    gap: 4,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    opacity: 0.8,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  pendingText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    opacity: 0.4,
    textAlign: 'center',
    marginTop: 8,
  },
  additionalSection: {
    marginTop: 8,
  },
  additionalDivider: {
    height: 1,
    marginBottom: 8,
  },
  additionalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  additionalLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    opacity: 0.7,
  },
  additionalList: {
    gap: 3,
  },
  additionalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  additionalText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    opacity: 0.6,
  },
})