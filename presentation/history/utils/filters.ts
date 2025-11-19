import type { HistoryEntry } from '../types';

/**
 * Filtra entradas por fecha específica (día completo)
 * Compara solo la parte de fecha (YYYY-MM-DD), ignorando la hora
 */
export const filterEntriesByDate = (
  entries: HistoryEntry[], 
  selectedDate: string | null
): HistoryEntry[] => {
  if (!selectedDate) {
    return entries
  }

  console.log('🔍 Filtrando por fecha:', selectedDate);
  console.log('📊 Total de entradas antes de filtrar:', entries.length);

  const filtered = entries.filter(entry => {
    // entry.ingreso puede estar en formato:
    // - "YYYY-MM-DD HH:MM:SS" (formato antiguo)
    // - "YYYY-MM-DDTHH:MM:SS.000000Z" (formato ISO 8601 del backend Laravel)
    if (!entry.ingreso || typeof entry.ingreso !== 'string') {
      console.log('⚠️ Entrada sin fecha válida:', entry);
      return false;
    }
    
    // Normalizar fecha del backend a Date object
    // Esto maneja ambos formatos automáticamente
    const entryDate = new Date(entry.ingreso);
    
    // Validar que la fecha sea válida
    if (isNaN(entryDate.getTime())) {
      console.log('⚠️ Formato de fecha inválido:', entry.ingreso);
      return false;
    }
    
    // Extraer solo la parte de fecha (YYYY-MM-DD) en zona horaria local
    const entryDateStr = entryDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const filterDate = selectedDate.trim();
    
    const matches = entryDateStr === filterDate;
    
    if (matches) {
      console.log('✅ Coincide:', entry.ingreso, '→', entryDateStr, '===', filterDate);
    }
    
    return matches;
  });

  console.log('📊 Total de entradas después de filtrar:', filtered.length);
  
  return filtered;
}

/**
 * Ordena entradas por fecha de ingreso (más recientes primero)
 */
export const sortEntriesByDate = (entries: HistoryEntry[]): HistoryEntry[] => {
  return [...entries].sort((a, b) => {
    // Ordenar por fecha de ingreso (más recientes primero)
    const dateA = new Date(a.ingreso)
    const dateB = new Date(b.ingreso)
    return dateB.getTime() - dateA.getTime()
  })
}