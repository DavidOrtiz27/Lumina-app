import type { userQR } from '@/core/auth/interface/user';
import { Equipment, EquipmentQR } from '@/core/equipment/interface/equipment';
import {
  generateEquipmentHash,
  generateSimpleHash,
  parseQRData,
  validateQRCode
} from '@/core/equipment/utils/qr-generator';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useEffect, useState } from 'react';

/**
 * Hook personalizado para manejar la generación y validación de QR codes de equipos
 * Genera un hash SHA-256 basado en: sn_equipo|color|nombre_usuario|documento_usuario
 */
export const useEquipmentQR = (equipment: Equipment) => {
  // Obtener usuario del store
  const { user } = useAuthStore();
  
  // Inicializar con un valor por defecto válido (solo hash)
  const [qrContent, setQrContent] = useState<string>('generating...');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (!equipment || !user) return;

      console.log('🔄 useEquipmentQR: Regenerando QR para equipo:', equipment.sn_equipo, '-', equipment.tipo_elemento);
      console.log('👤 Usuario:', user.nombre, '-', user.documento);

      setIsGenerating(true);
      setError(null);

      try {
        // Preparar datos del equipo y usuario para el hash
        const equipmentQR: EquipmentQR = {
          sn_equipo: equipment.sn_equipo,
          color: equipment.color
        };
        
        const userQR: userQR = {
          nombre: user.nombre,
          documento: user.documento
        };

        // Generar hash con información del equipo y usuario
        const hash = await generateEquipmentHash(equipmentQR, userQR);
        console.log('✅ useEquipmentQR: QR generado exitosamente');
        console.log('📦 Hash del QR:', hash);
        setQrContent(hash);
      } catch (err) {
        console.error('❌ useEquipmentQR: Error generando QR:', err);
        setError('Error al generar el código QR');
        
        // Usar hash simple como fallback
        const fallbackHash = generateSimpleHash(equipment);
        setQrContent(fallbackHash);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQR();
  }, [equipment?.sn_equipo, equipment?.color, user?.nombre, user?.documento]);

  /**
   * Valida un QR escaneado contra el equipo actual
   */
  const validateScannedQR = async (scannedData: string): Promise<boolean> => {
    try {
      return await validateQRCode(scannedData, equipment);
    } catch (err) {
      console.error('Error validando QR:', err);
      return false;
    }
  };

  /**
   * Parsea los datos de un QR escaneado
   */
  const parseScannedQR = (scannedData: string) => {
    return parseQRData(scannedData);
  };

  return {
    qrContent,
    isGenerating,
    error,
    validateScannedQR,
    parseScannedQR
  };
};
