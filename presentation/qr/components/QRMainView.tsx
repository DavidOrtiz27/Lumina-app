import { Colors } from '@/constants/theme';
import { getImageUrl } from '@/core/auth/api/imageUrl'; // Import getImageUrl
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ForceLoadImage } from '@/presentation/shared/components/ForceLoadImage'; // Import ForceLoadImage
import { ThemedText } from '@/presentation/theme/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import type { EquipmentData } from '../types';

// Importar de forma condicional para evitar errores en dev build
let MediaLibrary: any = null
let FileSystem: any = null
try {
  MediaLibrary = require('expo-media-library')
  // Usar la API legacy de FileSystem
  FileSystem = require('expo-file-system/legacy')
} catch (e) {
  console.log('⚠️ Módulos nativos no disponibles en este build')
}

interface QRMainViewProps {
  equipmentData: EquipmentData
  onMoreInfo: () => void
}

export const QRMainView: React.FC<QRMainViewProps> = ({ equipmentData, onMoreInfo }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const [isDownloading, setIsDownloading] = useState(false)
  const qrCodeRef = React.useRef<any>(null)

  // Loggear el objeto completo antes de calcular la URL de la imagen
  console.log('[DEBUG] equipmentData en QRMainView:', equipmentData);
  let fullImageUrl = undefined;
  if (equipmentData.path_foto_equipo_implemento) {
    if (equipmentData.path_foto_equipo_implemento.startsWith('http')) {
      fullImageUrl = equipmentData.path_foto_equipo_implemento;
      console.log('[QRMainView] Usando URL directa:', fullImageUrl);
    } else {
      fullImageUrl = getImageUrl(equipmentData.path_foto_equipo_implemento);
      console.log('[QRMainView] Mostrando imagen de equipo:', fullImageUrl);
    }
  } else {
    console.log('[QRMainView] Equipo sin imagen:', equipmentData.sn_equipo);
  }

  const handleDownloadQR = async () => {
    if (!qrCodeRef.current || !equipmentData.qr_hash) return

    // Verificar si los módulos están disponibles
    if (!MediaLibrary || !FileSystem) {
      Alert.alert(
        'ℹ️ Guardar QR',
        'Para guardar el código QR, toma una captura de pantalla.\n\nEsta función requiere un build nativo.',
        [{ text: 'Entendido' }]
      )
      return
    }

    try {
      setIsDownloading(true)

      // Solicitar permisos
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos permiso para guardar imágenes en tu galería',
          [{ text: 'OK' }]
        )
        return
      }

      // Obtener el data URL del QR usando el método toDataURL del componente
      qrCodeRef.current.toDataURL(async (dataURL: string) => {
        try {
          // Crear un nombre de archivo único
          const fileName = `QR_${equipmentData.sn_equipo}_${Date.now()}.png`
          const fileUri = FileSystem.cacheDirectory + fileName

          // Convertir base64 a archivo
          const base64Data = dataURL.replace('data:image/png;base64,', '')
          await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: 'base64'
          })

          // Guardar en la galería
          const asset = await MediaLibrary.createAssetAsync(fileUri)

          // Intentar crear álbum
          try {
            await MediaLibrary.createAlbumAsync('Lumina QR', asset, false)
          } catch {
            // Ya está en galería principal
          }

          Alert.alert(
            'QR Guardado',
            'El código QR se ha guardado en tu galería',
            [{ text: 'OK' }]
          )
        } catch (err) {
          console.error('Error al guardar:', err)
          Alert.alert('❌ Error', 'No se pudo guardar el QR', [{ text: 'OK' }])
        } finally {
          setIsDownloading(false)
        }
      })
    } catch (err) {
      console.error('Error al solicitar permisos:', err)
      Alert.alert('❌ Error', 'No se pudo guardar el QR', [{ text: 'OK' }])
      setIsDownloading(false)
    }
  }

  return (
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.qrSection}>
        <ThemedText type="h2" style={styles.title}>
          {equipmentData.tipo_elemento || 'Sin tipo'}
        </ThemedText>
        <ThemedText type="body1" style={styles.subtitle}>
          Código QR del Equipo
        </ThemedText>

        <View style={[styles.qrContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {!equipmentData.qr_hash ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <ThemedText type="body2" style={styles.loadingText}>
                Generando QR...
              </ThemedText>
            </View>
          ) : (
            <QRCode
              ref={qrCodeRef}
              value={equipmentData.qr_hash}
              size={240}
              color={colors.text}
              backgroundColor={colors.card}
              getRef={(ref) => (qrCodeRef.current = ref)}
            />
          )}
        </View>

        {/* Botón de descarga */}
        <TouchableOpacity
          style={[styles.downloadButton, { backgroundColor: colors.primary }]}
          onPress={handleDownloadQR}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <ThemedText type="body2" style={styles.downloadButtonText}>
                Guardando...
              </ThemedText>
            </>
          ) : (
            <>
              <Ionicons name="download-outline" size={20} color="white" />
              <ThemedText type="body2" style={styles.downloadButtonText}>
                Guardar QR
              </ThemedText>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.equipmentSection}>
        <View style={[styles.equipmentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.equipmentImageContainer}>
            {fullImageUrl ? (
              <ForceLoadImage
                uri={fullImageUrl}
                style={styles.equipmentImage}
                resizeMode="cover"
                onError={e => {
                  console.log('[QRMainView] Error cargando imagen:', e);
                  console.log('[QRMainView] URL que falló:', fullImageUrl);
                }}
                onLoad={() => console.log('[QRMainView] ✅ Imagen cargada exitosamente')}
                fallback={
                  <View style={[styles.equipmentImage, styles.noImagePlaceholder]}>
                    <ThemedText style={{fontSize: 10}}>No Image</ThemedText>
                  </View>
                }
              />
            ) : (
              <View style={[styles.equipmentImage, styles.noImagePlaceholder]}>
                <ThemedText style={{fontSize: 10}}>No Image</ThemedText>
              </View>
            )}
          </View>

          <View style={styles.equipmentDetails}>
            <View style={styles.equipmentRow}>
              <Ionicons name="hardware-chip" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                Tipo:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                {equipmentData.tipo_elemento || 'Sin tipo'}
              </ThemedText>
            </View>

            <View style={styles.equipmentRow}>
              <Ionicons name="business" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                Marca:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                {equipmentData.marca || 'Sin marca'}
              </ThemedText>
            </View>

            <View style={styles.equipmentRow}>
              <Ionicons name="color-palette" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                Color:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                {equipmentData.color || 'Sin color'}
              </ThemedText>
            </View>

            <View style={styles.equipmentRow}>
              <Ionicons name="barcode" size={20} color={colors.primary} />
              <ThemedText type="body1" style={styles.equipmentLabel}>
                N° Serial:
              </ThemedText>
              <ThemedText type="body1" style={styles.equipmentValue}>
                {equipmentData.sn_equipo || 'N/A'}
              </ThemedText>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.moreInfoButton, { backgroundColor: colors.primary }]}
          onPress={onMoreInfo}
        >
          <ThemedText type="body1" style={styles.moreInfoButtonText}>
            Más información
          </ThemedText>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 10,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    opacity: 0.7,
  },
  qrContainer: {
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 300,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  equipmentSection: {
    marginBottom: 20,
  },
  equipmentCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  equipmentImageContainer: {
    marginRight: 16,
  },
  equipmentImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  noImagePlaceholder: {
    backgroundColor: '#E0E0E0', // Light grey background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
  },
  equipmentDetails: {
    flex: 1,
  },
  equipmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  equipmentLabel: {
    marginLeft: 8,
    marginRight: 8,
    fontFamily: 'Poppins-Medium',
    opacity: 0.7,
    fontSize: 14,
    minWidth: 60,
  },
  equipmentValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    flex: 1,
  },
  moreInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moreInfoButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginRight: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 8,
  },
  downloadButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
})