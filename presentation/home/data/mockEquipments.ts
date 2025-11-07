import { Equipment } from '@/core/equipment/interface/equipment'

export const mockEquipments: Equipment[] = [
  {
    id: '1',
    name: 'Laptop',
    serial: 'DL5520-001-2024',
    brand: 'Dell',
    color: 'Negro',
    imageUrl: 'https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=💻',
    qrData: JSON.stringify({
      id: '1',
      name: 'Laptop',
      brand: 'Dell',
      serial: 'DL5520-001-2024',
      color: 'Negro',
      location: 'Oficina Principal'
    }),
    description: 'Laptop corporativa para desarrollo',
    location: 'Oficina Principal'
  },
  {
    id: '2',
    name: 'Monitor',
    serial: 'SM24-002-2024',
    brand: 'Samsung',
    color: 'Negro',
    imageUrl: 'https://via.placeholder.com/60x60/10B981/FFFFFF?text=🖥️',
    qrData: JSON.stringify({
      id: '2',
      name: 'Monitor',
      brand: 'Samsung',
      serial: 'SM24-002-2024',
      color: 'Negro',
      location: 'Sala de Reuniones'
    }),
    description: 'Monitor para presentaciones',
    location: 'Sala de Reuniones'
  },
  {
    id: '3',
    name: 'Impresora',
    serial: 'HP-LJ-003-2024',
    brand: 'HP LaserJet',
    color: 'Blanco',
    imageUrl: 'https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=🖨️',
    qrData: JSON.stringify({
      id: '3',
      name: 'Impresora',
      brand: 'HP LaserJet',
      serial: 'HP-LJ-003-2024',
      color: 'Blanco',
      location: 'Área Administrativa'
    }),
    description: 'Impresora láser en mantenimiento',
    location: 'Área Administrativa'
  },
  {
    id: '4',
    name: 'Tablet',
    serial: 'IPD-PRO-004-2024',
    brand: 'iPad Pro',
    color: 'Gris Espacial',
    imageUrl: 'https://via.placeholder.com/60x60/8B5CF6/FFFFFF?text=📱',
    qrData: JSON.stringify({
      id: '4',
      name: 'Tablet',
      brand: 'iPad Pro',
      serial: 'IPD-PRO-004-2024',
      color: 'Gris Espacial',
      location: 'Almacén'
    }),
    description: 'Tablet para presentaciones móviles',
    location: 'Almacén'
  }
]