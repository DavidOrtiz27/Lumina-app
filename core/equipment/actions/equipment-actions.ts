import luminaApi from "@/core/auth/api/luminaApi";
import { Equipment } from "../interface/equipment";

interface EquipmentResponse {
    success: boolean;
    data: Equipment[];
}

interface SingleEquipmentResponse {
    success: boolean;
    data: Equipment;
}

export type EquipmentError = {
    type: 'NETWORK_ERROR' | 'SERVER_ERROR' | 'NOT_FOUND' | 'UNKNOWN_ERROR';
    message: string;
    originalError?: any;
}

/**
 * Get all equipment assigned to the authenticated user
 */
export const getMyEquipments = async (): Promise<Equipment[] | EquipmentError> => {
    try {
        const response = await luminaApi.get<EquipmentResponse>('/usuario/equipos');
        
        if (response.data.success) {
            return response.data.data;
        }
        
        return {
            type: 'SERVER_ERROR',
            message: 'Error al obtener los equipos',
        };
        
    } catch (error: any) {
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
            return {
                type: 'NETWORK_ERROR',
                message: 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
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
                message: 'Asegurate de tener equipos o elementos registrados.',
                originalError: error
            };
        }
    }
};

/**
 * Get a specific equipment by ID
 */
export const getEquipmentById = async (id: string): Promise<Equipment | EquipmentError> => {
    try {
        const response = await luminaApi.get<SingleEquipmentResponse>(`/user/equipments/${id}`);
        
        if (response.data.success) {
            return response.data.data;
        }
        
        return {
            type: 'SERVER_ERROR',
            message: 'Error al obtener el equipo',
        };
        
    } catch (error: any) {
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
            return {
                type: 'NETWORK_ERROR',
                message: 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
                originalError: error
            };
        } else if (error.response?.status === 404) {
            return {
                type: 'NOT_FOUND',
                message: 'Equipo no encontrado o no asignado al usuario.',
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
                message: 'Ocurrió un error inesperado al obtener el equipo.',
                originalError: error
            };
        }
    }
};

/**
 * Get equipment by QR hash
 */
export const getEquipmentByQrHash = async (qrHash: string): Promise<Equipment | EquipmentError> => {
    try {
        const response = await luminaApi.get<SingleEquipmentResponse>(`/user/equipments/qr/${qrHash}`);
        
        if (response.data.success) {
            return response.data.data;
        }
        
        return {
            type: 'SERVER_ERROR',
            message: 'Error al obtener el equipo',
        };
        
    } catch (error: any) {
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
            return {
                type: 'NETWORK_ERROR',
                message: 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
                originalError: error
            };
        } else if (error.response?.status === 404) {
            return {
                type: 'NOT_FOUND',
                message: 'Equipo no encontrado con el código QR proporcionado.',
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
                message: 'Ocurrió un error inesperado al obtener el equipo.',
                originalError: error
            };
        }
    }
};
