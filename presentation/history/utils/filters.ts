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
    if (!entry.ingreso || typeof entry.ingreso !== 'string') {
      console.log('⚠️ Entrada sin fecha válida:', entry);
      return false;
    }
    
    const entryDate = new Date(entry.ingreso);
    
    if (isNaN(entryDate.getTime())) {
      console.log('⚠️ Formato de fecha inválido:', entry.ingreso);
      return false;
    }
    
    const entryDateStr = entryDate.toISOString().split('T')[0];
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
 * Filtra entradas por rango de fechas
 * Si solo hay fecha inicio, muestra desde esa fecha en adelante
 * Si solo hay fecha fin, muestra hasta esa fecha
 */
export const filterEntriesByDateRange = (
  entries: HistoryEntry[],
  startDate: string | null,
  endDate: string | null
): HistoryEntry[] => {
  if (!startDate && !endDate) {
    return entries
  }

  console.log('🔍 Filtrando por rango:', startDate, '-', endDate);
  console.log('📊 Total de entradas antes de filtrar:', entries.length);

  const filtered = entries.filter(entry => {
    if (!entry.ingreso || typeof entry.ingreso !== 'string') {
      return false;
    }
    
    const entryDate = new Date(entry.ingreso);
    
    if (isNaN(entryDate.getTime())) {
      return false;
    }
    
    const entryDateStr = entryDate.toISOString().split('T')[0];
    
    // Si hay fecha inicio, la entrada debe ser >= startDate
    if (startDate && entryDateStr < startDate) {
      return false;
    }
    
    // Si hay fecha fin, la entrada debe ser <= endDate
    if (endDate && entryDateStr > endDate) {
      return false;
    }
    
    return true;
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