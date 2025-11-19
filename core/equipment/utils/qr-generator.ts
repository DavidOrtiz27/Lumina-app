import * as Crypto from 'expo-crypto';
import type { userQR } from '../../auth/interface/user';
import type { Equipment, EquipmentQR } from '../interface/equipment';

/**
 * Genera un hash SHA-256 único basado en la concatenación de información del equipo y usuario
 * Este hash se utilizará como contenido del código QR
 * 
 * @param equipment - Información del equipo (sn_equipo, color)
 * @param user - Información del usuario (nombre, documento)
 * @returns Hash SHA-256 en formato hexadecimal
 */
export const generateEquipmentHash = async (equipment: EquipmentQR, user: userQR): Promise<string> => {
  try {
    // Concatenar la información en un string
    // Formato: sn_equipo|color|usuario_nombre|usuario_documento
    const dataString = `${equipment.sn_equipo}|${equipment.color}|${user.nombre}|${user.documento}`;

    console.log('🔐 Generando hash con usuario desde:', dataString);

    // Generar hash SHA-256
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      dataString
    );

    console.log('✅ Hash con usuario generado:', hash);

    return hash;
  } catch (error) {
    console.error('Error generando hash del equipo:', error);
    throw new Error('No se pudo generar el hash del equipo');
  }
};

/**we
 * 
 * Verifica si un hash SHA-256 coincide con la información del equipo y usuario
 * 
 * @param hash - Hash SHA-256 a verificar
 * @param equipment - Información del equipo (sn_equipo, color)
 * @param user - Información del usuario (nombre, documento)
 * @returns true si el hash coincide, false si no
 */
export const verifyEquipmentHash = async (
  hash: string, 
  equipment: EquipmentQR, 
  user: userQR
): Promise<boolean> => {
  try {
    // Generar el hash esperado con los datos actuales
    const expectedHash = await generateEquipmentHash(equipment, user);
    
    console.log('🔍 Verificando hash...');
    console.log('📝 Hash escaneado:', hash);
    console.log('📝 Hash esperado:', expectedHash);
    console.log('✅ Coincide:', hash === expectedHash);
    
    return hash === expectedHash;
  } catch (error) {
    console.error('Error verificando hash:', error);
    return false;
  }
};

/**
 * Genera un hash SHA-256 determinista para el equipo completo (sin ID)
 * Útil para verificar que un QR escaneado corresponde a un equipo
 * 
 * @param equipment - Información completa del equipo
 * @returns Hash SHA-256 en formato hexadecimal
 */
export const generateDeterministicHash = async (equipment: Equipment): Promise<string> => {
  try {
    // Concatenar información clave del equipo (SIN ID)
    // Formato: sn_equipo|marca|tipo_elemento|color
    const dataString = `${equipment.sn_equipo}|${equipment.marca}|${equipment.tipo_elemento}|${equipment.color}`;

    console.log('🔐 Generando hash SHA-256 desde:', dataString);

    // Generar hash SHA-256
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      dataString
    );

    console.log('✅ Hash generado:', hash);

    return hash;
  } catch (error) {
    console.error('Error generando hash determinista:', error);
    throw new Error('No se pudo generar el hash determinista');
  }
};

/**
 * Genera el contenido del QR que solo contiene el hash SHA-256
 * 
 * @param equipment - Información completa del equipo
 * @returns Hash SHA-256 como string
 */
export const generateQRContent = async (equipment: Equipment): Promise<string> => {
  try {
    const hash = await generateDeterministicHash(equipment);

    console.log('📱 QR Content (solo hash):', hash);

    // Retornar solo el hash
    return hash;
  } catch (error) {
    console.error('Error generando contenido del QR:', error);
    throw new Error('No se pudo generar el contenido del QR');
  }
};

/**
 * Valida que un QR escaneado corresponde a un equipo específico
 * 
 * @param scannedData - Datos del QR escaneado (string JSON)
 * @param equipment - Equipo a validar
 * @returns true si el QR es válido para este equipo
 */
export const validateQRCode = async (
  scannedData: string,
  equipment: Equipment
): Promise<boolean> => {
  try {
    // Parsear los datos del QR
    const qrData = JSON.parse(scannedData);

    // Verificar estructura básica
    if (!qrData.hash || !qrData.equipment || qrData.type !== 'equipment') {
      return false;
    }

    // Verificar que el ID coincida
    if (qrData.equipment.id !== equipment.id) {
      return false;
    }

    // Generar hash del equipo actual y comparar
    const expectedHash = await generateDeterministicHash(equipment);
    
    return qrData.hash === expectedHash;
  } catch (error) {
    console.error('Error validando QR:', error);
    return false;
  }
};

/**
 * Extrae información del equipo desde un QR escaneado
 * 
 * @param scannedData - Datos del QR escaneado (string JSON)
 * @returns Información básica del equipo o null si es inválido
 */
export const parseQRData = (scannedData: string): {
  id: number;
  sn_equipo: string;
  tipo_elemento: string;
  marca: string;
  color: string;
  hash: string;
} | null => {
  try {
    const qrData = JSON.parse(scannedData);

    // Verificar estructura básica
    if (!qrData.version || !qrData.type || qrData.type !== 'equipment') {
      return null;
    }

    return {
      id: qrData.equipment.id,
      sn_equipo: qrData.equipment.sn_equipo,
      tipo_elemento: qrData.equipment.tipo_elemento,
      marca: qrData.equipment.marca,
      color: qrData.equipment.color,
      hash: qrData.hash
    };
  } catch (error) {
    console.error('Error parseando datos del QR:', error);
    return null;
  }
};

/**
 * Genera un hash simple para usar como fallback si falla la generación completa (sin ID)
 * 
 * @param equipment - Información completa del equipo
 * @returns Hash simple basado en concatenación básica
 */
export const generateSimpleHash = (equipment: Equipment): string => {
  // Concatenar información básica (sin ID)
  const simpleData = `${equipment.sn_equipo}|${equipment.marca}|${equipment.tipo_elemento}`;
  
  // Hash simple usando btoa (base64) como fallback
  try {
    return btoa(simpleData);
  } catch {
    // Si btoa falla, devolver el string directo
    return simpleData;
  }
};
