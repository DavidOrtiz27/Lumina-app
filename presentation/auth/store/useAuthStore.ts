import { authCheckStatus, authLogin, authLogout, type AuthError } from "@/core/auth/actions/auth-actions";
import { User } from "@/core/auth/interface/user";
import { useEquipmentStore } from "@/presentation/equipment/store/useEquipmentStore";
import { useHistoryStore } from "@/presentation/history/store/useHistoryStore";
import { create } from "zustand";

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking';

export interface AuthState {
    status: AuthStatus;
    token?: string;
    user?: User;

    login: (email: string, password: string) => Promise<{ success: boolean, error?: AuthError }>;
    checkAuthStatus: () => Promise<void>;
    logout: () => Promise<void>;

    changeStatus: (token?: string, user?: User) => boolean;
}


export const useAuthStore = create<AuthState>()((set, get) => ({
    //propiedades iniciales
    status: 'checking',
    token: undefined,
    user: undefined,


    //Acciones
    login: async (email: string, password: string) => {
        const resp = await authLogin(email, password);

        // Si es null, no hay respuesta
        if (!resp) {
            return { success: false };
        }

        // Si tiene la propiedad 'type', es un error
        if ('type' in resp) {
            return { success: false, error: resp };
        }

        // Si llegamos aquí, es un login exitoso
        const success = get().changeStatus(resp.token, resp.user);
        return { success };
    },


    changeStatus: (token?: string, user?: User) => {
        if (!token || !user) {
            set({ status: 'unauthenticated', user: undefined, token: undefined });
            return false;
        }
        set({
            status: 'authenticated',
            token: token,
            user: user,
        })
        return true;
    },

    checkAuthStatus: async () => {
        const resp = await authCheckStatus();
        if (!resp) {
            set({ status: 'unauthenticated', user: undefined, token: undefined });
            return;
        }
        set({
            status: 'authenticated',
            user: resp.user,
            token: resp.token,
        });
        return;
    },


    logout: async () => {
        await authLogout();
        useHistoryStore.getState().clearHistory();
        useEquipmentStore.getState().clearEquipments();
        set({ status: 'unauthenticated', user: undefined, token: undefined });
    },
}));