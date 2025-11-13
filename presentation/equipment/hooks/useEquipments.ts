import { useEffect } from 'react';
import { useEquipmentStore } from '../store/useEquipmentStore';

/**
 * Hook to automatically load equipments when component mounts
 */
export const useEquipments = () => {
  const { equipments, status, error, loadEquipments, refreshEquipments } = useEquipmentStore();

  useEffect(() => {
    // Load equipments on mount if not already loaded
    if (status === 'idle') {
      loadEquipments();
    }
  }, [status, loadEquipments]);

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
