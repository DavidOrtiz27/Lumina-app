import type { HistoryEntry } from '../types';

/**
 * Filtra entradas por fecha específica (día completo)
 * Compara solo la parte de fecha (YYYY-MM-DD), ignorando la hora
 */
export const filterEntriesByDate = (
  entries: HistoryEntry[],
  selectedDate: string | null,
  field: 'ingreso' | 'salida' = 'ingreso'
): HistoryEntry[] => {
  if (!selectedDate) {
    return entries
  }
  const filtered = entries.filter(entry => {
    const dateValue = entry[field];
    if (!dateValue || typeof dateValue !== 'string') return false;
    const entryDate = new Date(dateValue);
    if (isNaN(entryDate.getTime())) return false;
    const entryDateStr = entryDate.toISOString().split('T')[0];
    const filterDate = selectedDate.trim();
    return entryDateStr === filterDate;
  });
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
  endDate: string | null,
  field: 'ingreso' | 'salida' = 'ingreso'
): HistoryEntry[] => {
  if (!startDate && !endDate) {
    return entries
  }
  const filtered = entries.filter(entry => {
    const dateValue = entry[field];
    if (!dateValue || typeof dateValue !== 'string') return false;
    const entryDate = new Date(dateValue);
    if (isNaN(entryDate.getTime())) return false;
    const entryDateStr = entryDate.toISOString().split('T')[0];
    if (startDate && entryDateStr < startDate) return false;
    if (endDate && entryDateStr > endDate) return false;
    return true;
  });
  return filtered;
}

/**
 * Ordena entradas por fecha de ingreso (más recientes primero)
 */
export const sortEntriesByDate = (entries: HistoryEntry[], field: 'ingreso' | 'salida' = 'ingreso'): HistoryEntry[] => {
  return [...entries].sort((a, b) => {
    const dateA = new Date(a[field] || '')
    const dateB = new Date(b[field] || '')
    return dateB.getTime() - dateA.getTime()
  })
}