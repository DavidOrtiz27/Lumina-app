import luminaApi from "@/core/auth/api/luminaApi";
import { HistoryEntry } from "@/presentation/history/types";

interface HistoryResponse {
    success: boolean;
    data: HistoryEntry[];
}

export type HistoryError = {
    type: 'NETWORK_ERROR' | 'SERVER_ERROR' | 'NOT_FOUND' | 'UNKNOWN_ERROR';
    message: string;
    originalError?: any;
}

/**
 * Get all history entries for the authenticated user
 */
export const getMyHistory = async (): Promise<HistoryEntry[] | HistoryError> => {
    try {
        const response = await luminaApi.get<HistoryResponse>('/usuario/historial');
        
        if (response.data.success) {
            return response.data.data;
        }
        
        return {
            type: 'SERVER_ERROR',
            message: 'Error al obtener el historial',
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
                message: 'Ocurrió un error inesperado al obtener el historial.',
                originalError: error
            };
        }
    }
};
