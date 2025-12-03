import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

const CACHE_FOLDER = `${FileSystem.cacheDirectory}images/`;
const CACHE_INDEX_KEY = '@image_cache_index';

interface CacheEntry {
  uri: string;
  localPath: string;
  timestamp: number;
}

interface CacheIndex {
  [key: string]: CacheEntry;
}

/**
 * Inicializa el directorio de caché de imágenes
 */
const initCacheDirectory = async (): Promise<void> => {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_FOLDER, { intermediates: true });
    console.log('[ImageCache] Directorio de caché creado');
  }
};

/**
 * Obtiene el índice de caché desde AsyncStorage
 */
const getCacheIndex = async (): Promise<CacheIndex> => {
  try {
    const index = await AsyncStorage.getItem(CACHE_INDEX_KEY);
    return index ? JSON.parse(index) : {};
  } catch (error) {
    console.error('[ImageCache] Error obteniendo índice:', error);
    return {};
  }
};

/**
 * Guarda el índice de caché en AsyncStorage
 */
const saveCacheIndex = async (index: CacheIndex): Promise<void> => {
  try {
    await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
  } catch (error) {
    console.error('[ImageCache] Error guardando índice:', error);
  }
};

/**
 * Genera una clave única para la URL de la imagen
 */
const getCacheKey = (uri: string): string => {
  // Extraer el nombre del archivo de la URL
  const filename = uri.split('/').pop() || '';
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

/**
 * Obtiene una imagen del caché local o la descarga y guarda
 */
export const getCachedImage = async (uri: string): Promise<string> => {
  try {
    await initCacheDirectory();
    
    const cacheKey = getCacheKey(uri);
    const cacheIndex = await getCacheIndex();
    
    // Verificar si la imagen ya está en caché
    if (cacheIndex[cacheKey]) {
      const cachedEntry = cacheIndex[cacheKey];
      const fileInfo = await FileSystem.getInfoAsync(cachedEntry.localPath);
      
      if (fileInfo.exists) {
        console.log('[ImageCache] ✅ Imagen encontrada en caché:', uri);
        return cachedEntry.localPath;
      } else {
        // El archivo ya no existe, eliminar del índice
        delete cacheIndex[cacheKey];
        await saveCacheIndex(cacheIndex);
      }
    }
    
    // Descargar la imagen
    console.log('[ImageCache] 📥 Descargando imagen:', uri);
    const localPath = `${CACHE_FOLDER}${cacheKey}`;
    
    const downloadResult = await FileSystem.downloadAsync(uri, localPath);
    
    if (downloadResult.status === 200 || downloadResult.status === 404) {
      // Guardar en el índice incluso si es 404, porque el archivo se descargó
      cacheIndex[cacheKey] = {
        uri,
        localPath: downloadResult.uri,
        timestamp: Date.now(),
      };
      await saveCacheIndex(cacheIndex);
      
      console.log('[ImageCache] ✅ Imagen guardada en caché:', uri);
      return downloadResult.uri;
    } else {
      throw new Error(`Download failed with status ${downloadResult.status}`);
    }
  } catch (error) {
    console.error('[ImageCache] ❌ Error al cachear imagen:', error);
    throw error;
  }
};

/**
 * Limpia el caché de imágenes (elimina archivos antiguos)
 */
export const clearImageCache = async (maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> => {
  try {
    const cacheIndex = await getCacheIndex();
    const now = Date.now();
    const updatedIndex: CacheIndex = {};
    
    for (const [key, entry] of Object.entries(cacheIndex)) {
      const age = now - entry.timestamp;
      
      if (age > maxAge) {
        // Eliminar archivo antiguo
        try {
          await FileSystem.deleteAsync(entry.localPath, { idempotent: true });
          console.log('[ImageCache] 🗑️ Imagen antigua eliminada:', key);
        } catch (error) {
          console.error('[ImageCache] Error eliminando archivo:', error);
        }
      } else {
        updatedIndex[key] = entry;
      }
    }
    
    await saveCacheIndex(updatedIndex);
    console.log('[ImageCache] ✅ Caché limpiado');
  } catch (error) {
    console.error('[ImageCache] Error limpiando caché:', error);
  }
};

/**
 * Elimina todo el caché de imágenes
 */
export const clearAllImageCache = async (): Promise<void> => {
  try {
    await FileSystem.deleteAsync(CACHE_FOLDER, { idempotent: true });
    await AsyncStorage.removeItem(CACHE_INDEX_KEY);
    console.log('[ImageCache] 🗑️ Todo el caché eliminado');
  } catch (error) {
    console.error('[ImageCache] Error eliminando todo el caché:', error);
  }
};
