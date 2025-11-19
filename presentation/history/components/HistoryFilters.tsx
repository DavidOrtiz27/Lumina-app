import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { ThemedText } from '@/presentation/theme/components/themed-text'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'

interface HistoryFiltersProps {
  selectedDate: string | null
  onDateChange: (date: string | null) => void
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const [showDatePicker, setShowDatePicker] = useState(false)

  const formatDisplayDate = (dateString: string) => {
    // Parsear la fecha correctamente para evitar problemas de zona horaria
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const formatted = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    console.log(`📅 formatDisplayDate: "${dateString}" → "${formatted}"`);
    return formatted
  }

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
    
    if (event.type === 'set' && date) {
      // Formatear fecha a YYYY-MM-DD con padding correcto
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      
      console.log('📅 Fecha seleccionada en picker:', dateString);
      console.log('📅 Objeto Date:', date.toISOString());
      
      onDateChange(dateString)
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false)
    }
  }

  const handleClearFilter = () => {
    onDateChange(null)
  }

  const handleOpenPicker = () => {
    setShowDatePicker(true)
  }

  const getSelectedDateObject = () => {
    if (selectedDate) {
      // Parsear la fecha en formato YYYY-MM-DD para evitar problemas de zona horaria
      const [year, month, day] = selectedDate.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
    return new Date()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="h3" style={styles.title}>
          Filtrar por fecha
        </ThemedText>
        {selectedDate && (
          <TouchableOpacity 
            onPress={handleClearFilter}
            style={[styles.clearButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="close-circle" size={16} color={colors.text} />
            <ThemedText type="body2" style={styles.clearText}>
              Limpiar
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContent}>
        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              backgroundColor: selectedDate ? colors.primary : colors.card,
              borderColor: selectedDate ? colors.primary : colors.border,
            }
          ]}
          onPress={handleOpenPicker}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={selectedDate ? 'white' : colors.text}
          />
          <ThemedText
            type="body2"
            style={[
              styles.dateButtonText,
              { color: selectedDate ? 'white' : colors.text }
            ]}
          >
            {selectedDate ? formatDisplayDate(selectedDate) : 'Seleccionar fecha'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* DateTimePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={getSelectedDateObject()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          themeVariant={colorScheme ?? 'light'}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  clearText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  dateButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
})