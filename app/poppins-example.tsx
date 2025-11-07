import { PoppinsFonts } from '@/constants/theme';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import { ThemedView } from '@/presentation/theme/components/themed-view';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function PoppinsFontExample() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <ThemedText type="h1" style={styles.sectionTitle}>
          Fuentes Poppins en Lumina App
        </ThemedText>
        
        <View style={styles.section}>
          <ThemedText type="h2" style={styles.subtitle}>
            Encabezados
          </ThemedText>
          <ThemedText type="h1">H1 - Poppins Bold (32px)</ThemedText>
          <ThemedText type="h2">H2 - Poppins SemiBold (28px)</ThemedText>
          <ThemedText type="h3">H3 - Poppins SemiBold (24px)</ThemedText>
          <ThemedText type="h4">H4 - Poppins Medium (20px)</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.subtitle}>
            Texto del Cuerpo
          </ThemedText>
          <ThemedText type="body1">
            Body 1 - Poppins Regular (16px): Este es un texto de párrafo principal
            que usa Poppins Regular para una excelente legibilidad.
          </ThemedText>
          <ThemedText type="body2">
            Body 2 - Poppins Regular (14px): Texto más pequeño para contenido secundario.
          </ThemedText>
          <ThemedText type="caption">
            Caption - Poppins Regular (12px): Texto pequeño para etiquetas y descripciones.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.subtitle}>
            Estilos Especiales
          </ThemedText>
          <ThemedText type="button" style={styles.buttonText}>
            Botón - Poppins Medium (16px)
          </ThemedText>
          <ThemedText type="link" style={styles.linkText}>
            Enlace - Poppins Medium (16px)
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.subtitle}>
            Estilos Clásicos Actualizados
          </ThemedText>
          <ThemedText type="title">Título - Poppins Bold</ThemedText>
          <ThemedText type="subtitle">Subtítulo - Poppins SemiBold</ThemedText>
          <ThemedText type="default">Texto por defecto - Poppins Regular</ThemedText>
          <ThemedText type="defaultSemiBold">Texto destacado - Poppins SemiBold</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.subtitle}>
            Uso Manual de Fuentes
          </ThemedText>
          <ThemedText style={{ fontFamily: PoppinsFonts.regular }}>
            Usando PoppinsFonts.regular directamente
          </ThemedText>
          <ThemedText style={{ fontFamily: PoppinsFonts.medium }}>
            Usando PoppinsFonts.medium directamente
          </ThemedText>
          <ThemedText style={{ fontFamily: PoppinsFonts.semiBold }}>
            Usando PoppinsFonts.semiBold directamente
          </ThemedText>
          <ThemedText style={{ fontFamily: PoppinsFonts.bold }}>
            Usando PoppinsFonts.bold directamente
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  subtitle: {
    marginBottom: 15,
  },
  buttonText: {
    backgroundColor: '#839cee',
    color: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    textAlign: 'center',
    marginVertical: 5,
  },
  linkText: {
    marginVertical: 5,
  },
});