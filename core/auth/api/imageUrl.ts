// Utilidad para obtener la URL completa de una imagen desde el backend
// Usa la misma lógica de baseURL que luminaApi, pero sin el /api

import { LOCAL_URL, PRODUCTION_URL, USE_LOCAL } from '../../config/api';

export function getImageUrl(filename: string): string {
  const baseUrl = USE_LOCAL ? LOCAL_URL : PRODUCTION_URL;
  const imageUrl = `${baseUrl}/api/images/${filename}`;
  console.log('[IMAGE-URL] URL de imagen:', imageUrl);
  return imageUrl;
}

// Función alternativa para probar /api/images/
export function getImageUrlApi(filename: string): string {
  const baseUrl = USE_LOCAL ? LOCAL_URL : PRODUCTION_URL;
  return `${baseUrl}/api/images/${filename}`;
}
