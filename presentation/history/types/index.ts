import { Equipment } from '@/core/equipment/interface/equipment'

export type TabType = 'ingreso' | 'egreso'

export interface HistoryEntry {
  id: number
  ingreso: string // "2024-11-12 07:35:00"
  salida: string | null // "2024-11-11 17:45:00" o null si aún está en uso
  equipo: Equipment
}