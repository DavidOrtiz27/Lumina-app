import { Equipment } from '@/core/equipment/interface/equipment'
import { useThemeColor } from '@/hooks/use-theme-color'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

interface EquipmentCardProps {
  equipment: Equipment
  onPress: (equipment: Equipment) => void
}

export const EquipmentCard = ({ equipment, onPress }: EquipmentCardProps) => {
  const backgroundColor = useThemeColor({}, 'card')
  const borderColor = useThemeColor({}, 'border')
  const textColor = useThemeColor({}, 'text')

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor, borderColor }]} 
      onPress={() => onPress(equipment)}
    >
      {/* Imagen del equipo - Izquierda */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: equipment.imageUrl }}
          style={styles.equipmentImage}
          resizeMode="cover"
        />
      </View>

      {/* Información del equipo - Centro */}
      <View style={styles.infoContainer}>
        <ThemedText type="h4" style={[styles.equipmentName, { color: textColor }]}>
          {equipment.name}
        </ThemedText>
        <ThemedText type="body2" style={[styles.equipmentSerial, { color: textColor, opacity: 0.7 }]}>
          Serial: {equipment.serial}
        </ThemedText>
      </View>

      {/* QR Code Placeholder - Derecha */}
      <View style={styles.qrContainer}>
        <View style={[styles.qrPlaceholder, { borderColor: textColor, opacity: 0.3 }]}>
          <ThemedText type="caption" style={{ opacity: 0.5 }}>QR</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    marginRight: 16,
  },
  equipmentImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  equipmentSerial: {
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'Poppins-Regular',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
})