import { create } from "zustand";
import { Equipment } from "@/core/equipment/interface/equipment";
import { getMyEquipments, getEquipmentById, type EquipmentError } from "@/core/equipment/actions/equipment-actions";

export type EquipmentStatus = 'idle' | 'loading' | 'success' | 'error';

export interface EquipmentState {
    status: EquipmentStatus;
    equipments: Equipment[];
    selectedEquipment?: Equipment;
    error?: EquipmentError;

    // Actions
    loadEquipments: () => Promise<void>;
    selectEquipment: (id: string) => Promise<void>;
    clearSelectedEquipment: () => void;
    refreshEquipments: () => Promise<void>;
}

export const useEquipmentStore = create<EquipmentState>()((set, get) => ({
    // Initial state
    status: 'idle',
    equipments: [],
    selectedEquipment: undefined,
    error: undefined,

    // Load all user equipments
    loadEquipments: async () => {
        set({ status: 'loading', error: undefined });
        
        const result = await getMyEquipments();
        
        // Check if result is an error
        if ('type' in result) {
            set({ 
                status: 'error', 
                error: result,
                equipments: []
            });
            return;
        }
        
        // Success - result is Equipment[]
        set({ 
            status: 'success', 
            equipments: result,
            error: undefined
        });
    },

    // Select a specific equipment by ID
    selectEquipment: async (id: string) => {
        set({ status: 'loading', error: undefined });
        
        const result = await getEquipmentById(id);
        
        // Check if result is an error
        if ('type' in result) {
            set({ 
                status: 'error', 
                error: result,
                selectedEquipment: undefined
            });
            return;
        }
        
        // Success - result is Equipment
        set({ 
            status: 'success', 
            selectedEquipment: result,
            error: undefined
        });
    },

    // Clear selected equipment
    clearSelectedEquipment: () => {
        set({ selectedEquipment: undefined });
    },

    // Refresh equipments (reload from server)
    refreshEquipments: async () => {
        await get().loadEquipments();
    },
}));
