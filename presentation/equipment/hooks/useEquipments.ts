import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useEffect } from 'react';
import { useEquipmentStore } from '../store/useEquipmentStore';

/**
 * Hook to automatically load equipments when component mounts
 */
export const useEquipments = () => {
  const { equipments, status, error, loadEquipments, refreshEquipments } = useEquipmentStore();
  const { status: authStatus } = useAuthStore();

  useEffect(() => {
    // Solo cargar equipos si el usuario está autenticado
    if (authStatus !== 'authenticated') {
      return;
    }

    // Load equipments on mount if not already loaded
    if (status === 'idle') {
      loadEquipments();
    }
  }, [status, authStatus, loadEquipments]);

  return {
    equipments,
    status,
    error,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
    isEmpty: status === 'success' && equipments.length === 0,
    refresh: refreshEquipments,
  };
};
