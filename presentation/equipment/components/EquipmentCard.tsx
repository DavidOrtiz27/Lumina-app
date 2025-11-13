import { Equipment } from '@/core/equipment/interface/equipment'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useEquipmentQR } from '@/presentation/equipment/hooks/useEquipmentQR'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import React from 'react'
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

interface EquipmentCardProps {
  equipment: Equipment
  onPress: (equipment: Equipment) => void
}

export const EquipmentCard = ({ equipment, onPress }: EquipmentCardProps) => {
  const backgroundColor = useThemeColor({}, 'card')
  const borderColor = useThemeColor({}, 'border')
  const textColor = useThemeColor({}, 'text')
  
  // Usar el hook para generar el QR con hash SHA-256
  const { qrContent, isGenerating } = useEquipmentQR(equipment)

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor, borderColor }]} 
      onPress={() => onPress(equipment)}
    >
      {/* Imagen del equipo - Izquierda */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: equipment.path_foto_equipo_implemento }}
          style={styles.equipmentImage}
          resizeMode="cover"
        />
      </View>

      {/* Información del equipo - Centro */}
      <View style={styles.infoContainer}>
        <ThemedText type="h4" style={[styles.equipmentName, { color: textColor }]}>
          {equipment.tipo_elemento}
        </ThemedText>
        <ThemedText type="body2" style={[styles.equipmentBrand, { color: textColor, opacity: 0.8 }]}>
          {equipment.marca} - {equipment.color}
        </ThemedText>
        <ThemedText type="body2" style={[styles.equipmentSerial, { color: textColor, opacity: 0.7 }]}>
          SN: {equipment.sn_equipo}
        </ThemedText>
      </View>

      {/* QR Code - Derecha */}
      <View style={styles.qrContainer}>
        <View style={[styles.qrPlaceholder, { borderColor: textColor}]}>
          {isGenerating || !qrContent ? (
            <ActivityIndicator size="small" color={textColor} />
          ) : (
            <QRCode
              value={qrContent || 'Loading...'}
              size={60}
              color={textColor}
              backgroundColor={backgroundColor}
            />
          )}
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
  equipmentBrand: {
    fontSize: 13,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
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