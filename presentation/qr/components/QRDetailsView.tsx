import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import type { EquipmentData } from '../types'

interface QRDetailsViewProps {
  equipmentData: EquipmentData
  onBack: () => void
}

export const QRDetailsView: React.FC<QRDetailsViewProps> = ({ equipmentData, onBack }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  return (
    <View style={styles.content}>
      <ScrollView style={styles.detailsSection} showsVerticalScrollIndicator={false}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
          >
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
            <ThemedText type="body1" style={[styles.backButtonText, { color: colors.primary }]}>
              Volver
            </ThemedText>
          </TouchableOpacity>
          
          <ThemedText type="h3" style={[styles.detailsTitle, { color: colors.text }]}>
            Información Detallada
          </ThemedText>
          
          <View style={styles.headerSpacer} />
        </View>

        {/* Imagen del Equipo en Vista Detallada */}
        <View style={styles.detailsImageSection}>
          <ThemedText type="h3" style={[styles.imageSectionTitle, { color: colors.text }]}>
            {equipmentData.name}
          </ThemedText>
          <View style={[styles.detailsImageCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Image
              source={{ uri: equipmentData.imageUrl }}
              style={styles.detailsEquipmentImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Información Principal Completa */}
        <View style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="h3" style={[styles.sectionTitle, { color: colors.text }]}>
            Información del Equipo
          </ThemedText>
          
          <View style={styles.detailsContent}>
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

        {/* Elementos Adicionales */}
        <View style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemedText type="h3" style={[styles.sectionTitle, { color: colors.text }]}>
            Elementos Adicionales
          </ThemedText>
          
          <View style={styles.detailsContent}>
            <View style={styles.equipmentRow}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                Ubicación:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                Oficina Principal
              </ThemedText>
            </View>

            <View style={styles.equipmentRow}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                Última actualización:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                {new Date().toLocaleDateString()}
              </ThemedText>
            </View>

            <View style={styles.equipmentRow}>
              <Ionicons name="construct" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                Estado:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                Operativo
              </ThemedText>
            </View>

            <View style={styles.equipmentRow}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                Descripción:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                Equipo corporativo para uso administrativo
              </ThemedText>
            </View>

            <View style={styles.equipmentRow}>
              <Ionicons name="person" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                Responsable:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                Área de TI
              </ThemedText>
            </View>

            <View style={styles.equipmentRow}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                Fecha de registro:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                15/10/2024
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  detailsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: 25,
    minHeight: 50,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingRight: 5,
    marginLeft: -5,
  },
  backButtonText: {
    marginLeft: 2,
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  detailsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: 5,
  },
  headerSpacer: {
    width: 45,
  },
  detailsCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContent: {
    gap: 16,
  },
  detailsImageSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 25,
  },
  imageSectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsImageCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailsEquipmentImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
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
})