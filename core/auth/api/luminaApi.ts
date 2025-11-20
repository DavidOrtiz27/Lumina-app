import axios from 'axios';
import { Platform } from 'react-native';
import { StorageAdapter } from '../storage/StorageAdapter';

// 🔥 CONFIGURACIÓN DEL SERVIDOR
const USE_LOCAL = true; // Cambia a true para usar servidor local

const LOCAL_URL = 'http://192.168.1.15:8000'; // Para emulador Android (localhost)
const PRODUCTION_URL = 'https://lumina-testing.onrender.com'; // Servidor de producción

// Función para obtener la URL base
const getBaseURL = () => {
  const baseUrl = USE_LOCAL ? LOCAL_URL : PRODUCTION_URL;
  const url = `${baseUrl}/api`;
  console.log(`🔗 [${Platform.OS}] Servidor: ${url} (${USE_LOCAL ? 'LOCAL' : 'PRODUCCIÓN'})`);
  return url;
};

const luminaApi = axios.create({
    baseURL: getBaseURL(),
    timeout: 60000, // 60 segundos de timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

// Interceptor para agregar el token a todas las peticiones
luminaApi.interceptors.request.use(
    async (config) => {
        // No agregar token si es login o registro
        const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
        
        if (!isAuthEndpoint) {
            const token = await StorageAdapter.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        
        // Log en desarrollo
        if (__DEV__) {
            console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
            if (config.url?.includes('/auth/login')) {
                console.log('📧 Login data:', JSON.stringify(config.data));
                console.log('🔑 Headers:', JSON.stringify(config.headers));
            }
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores de autenticación
luminaApi.interceptors.response.use(
    (response) => {
        // Log exitoso en desarrollo
        if (__DEV__) {
            console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        }
        return response;
    },
    async (error) => {
        // Log de error en desarrollo
        if (__DEV__) {
            const url = error.config?.url || 'unknown';
            const status = error.response?.status || 'network error';
            console.error(`❌ ${error.config?.method?.toUpperCase()} ${url} - ${status}`);
            
            // Log adicional para login
            if (url?.includes('/auth/login')) {
                console.error('❌ Login error details:');
                console.error('   Response:', JSON.stringify(error.response?.data));
                console.error('   Status:', error.response?.status);
                console.error('   Headers sent:', JSON.stringify(error.config?.headers));
            }
            
            if (error.code === 'ECONNABORTED') {
                console.error('⏱️ Timeout: La petición tardó más de 60 segundos');
            } else if (error.message === 'Network Error') {
                console.error('🌐 Error de red: Verifica la conexión al servidor');
                console.error(`   URL intentada: ${USE_LOCAL ? LOCAL_URL : PRODUCTION_URL}`);
                if (USE_LOCAL) {
                    console.error('   💡 Asegúrate de que el servidor Laravel esté corriendo:');
                    console.error('      php artisan serve --host=0.0.0.0 --port=8000');
                }
            }
        }
        
        // Si el token expiró o es inválido (401), limpiar la autenticación
        // EXCEPTO si es un error en el endpoint de login
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
            console.warn('🔒 Token inválido o expirado - limpiando sesión');
            await StorageAdapter.clearAuthData();
        }
        
        return Promise.reject(error);
    }
);

export default luminaApi;