import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import type { EquipmentData } from '../types'

interface QRMainViewProps {
  equipmentData: EquipmentData
  onMoreInfo: () => void
}

export const QRMainView: React.FC<QRMainViewProps> = ({ equipmentData, onMoreInfo }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <View style={styles.content}>
      <View style={styles.qrSection}>
        <ThemedText type="h2" style={styles.title}>
          {equipmentData.name}
        </ThemedText>
        <ThemedText type="body1" style={styles.subtitle}>
          Código QR del Equipo
        </ThemedText>

        <View style={[styles.qrContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <QRCode
            value={equipmentData.qrData}
            size={240}
            color={colors.text}
            backgroundColor={colors.card}
          />
        </View>
      </View>

      <View style={styles.equipmentSection}>
        <View style={[styles.equipmentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.equipmentImageContainer}>
            <Image
              source={{ uri: equipmentData.imageUrl }}
              style={styles.equipmentImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.equipmentDetails}>
            <View style={styles.equipmentRow}>
              <Ionicons name="hardware-chip" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                Tipo:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                {equipmentData.name}
              </ThemedText>
            </View>

            <View style={styles.equipmentRow}>
              <Ionicons name="business" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                Marca:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                {equipmentData.brand}
              </ThemedText>
            </View>

            <View style={styles.equipmentRow}>
              <Ionicons name="color-palette" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                Color:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                {equipmentData.color}
              </ThemedText>
            </View>

            <View style={styles.equipmentRow}>
              <Ionicons name="barcode" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                N° Serial:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                {equipmentData.serial}
              </ThemedText>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.moreInfoButton, { backgroundColor: colors.primary }]}
          onPress={onMoreInfo}
        >
          <ThemedText type="body1" style={styles.moreInfoButtonText}>
            Más información
          </ThemedText>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  qrContainer: {
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  equipmentSection: {
    flex: 1,
  },
  equipmentCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  equipmentImageContainer: {
    marginRight: 16,
  },
  equipmentImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  equipmentDetails: {
    flex: 1,
  },
  equipmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  equipmentLabel: {
    marginLeft: 8,
    marginRight: 8,
    fontFamily: 'Poppins-Medium',
    opacity: 0.7,
    fontSize: 14,
    minWidth: 60,
  },
  equipmentValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    flex: 1,
  },
  moreInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moreInfoButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginRight: 8,
  },
})