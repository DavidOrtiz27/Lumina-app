export interface Equipment {
  id: string
  name: string // Este será el "tipo" del equipo
  serial: string
  imageUrl: string
  qrData: string
  // Nuevos campos principales
  brand?: string // Marca del equipo
  color?: string // Color del equipo
  // Campos adicionales que pueden venir del backend
  description?: string
  location?: string
  lastUpdated?: Date | string
}