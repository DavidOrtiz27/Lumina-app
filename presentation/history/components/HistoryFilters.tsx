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
  dateRange: { start: string | null; end: string | null }
  onDateRangeChange: (range: { start: string | null; end: string | null }) => void
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  selectedDate,
  onDateChange,
  dateRange,
  onDateRangeChange,
}) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [filterMode, setFilterMode] = useState<'single' | 'range'>('single')

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
    onDateRangeChange({ start: null, end: null })
  }

  const handleToggleMode = () => {
    const newMode = filterMode === 'single' ? 'range' : 'single'
    setFilterMode(newMode)
    // Limpiar filtros al cambiar modo
    onDateChange(null)
    onDateRangeChange({ start: null, end: null })
  }

  const handleStartDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false)
    }
    
    if (event.type === 'set' && date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      
      onDateRangeChange({ ...dateRange, start: dateString })
    } else if (event.type === 'dismissed') {
      setShowStartDatePicker(false)
    }
  }

  const handleEndDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false)
    }
    
    if (event.type === 'set' && date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      
      onDateRangeChange({ ...dateRange, end: dateString })
    } else if (event.type === 'dismissed') {
      setShowEndDatePicker(false)
    }
  }

  const handleOpenPicker = () => {
    setShowDatePicker(true)
  }

  const getSelectedDateObject = () => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
    return new Date()
  }

  const getStartDateObject = () => {
    if (dateRange.start) {
      const [year, month, day] = dateRange.start.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
    return new Date()
  }

  const getEndDateObject = () => {
    if (dateRange.end) {
      const [year, month, day] = dateRange.end.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
    return new Date()
  }

  const hasActiveFilter = selectedDate || dateRange.start || dateRange.end

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="h3" style={styles.title}>
          Filtrar por fecha
        </ThemedText>
        {hasActiveFilter && (
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

      {/* Toggle entre fecha única y rango */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            filterMode === 'single' && styles.modeButtonActive,
            { 
              backgroundColor: filterMode === 'single' ? colors.primary : colors.card,
              borderColor: colors.border 
            }
          ]}
          onPress={handleToggleMode}
        >
          <Ionicons 
            name="calendar-outline" 
            size={18} 
            color={filterMode === 'single' ? 'white' : colors.text} 
          />
          <ThemedText 
            type="body2" 
            style={[
              styles.modeButtonText,
              { color: filterMode === 'single' ? 'white' : colors.text }
            ]}
          >
            Día específico
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            filterMode === 'range' && styles.modeButtonActive,
            { 
              backgroundColor: filterMode === 'range' ? colors.primary : colors.card,
              borderColor: colors.border 
            }
          ]}
          onPress={handleToggleMode}
        >
          <Ionicons 
            name="calendar-number-outline" 
            size={18} 
            color={filterMode === 'range' ? 'white' : colors.text} 
          />
          <ThemedText 
            type="body2" 
            style={[
              styles.modeButtonText,
              { color: filterMode === 'range' ? 'white' : colors.text }
            ]}
          >
            Rango de fechas
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Filtro por día específico */}
      {filterMode === 'single' && (
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
      )}

      {/* Filtro por rango de fechas */}
      {filterMode === 'range' && (
        <View style={styles.filterContent}>
          <View style={styles.rangeContainer}>
            <ThemedText type="body2" style={styles.rangeLabel}>
              Fecha inicio
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.dateButton,
                styles.rangeDateButton,
                {
                  backgroundColor: dateRange.start ? colors.primary : colors.card,
                  borderColor: dateRange.start ? colors.primary : colors.border,
                }
              ]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={dateRange.start ? 'white' : colors.text}
              />
              <ThemedText
                type="body2"
                style={[
                  styles.dateButtonText,
                  { color: dateRange.start ? 'white' : colors.text, fontSize: 13 }
                ]}
              >
                {dateRange.start ? formatDisplayDate(dateRange.start) : 'Seleccionar'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.rangeContainer}>
            <ThemedText type="body2" style={styles.rangeLabel}>
              Fecha fin
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.dateButton,
                styles.rangeDateButton,
                {
                  backgroundColor: dateRange.end ? colors.primary : colors.card,
                  borderColor: dateRange.end ? colors.primary : colors.border,
                }
              ]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={dateRange.end ? 'white' : colors.text}
              />
              <ThemedText
                type="body2"
                style={[
                  styles.dateButtonText,
                  { color: dateRange.end ? 'white' : colors.text, fontSize: 13 }
                ]}
              >
                {dateRange.end ? formatDisplayDate(dateRange.end) : 'Seleccionar'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* DateTimePickers */}
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

      {showStartDatePicker && (
        <DateTimePicker
          value={getStartDateObject()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
          maximumDate={dateRange.end ? getEndDateObject() : new Date()}
          themeVariant={colorScheme ?? 'light'}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={getEndDateObject()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
          minimumDate={dateRange.start ? getStartDateObject() : undefined}
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
  modeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  modeButtonActive: {
    // Estilo adicional para botón activo si es necesario
  },
  modeButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 12,
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
  rangeContainer: {
    gap: 6,
  },
  rangeLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginLeft: 4,
  },
  rangeDateButton: {
    // Estilo específico para botones de rango si es necesario
  },
})