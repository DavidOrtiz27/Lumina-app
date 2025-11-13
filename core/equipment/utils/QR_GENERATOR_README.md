# Sistema de Generación de QR con Hash SHA-256

## 📋 Descripción General

Este módulo maneja la generación de códigos QR únicos para equipos usando hash SHA-256 basado en la información del equipo. El sistema garantiza la integridad y autenticidad de los códigos QR generados.

---

## 📁 Estructura de Archivos

```
core/equipment/utils/
  └── qr-generator.ts          # Funciones de generación y validación de hash SHA-256

presentation/equipment/hooks/
  └── useEquipmentQR.ts         # Hook React para usar en componentes
```

---

## 🔐 Funciones Principales

### 1. `generateEquipmentHash(equipment: Equipment)`
Genera un hash SHA-256 único incluyendo timestamp para asegurar unicidad en cada generación.

**Datos utilizados:**
- ID del equipo
- Serial del equipo (sn_equipo)
- Marca
- Tipo de elemento
- Timestamp actual

**Retorna:** String con hash SHA-256 en formato hexadecimal

---

### 2. `generateDeterministicHash(equipment: Equipment)`
Genera un hash SHA-256 determinista (sin timestamp) para validación.

**Datos utilizados:**
- ID del equipo
- Serial del equipo (sn_equipo)
- Marca
- Tipo de elemento

**Retorna:** String con hash SHA-256 en formato hexadecimal

**Uso:** Validar que un QR escaneado corresponde al equipo correcto

---

### 3. `generateQRContent(equipment: Equipment)`
Genera el contenido completo del código QR en formato JSON.

**Estructura del JSON:**
```json
{
  "version": "1.0",
  "type": "equipment",
  "hash": "abc123...",
  "equipment": {
    "id": 1,
    "sn_equipo": "LAP001HP2024",
    "tipo_elemento": "Laptop",
    "marca": "HP"
  },
  "timestamp": "2025-11-12T10:30:00.000Z"
}
```

**Retorna:** String JSON listo para generar el código QR

---

### 4. `validateQRCode(scannedData: string, equipment: Equipment)`
Valida que un QR escaneado corresponde a un equipo específico.

**Parámetros:**
- `scannedData`: String JSON del QR escaneado
- `equipment`: Objeto del equipo a validar

**Proceso de validación:**
1. Parsea el JSON del QR
2. Verifica estructura básica
3. Compara el ID del equipo
4. Genera hash del equipo actual
5. Compara hashes

**Retorna:** `true` si el QR es válido, `false` si no lo es

---

### 5. `parseQRData(scannedData: string)`
Extrae información del equipo desde un QR escaneado.

**Retorna:**
```typescript
{
  id: number,
  sn_equipo: string,
  tipo_elemento: string,
  marca: string,
  hash: string
} | null
```

---

### 6. `generateSimpleHash(equipment: Equipment)`
Genera un hash simple usando base64 como fallback si falla la generación SHA-256.

**Retorna:** String con hash simple

---

## 🎣 Hook: useEquipmentQR

Hook personalizado para usar en componentes React.

### Uso:

```typescript
import { useEquipmentQR } from '@/presentation/equipment/hooks/useEquipmentQR';

const MyComponent = ({ equipment }) => {
  const { qrContent, isGenerating, error, validateScannedQR } = useEquipmentQR(equipment);
  
  if (isGenerating) return <Loading />;
  if (error) return <Error message={error} />;
  
  return <QRCode value={qrContent} />;
};
```

### Propiedades retornadas:

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `qrContent` | string | Contenido JSON del QR generado |
| `isGenerating` | boolean | Indica si está generando el hash |
| `error` | string \| null | Mensaje de error si falla la generación |
| `validateScannedQR` | function | Función para validar QR escaneados |
| `parseScannedQR` | function | Función para parsear QR escaneados |

---

## 🔧 Componentes Actualizados

### 1. **EquipmentCard**
- Genera QR automáticamente al renderizar
- Muestra loading mientras genera el hash
- Usa el hash SHA-256 en lugar del `qr_hash` del servidor

### 2. **QRMainView**
- Genera QR de 240x240 con hash SHA-256
- Muestra estados: loading, error, o QR generado
- Incluye toda la información del equipo

### 3. **QRDetailsView**
- Muestra información completa del equipo
- Lista elementos adicionales con imágenes
- El QR se mantiene consistente con QRMainView

---

## 🔒 Seguridad

### Ventajas del sistema:

1. **Integridad:** El hash SHA-256 garantiza que no se puede modificar la información sin que se note
2. **Unicidad:** Cada equipo tiene un hash único basado en sus datos
3. **Validación:** Se puede verificar que un QR corresponde al equipo correcto
4. **Trazabilidad:** Timestamp incluido para auditoría

### Datos protegidos por el hash:

- ID del equipo
- Serial del equipo
- Marca
- Tipo de elemento

---

## 📊 Flujo de Trabajo

### Generación de QR:

```
Equipment Data → generateDeterministicHash() 
  → generateQRContent() 
  → JSON String 
  → QR Code Visual
```

### Escaneo y Validación:

```
QR Scanned → parseQRData() 
  → Extract Equipment Info 
  → validateQRCode() 
  → Verify Hash 
  → Valid/Invalid Result
```

---

## 🛠️ Dependencias

- **expo-crypto**: Para generación de hash SHA-256
- **react-native-qrcode-svg**: Para renderizar códigos QR

---

## 📝 Notas Importantes

1. El hash **determinista** (sin timestamp) se usa para validación
2. El hash **con timestamp** se puede usar para generaciones únicas
3. Si falla la generación SHA-256, se usa hash simple como fallback
4. El contenido del QR está en formato JSON para facilitar el parsing

---

## 🔄 Ejemplo Completo

```typescript
// 1. Importar el hook
import { useEquipmentQR } from '@/presentation/equipment/hooks/useEquipmentQR';

// 2. Usar en componente
const EquipmentQRDisplay = ({ equipment }) => {
  const { qrContent, isGenerating, error, validateScannedQR } = useEquipmentQR(equipment);
  
  // 3. Manejar estados
  if (isGenerating) {
    return <ActivityIndicator />;
  }
  
  if (error) {
    return <Text>Error: {error}</Text>;
  }
  
  // 4. Renderizar QR
  return (
    <QRCode 
      value={qrContent}
      size={200}
    />
  );
};

// 5. Validar QR escaneado
const handleScan = async (scannedData: string) => {
  const isValid = await validateScannedQR(scannedData);
  
  if (isValid) {
    console.log('QR válido para este equipo');
  } else {
    console.log('QR no corresponde a este equipo');
  }
};
```

---

## 🚀 Próximas Mejoras

- [ ] Agregar encriptación adicional al contenido del QR
- [ ] Implementar firma digital del QR
- [ ] Cache de hashes generados para mejorar rendimiento
- [ ] Soporte para QR offline con sincronización posterior
- [ ] Historial de validaciones de QR escaneados
