import axios from 'axios';
import { Platform } from 'react-native';
import { StorageAdapter } from '../storage/StorageAdapter';

// Función para obtener la URL base correcta según la plataforma
const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Para emulador Android, usar 192.168.1.11 que mapea al localhost de la máquina host
      return 'http://10.2.234.180:8000/api';
    } else if (Platform.OS === 'ios') {
      // Para simulador iOS, localhost funciona
      return 'http://localhost:8000/api';
    } else {
      // Para web
      return 'http://localhost:8000/api';
    }
  } else {
    // Para producción, usar tu URL de producción
    return 'https://your-production-api.com/api';
  }
};

const luminaApi = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000, // 10 segundos de timeout
})

// Interceptor para agregar el token a todas las peticiones
luminaApi.interceptors.request.use(
    async (config) => {
        const token = await StorageAdapter.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
        return response;
    },
    async (error) => {
        // Si el token expiró o es inválido (401), limpiar la autenticación
        if (error.response?.status === 401) {
            await StorageAdapter.clearAuthData();
            // Aquí podrías emitir un evento o llamar a un método para actualizar el estado global
        }

        // Manejo silencioso de errores - sin logs de desarrollo
        
        return Promise.reject(error);
    }
);

export default luminaApi;