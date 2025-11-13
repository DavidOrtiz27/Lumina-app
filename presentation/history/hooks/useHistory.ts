import { useEffect } from 'react';
import { useHistoryStore } from '../store/useHistoryStore';

/**
 * Hook to automatically load history when component mounts
 */
export const useHistory = () => {
  const { history, status, error, loadHistory, refreshHistory } = useHistoryStore();

  useEffect(() => {
    // Load history on mount if not already loaded
    if (status === 'idle') {
      loadHistory();
    }
  }, [status, loadHistory]);

  return {
    history,
    status,
    error,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
    isEmpty: status === 'success' && history.length === 0,
    refresh: refreshHistory,
  };
};
