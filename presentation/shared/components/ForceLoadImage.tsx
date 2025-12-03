import { getCachedImage } from '@/core/utils/imageCache';
import React, { useEffect, useState } from 'react';
import { Image, ImageStyle, StyleProp, View } from 'react-native';

interface ForceLoadImageProps {
  uri: string;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  onLoad?: () => void;
  onError?: (error: any) => void;
  fallback?: React.ReactNode;
}

/**
 * Componente que fuerza la carga de imágenes ignorando el código de estado HTTP.
 * Cachea las imágenes localmente para reutilizarlas sin hacer múltiples solicitudes.
 */
export const ForceLoadImage: React.FC<ForceLoadImageProps> = ({
  uri,
  style,
  resizeMode = 'cover',
  onLoad,
  onError,
  fallback
}) => {
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);

        // Obtener imagen del caché o descargarla
        const cachedUri = await getCachedImage(uri);
        
        if (isMounted) {
          setLocalUri(cachedUri);
          setLoading(false);
          onLoad?.();
        }
      } catch (err) {
        if (isMounted) {
          console.error('[ForceLoadImage] Error cargando imagen:', err);
          setError(true);
          setLoading(false);
          onError?.(err);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [uri]);

  if (error && fallback) {
    return <>{fallback}</>;
  }

  if (loading || !localUri) {
    return <View style={style} />;
  }

  return (
    <Image
      source={{ uri: localUri }}
      style={style}
      resizeMode={resizeMode}
    />
  );
};
