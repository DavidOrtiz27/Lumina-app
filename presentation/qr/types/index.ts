export interface EquipmentData {
  id: string
  name: string
  serial: string
  brand: string
  color: string
  imageUrl: string
  qrData: string
}

export type QRViewType = 'main' | 'details'