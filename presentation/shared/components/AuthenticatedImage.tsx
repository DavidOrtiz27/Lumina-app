import { StorageAdapter } from '@/core/auth/storage/StorageAdapter';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageStyle, StyleProp, View } from 'react-native';

interface AuthenticatedImageProps {
    uri: string;
    style: StyleProp<ImageStyle>;
    fallbackSource?: any;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

/**
 * Componente que carga imágenes, primero sin autenticación,
 * luego con Bearer token si falla
 */
export const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
    uri,
    style,
    fallbackSource,
    resizeMode = 'cover'
}) => {
    const [imageSource, setImageSource] = useState<{ uri: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadImage = async () => {
            try {
                setLoading(true);
                setError(false);

                const cleanUri = uri.trim();
                console.log('[AUTH-IMAGE] Intentando cargar:', cleanUri);

                // Lista de URLs a probar
                const urlsToTry = [
                    cleanUri,
                    cleanUri.replace('/api/images/', '/storage/'),
                ];
                const uniqueUrls = [...new Set(urlsToTry)];

                let successUrl: string | null = null;

                // Intentar GET simple con User-Agent básico
                for (const testUrl of uniqueUrls) {
                    try {
                        console.log('[AUTH-IMAGE] GET:', testUrl);
                        const response = await fetch(testUrl, {
                            method: 'GET',
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile)',
                            }
                        });

                        console.log(`[AUTH-IMAGE] Status: ${response.status}, Redirected: ${response.redirected}, URL final: ${response.url}`);

                        if (response.ok) {
                            console.log('[AUTH-IMAGE] ✅ Éxito en:', testUrl);
                            successUrl = testUrl;
                            break;
                        } else {
                            const text = await response.text();
                            console.log(`[AUTH-IMAGE] ❌ Error ${response.status}`);
                            // console.log(`[AUTH-IMAGE] Body: ${text.substring(0, 100)}`);
                        }
                    } catch (err) {
                        console.log('[AUTH-IMAGE] ❌ Error de red:', err);
                    }
                }

                // Si falló, intentar con token y headers
                if (!successUrl) {
                    const token = await StorageAdapter.getToken();
                    if (token) {
                        console.log('[AUTH-IMAGE] Intentando con token...');
                        for (const testUrl of uniqueUrls) {
                            try {
                                const response = await fetch(testUrl, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
                                        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                                    }
                                });

                                if (response.ok) {
                                    successUrl = testUrl;
                                    break;
                                }
                            } catch (e) { }
                        }
                    }
                }

                if (successUrl) {
                    setImageSource({ uri: successUrl });
                    setLoading(false);
                } else {
                    throw new Error('No se pudo cargar la imagen');
                }
            } catch (err) {
                console.error('[AUTH-IMAGE] Fallo total:', err);
                setError(true);
                setLoading(false);
            }
        };

        loadImage();
    }, [uri]);

    if (loading) {
        return (
            <View style={[style as any, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' }]}>
                <ActivityIndicator size="small" color="#666" />
            </View>
        );
    }

    if (error && fallbackSource) {
        console.log('[AUTH-IMAGE] Mostrando imagen de fallback');
        return <Image source={fallbackSource} style={style} resizeMode={resizeMode} />;
    }

    if (error || !imageSource) {
        return (
            <View style={[style as any, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0E0E0' }]} />
        );
    }

    return (
        <Image
            source={imageSource}
            style={style}
            resizeMode={resizeMode}
            onError={(e) => {
                console.error('[AUTH-IMAGE] Error al renderizar:', e.nativeEvent.error);
                setError(true);
            }}
            onLoad={() => {
                console.log('[AUTH-IMAGE] ✅ Imagen renderizada exitosamente');
            }}
        />
    );
};
