import { Equipment } from '@/core/equipment/interface/equipment'
import { EquipmentCard } from '@/presentation/equipment/components/EquipmentCard'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

interface EquipmentListProps {
  equipments: Equipment[]
}

export const EquipmentList: React.FC<EquipmentListProps> = ({ equipments }) => {
  const handleEquipmentPress = (equipment: Equipment) => {
    console.log('Navegando a QR para:', equipment.tipo_elemento)
    router.push({
      pathname: '/(limna-app)/qr',
      params: {
        equipmentData: JSON.stringify(equipment)
      }
    })
  }

  return (
    <ScrollView 
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <ThemedText type="h3" style={styles.sectionTitle}>
          Equipos Disponibles ({equipments.length})
        </ThemedText>
        
        {equipments.map((equipment) => (
          <EquipmentCard
            key={equipment.id}
            equipment={equipment}
            onPress={handleEquipmentPress}
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 4,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginHorizontal: 16,
    fontFamily: 'Poppins-SemiBold',
  },
})