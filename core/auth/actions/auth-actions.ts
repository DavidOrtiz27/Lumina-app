import luminaApi from "../api/luminaApi";
import { User } from "../interface/user";
import { StorageAdapter } from "../storage/StorageAdapter";

export interface AuthResponse {
    id:       string;
    email:    string;
    fullName: string;
    isActive: boolean;
    roles:    string[];
    token:    string;
}


const returnUserToken = (data: AuthResponse):{user:User, token:string} => {
    /* const { id,email, fullName, isActive, roles, token } = data; */

    const {token, ...user} = data;

    return {user, token};

}



// Tipos de error de autenticación
export type AuthError = {
    type: 'INVALID_CREDENTIALS' | 'NETWORK_ERROR' | 'SERVER_ERROR' | 'UNKNOWN_ERROR';
    message: string;
    originalError?: any;
}

export const authLogin = async (email: string, password: string): Promise<{user: User, token: string} | AuthError | null> => {
    email = email.toLowerCase()

    try {
        const {data} = await luminaApi.post<AuthResponse>('/auth/login', {email, password});
        const result = returnUserToken(data);
        
        // Guardar token y usuario en el almacenamiento persistente
        await StorageAdapter.setToken(result.token);
        await StorageAdapter.setUser(result.user);
        
        return result;
    } catch (error: any) {
        // Crear objeto de error específico según el tipo
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
            return {
                type: 'NETWORK_ERROR',
                message: 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
                originalError: error
            };
        } else if (error.response?.status === 400) {
            // Extraer mensajes específicos del servidor si están disponibles
            const serverMessages = error.response?.data?.message;
            let validationMessage = 'Formato de datos inválido. Verifica que tu contraseña tenga al menos 6 caracteres, mayúsculas, minúsculas y números.';
            
            if (Array.isArray(serverMessages) && serverMessages.length > 0) {
                // Traducir los mensajes del servidor al español
                const translatedMessages = serverMessages.map((msg: string) => {
                    if (msg.includes('Uppercase, lowercase letter and a number')) {
                        return 'debe contener mayúsculas, minúsculas y números';
                    }
                    if (msg.includes('longer than or equal to 6 characters')) {
                        return 'debe tener al menos 6 caracteres';
                    }
                    return msg;
                });
                validationMessage = `La contraseña ${translatedMessages.join(' y ')}.`;
            }
            
            return {
                type: 'INVALID_CREDENTIALS',
                message: validationMessage,
                originalError: error
            };
        } else if (error.response?.status === 401) {
            return {
                type: 'INVALID_CREDENTIALS',
                message: 'Email o contraseña incorrectos. Por favor verifica tus credenciales.',
                originalError: error
            };
        } else if (error.response?.status === 500) {
            return {
                type: 'SERVER_ERROR',
                message: 'Error interno del servidor. Intenta de nuevo más tarde.',
                originalError: error
            };
        } else {
            return {
                type: 'UNKNOWN_ERROR',
                message: 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
                originalError: error
            };
        }
    }
};


export const authCheckStatus = async () => {
    try {
        // Primero verificamos si hay datos guardados localmente
        const storedToken = await StorageAdapter.getToken();
        const storedUser = await StorageAdapter.getUser();
        
        if (!storedToken || !storedUser) {
            return null;
        }

        // Verificamos con el servidor que el token sigue siendo válido
        const {data} = await luminaApi.get<AuthResponse>('/auth/check-status');
        const result = returnUserToken(data);
        
        // Actualizamos los datos guardados por si hay cambios
        await StorageAdapter.setToken(result.token);
        await StorageAdapter.setUser(result.user);
        
        return result;
    } catch (error) {
        // Si hay error, limpiamos los datos guardados
        await StorageAdapter.clearAuthData();
        return null;
    }
}

export const authLogout = async () => {
    try {
        // Intentamos notificar al servidor del logout
        await luminaApi.post('/auth/logout');
    } catch (error) {
        // Error silencioso - endpoint /logout puede no existir
    } finally {
        // Siempre limpiamos los datos locales
        await StorageAdapter.clearAuthData();
    }
}

