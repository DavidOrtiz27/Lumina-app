import { getMyHistory, HistoryError } from '@/core/history/actions/history-actions';
import { HistoryEntry } from '@/presentation/history/types';
import { create } from 'zustand';

export type HistoryStatus = 'idle' | 'loading' | 'success' | 'error';

interface HistoryState {
  history: HistoryEntry[];
  status: HistoryStatus;
  error: HistoryError | null;

  loadHistory: () => Promise<void>;
  refreshHistory: () => Promise<void>;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  status: 'idle',
  error: null,

  loadHistory: async () => {
    set({ status: 'loading', error: null });

    try {
      const result = await getMyHistory();

      if (Array.isArray(result)) {
        set({ 
          history: result, 
          status: 'success',
          error: null 
        });
      } else {
        set({ 
          history: [], 
          status: 'error', 
          error: result 
        });
      }
    } catch (error: any) {
      set({ 
        history: [], 
        status: 'error', 
        error: {
          type: 'UNKNOWN_ERROR',
          message: 'Error inesperado al cargar el historial',
          originalError: error
        }
      });
    }
  },

  refreshHistory: async () => {
    // Similar a loadHistory pero no cambia el status a loading inmediatamente
    // Útil para pull-to-refresh
    try {
      const result = await getMyHistory();

      if (Array.isArray(result)) {
        set({ 
          history: result, 
          status: 'success',
          error: null 
        });
      } else {
        set({ 
          status: 'error', 
          error: result 
        });
      }
    } catch (error: any) {
      set({ 
        status: 'error', 
        error: {
          type: 'UNKNOWN_ERROR',
          message: 'Error inesperado al actualizar el historial',
          originalError: error
        }
      });
    }
  },

  clearHistory: () => {
    set({ 
      history: [], 
      status: 'idle', 
      error: null 
    });
  },
}));
