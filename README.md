# 📱 Lumina App - Sistema de Gestión de Equipos

> **Aplicación React Native/Expo para gestión y monitoreo de equipos con sistema de autenticación completo**

## 🏗️ **Arquitectura del Proyecto**

### **Tecnologías Principales**
- **Framework**: React Native + Expo (v54.0.22)
- **Lenguaje**: TypeScript
- **Navegación**: Expo Router (file-based routing)
- **Estado**: Zustand para autenticación
- **UI**: Components personalizados + Theming
- **Iconos**: Expo Vector Icons

### **Estructura del Código**
```
Lumina-app/
├── app/                          # Expo Router (Navegación)
│   ├── (limna-app)/             # Rutas protegidas
│   │   ├── (home)/              # Dashboard principal
│   │   ├── history/             # Historial de movimientos
│   │   └── qr/                  # Código QR y detalles
│   ├── auth/                    # Autenticación
│   │   ├── login/               # Login
│   │   └── recovery/            # Recuperación de contraseña
│   └── _layout.tsx              # Layout principal
├── presentation/                # Capa de presentación modular
│   ├── auth/                    # Módulo de autenticación
│   │   ├── components/          # Componentes de auth
│   │   ├── hooks/               # Custom hooks
│   │   └── store/               # Zustand store
│   ├── history/                 # Módulo de historial
│   │   ├── components/          # Componentes modulares
│   │   ├── data/                # Datos mock
│   │   ├── types/               # Interfaces TypeScript
│   │   └── utils/               # Utilidades de filtrado
│   ├── home/                    # Módulo principal
│   │   ├── components/          # Componentes del home
│   │   └── data/                # Datos de equipos
│   ├── qr/                      # Módulo QR
│   │   └── components/          # Vistas QR modulares
│   └── theme/                   # Sistema de theming
├── core/                        # Lógica de negocio
│   └── auth/                    # API y storage
└── constants/                   # Constantes globales
```

---

## 🚀 **Comandos de Desarrollo**

### **Instalación y Ejecución**
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
# o
npx expo start
```

### **Plataformas Soportadas**
- 📱 **Android** (emulador/dispositivo)
- 🍎 **iOS** (simulador/dispositivo) 
- 🌐 **Web** (navegador)
- 📲 **Expo Go** (para testing rápido)

---

## 🔐 **Sistema de Autenticación**

### **Funcionalidades Completadas**
- ✅ **Login** con email y contraseña
- ✅ **Persistencia de sesión** con AsyncStorage
- ✅ **Logout seguro** con limpieza de datos
- ✅ **Recuperación de contraseña**
- ✅ **Validación visual** estilo Facebook/Instagram
- ✅ **Alertas personalizadas** con iconos y colores

### **Credenciales de Prueba**
```
Email: test@example.com
Password: password123
```

---

## 📊 **Funcionalidades Principales**

### **🏠 Dashboard**
- Lista de equipos disponibles
- Cards informativas con imágenes
- Navegación a código QR

### **📱 Sistema QR** 
- Código QR generado dinámicamente
- Vista de detalles del equipo
- Navegación fluida entre vistas

### **📋 Historial Modular**
- Tabs separados: Ingreso y Egreso
- Filtros por período: Día, Semana, Mes, Todos
- Cards detalladas con fecha, hora y ubicación
- Sin estados ni contadores (diseño limpio)

### **🎨 Theming**
- Soporte tema claro/oscuro automático
- Colores consistentes en toda la app
- Componentes themed (ThemedView, ThemedText)

---

## 📋 **Estado del Proyecto**

### **✅ Completado**
- [x] Sistema de autenticación completo
- [x] Alertas personalizadas elegantes
- [x] Validación visual avanzada
- [x] Historial modular con tabs y filtros
- [x] Dashboard principal operativo
- [x] Sistema QR funcional
- [x] Arquitectura modular implementada
- [x] Theming completo

### **📅 Próximas Funcionalidades**
- [ ] Integración con backend real
- [ ] Pruebas unitarias

---

## 📚 **Documentación Técnica**

Para documentación técnica detallada sobre cada módulo, consultar:
- **Autenticación**: Implementación completa con Zustand + AsyncStorage
- **Alertas**: Sistema de alertas personalizadas con tipos y animaciones  
- **Historial**: Arquitectura modular con componentes reutilizables
- **Testing**: Servidor Express simple para pruebas de API

---

**Desarrollado con ❤️ usando React Native + Expo**
