export type FilterPeriod = 'dia' | 'semana' | 'mes' | 'all'
export type TabType = 'ingreso' | 'egreso'

export interface HistoryEntry {
  id: string
  type: 'ingreso' | 'egreso'
  date: string
  time: string
  equipmentId: string
  equipmentName: string
  equipmentType: string
  location?: string
  additionalInfo?: string
  equipmentImage?: string
}

export interface HistoryFilters {
  period: FilterPeriod
  searchText?: string
  startDate?: Date
  endDate?: Date
}