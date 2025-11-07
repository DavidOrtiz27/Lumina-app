import type { FilterPeriod, HistoryEntry } from '../types'

export const filterEntriesByPeriod = (
  entries: HistoryEntry[], 
  period: FilterPeriod
): HistoryEntry[] => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (period) {
    case 'dia': {
      return entries.filter(entry => {
        const entryDate = new Date(entry.date)
        return entryDate >= today && entryDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
      })
    }
    
    case 'semana': {
      const weekStart = new Date(today)
      const dayOfWeek = today.getDay()
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      weekStart.setDate(today.getDate() - daysToMonday)
      
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)
      
      return entries.filter(entry => {
        const entryDate = new Date(entry.date)
        return entryDate >= weekStart && entryDate < weekEnd
      })
    }
    
    case 'mes': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      return entries.filter(entry => {
        const entryDate = new Date(entry.date)
        return entryDate >= monthStart && entryDate <= monthEnd
      })
    }
    
    case 'all':
    default:
      return entries
  }
}

export const sortEntriesByDate = (entries: HistoryEntry[]): HistoryEntry[] => {
  return [...entries].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateB.getTime() - dateA.getTime() // Más recientes primero
  })
}