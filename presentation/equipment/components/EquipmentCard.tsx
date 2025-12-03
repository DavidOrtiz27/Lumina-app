import { getImageUrl } from '@/core/auth/api/imageUrl'; // Import getImageUrl
import { Equipment } from '@/core/equipment/interface/equipment'; // Import Equipment
import { useThemeColor } from '@/hooks/use-theme-color'; // Import useThemeColor
import { ForceLoadImage } from '@/presentation/shared/components/ForceLoadImage'; // Import ForceLoadImage
import { ThemedText } from '@/presentation/theme/components/themed-text'; // Import ThemedText
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// Imagen de fallback
const fallbackImg = require('@/assets/images/icon.png');

interface EquipmentCardProps {
  equipment: Equipment
  onPress: (equipment: Equipment) => void
}

export const EquipmentCard = ({ equipment, onPress }: EquipmentCardProps) => {
  const backgroundColor = useThemeColor({}, 'card')
  const borderColor = useThemeColor({}, 'border')
  const textColor = useThemeColor({}, 'text')


  let fullImageUrl = undefined;
  if (equipment.path_foto_equipo_implemento) {
    // Si ya es una URL completa, úsala directamente
    if (equipment.path_foto_equipo_implemento.startsWith('http')) {
      fullImageUrl = equipment.path_foto_equipo_implemento;
      console.log('[EQUIPO] Usando URL directa:', fullImageUrl);
    } else {
      fullImageUrl = getImageUrl(equipment.path_foto_equipo_implemento);
      console.log('[EQUIPO] Mostrando imagen de equipo:', fullImageUrl);
    }
  } else {
    console.log('[EQUIPO] Equipo sin imagen:', equipment.sn_equipo);
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor, borderColor }]}
      onPress={() => onPress(equipment)}
    >
      {/* Imagen del equipo - Izquierda */}
      <View style={styles.imageContainer}>
          {fullImageUrl ? (
            <ForceLoadImage
              uri={fullImageUrl}
              style={styles.equipmentImage}
              resizeMode="cover"
              onError={e => {
                console.log('[EquipmentCard] Error cargando imagen:', e);
                console.log('[EquipmentCard] URL que falló:', fullImageUrl);
              }}
              onLoad={() => console.log('[EquipmentCard] ✅ Imagen cargada exitosamente')}
              fallback={
                <View style={[styles.equipmentImage, { backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }]}> 
                  <ThemedText style={{fontSize: 10}}>No Image</ThemedText>
                </View>
              }
            />
          ) : (
            <View style={[styles.equipmentImage, { backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }]}> 
              <ThemedText style={{fontSize: 10}}>No Image</ThemedText>
            </View>
          )}
      </View>

      {/* Información del equipo - Centro */}
      <View style={styles.infoContainer}>
        <ThemedText type="h4" style={[styles.equipmentName, { color: textColor }]}>
          {equipment.tipo_elemento || 'Sin tipo'}
        </ThemedText>
        <ThemedText type="body2" style={[styles.equipmentBrand, { color: textColor, opacity: 0.8 }]}>
          {equipment.marca || 'Sin marca'} - {equipment.color || 'Sin color'}
        </ThemedText>
        <ThemedText type="body2" style={[styles.equipmentSerial, { color: textColor, opacity: 0.7 }]}>
          SN: {equipment.sn_equipo || 'N/A'}
        </ThemedText>
      </View>

      {/* QR Code - Derecha */}
      <View style={styles.qrContainer}>
        <View style={[styles.qrPlaceholder, { borderColor: textColor }]}> 
          {!equipment.qr_hash ? (
            <ActivityIndicator size="small" color={textColor} />
          ) : (
            <QRCode
              value={equipment.qr_hash}
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
  noImagePlaceholder: {
    backgroundColor: '#E0E0E0', // Light grey background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
  }
})