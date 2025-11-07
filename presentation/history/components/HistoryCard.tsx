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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }



  return (
    <View style={[styles.card, { 
      backgroundColor: colors.card, 
      borderColor: colors.border 
    }]}>
      {/* Header con fecha, hora y estado */}
      <View style={styles.cardHeader}>
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.icon} />
            <ThemedText type="body2" style={styles.dateText}>
              {formatDate(entry.date)}
            </ThemedText>
          </View>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={16} color={colors.icon} />
            <ThemedText type="body2" style={styles.timeText}>
              {formatTime(entry.time)}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Información del equipo */}
      <View style={styles.equipmentSection}>
        <View style={styles.equipmentImageContainer}>
          <Image
            source={{ uri: entry.equipmentImage }}
            style={styles.equipmentImage}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.equipmentInfo}>
          <ThemedText type="body1" style={styles.equipmentName}>
            {entry.equipmentName}
          </ThemedText>
          <ThemedText type="body2" style={styles.equipmentType}>
            {entry.equipmentType}
          </ThemedText>
          
          {entry.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.icon} />
              <ThemedText type="body2" style={styles.locationText}>
                {entry.location}
              </ThemedText>
            </View>
          )}
          
          {entry.additionalInfo && (
            <View style={styles.additionalInfoRow}>
              <Ionicons name="information-circle-outline" size={14} color={colors.primary} />
              <ThemedText type="body2" style={[styles.additionalInfoText, { color: colors.primary }]}>
                {entry.additionalInfo}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dateTimeContainer: {
    gap: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    opacity: 0.8,
  },
  timeText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    opacity: 0.7,
  },

  equipmentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  equipmentImageContainer: {
    width: 50,
    height: 50,
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
    gap: 4,
  },
  equipmentName: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  equipmentType: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    opacity: 0.7,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    opacity: 0.6,
  },
  additionalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  additionalInfoText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
})