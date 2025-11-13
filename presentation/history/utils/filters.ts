import type { HistoryEntry } from '../types'

export const filterEntriesByDate = (
  entries: HistoryEntry[], 
  selectedDate: string | null
): HistoryEntry[] => {
  if (!selectedDate) {
    return entries
  }

  return entries.filter(entry => {
    // entry.ingreso está en formato "YYYY-MM-DD HH:MM:SS"
    const entryDate = entry.ingreso.split(' ')[0] // Obtener solo la parte de la fecha
    return entryDate === selectedDate
  })
}

export const sortEntriesByDate = (entries: HistoryEntry[]): HistoryEntry[] => {
  return [...entries].sort((a, b) => {
    // Ordenar por fecha de ingreso (más recientes primero)
    const dateA = new Date(a.ingreso)
    const dateB = new Date(b.ingreso)
    return dateB.getTime() - dateA.getTime()
  })
}