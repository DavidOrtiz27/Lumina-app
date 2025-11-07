import type { HistoryEntry } from '../types'

export const mockHistoryEntries: HistoryEntry[] = [
  // INGRESOS
  {
    id: '1',
    type: 'ingreso',
    date: '2025-11-07',
    time: '08:30',
    equipmentId: '1',
    equipmentName: 'Laptop Dell',
    equipmentType: 'Laptop',
    location: 'Oficina Principal',
    additionalInfo: 'Cargador incluido',
    equipmentImage: 'https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=💻'
  },
  {
    id: '2',
    type: 'ingreso',
    date: '2025-11-07',
    time: '14:20',
    equipmentId: '3',
    equipmentName: 'Impresora HP LaserJet',
    equipmentType: 'Impresora',
    location: 'Área Administrativa',
    equipmentImage: 'https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=🖨️'
  },
  {
    id: '3',
    type: 'ingreso',
    date: '2025-11-06',
    time: '09:15',
    equipmentId: '2',
    equipmentName: 'Monitor Samsung',
    equipmentType: 'Monitor',
    location: 'Sala de Reuniones',
    additionalInfo: 'Cable HDMI incluido',
    equipmentImage: 'https://via.placeholder.com/60x60/10B981/FFFFFF?text=🖥️'
  },
  {
    id: '4',
    type: 'ingreso',
    date: '2025-11-05',
    time: '10:30',
    equipmentId: '1',
    equipmentName: 'Laptop Dell',
    equipmentType: 'Laptop',
    location: 'Oficina Principal',
    equipmentImage: 'https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=💻'
  },
  // EGRESOS
  {
    id: '5',
    type: 'egreso',
    date: '2025-11-06',
    time: '18:00',
    equipmentId: '4',
    equipmentName: 'iPad Pro',
    equipmentType: 'Tablet',
    location: 'Almacén',
    additionalInfo: 'Apple Pencil incluido',
    equipmentImage: 'https://via.placeholder.com/60x60/8B5CF6/FFFFFF?text=📱'
  },
  {
    id: '6',
    type: 'egreso',
    date: '2025-11-05',
    time: '17:45',
    equipmentId: '2',
    equipmentName: 'Monitor Samsung',
    equipmentType: 'Monitor',
    location: 'Sala de Reuniones',
    additionalInfo: 'Soporte ajustable',
    equipmentImage: 'https://via.placeholder.com/60x60/10B981/FFFFFF?text=🖥️'
  },
  {
    id: '7',
    type: 'egreso',
    date: '2025-11-04',
    time: '18:30',
    equipmentId: '3',
    equipmentName: 'Impresora HP LaserJet',
    equipmentType: 'Impresora',
    location: 'Área Administrativa',
    equipmentImage: 'https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=🖨️'
  },
  {
    id: '8',
    type: 'egreso',
    date: '2025-10-30',
    time: '17:30',
    equipmentId: '1',
    equipmentName: 'Laptop Dell',
    equipmentType: 'Laptop',
    location: 'Oficina Principal',
    additionalInfo: 'Cargador incluido',
    equipmentImage: 'https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=💻'
  }
]