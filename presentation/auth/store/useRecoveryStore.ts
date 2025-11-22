import {
  resetPassword,
  sendRecoveryCode,
  verifyRecoveryCode,
  type RecoveryError,
  type RecoveryStep
} from '@/core/auth/actions/auth-recovery-actions'
import { create } from 'zustand'

export interface RecoveryState {
  currentStep: RecoveryStep
  email: string
  code: string
  newPassword: string
  confirmPassword: string
  isLoading: boolean
  recoveryToken: string
  error?: RecoveryError

  setStep: (step: RecoveryStep) => void
  setEmail: (email: string) => void
  setCode: (code: string) => void
  setNewPassword: (password: string) => void
  setConfirmPassword: (password: string) => void

  sendCode: () => Promise<void>
  verifyCode: () => Promise<void>
  resetPassword: () => Promise<boolean>

  clearErrors: () => void
  resetState: () => void
}

const initialState = {
  currentStep: 'send-code' as RecoveryStep,
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
  isLoading: false,
  recoveryToken: '',
  error: undefined
}

export const useRecoveryStore = create<RecoveryState>()((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  setEmail: (email) => set({ email }),
  setCode: (code) => set({ code }),
  setNewPassword: (password) => set({ newPassword: password }),
  setConfirmPassword: (password) => set({ confirmPassword: password }),

  sendCode: async () => {
    const { email } = get()
    if (!email.trim()) {
      set({
        error: {
          type: 'validation',
          message: 'Por favor ingresa tu email',
          field: 'email'
        }
      })
      return
    }

    set({ isLoading: true, error: undefined })
    await sendRecoveryCode(email)
    
    // No manejamos el error aquí, siempre pasamos al siguiente paso
    set({ isLoading: false, currentStep: 'verify-code' })
  },

  verifyCode: async () => {
    const { email, code } = get()
    if (!code.trim()) {
      set({
        error: {
          type: 'validation',
          message: 'Por favor ingresa el código',
          field: 'code'
        }
      })
      return
    }

    set({ isLoading: true, error: undefined })
    const result = await verifyRecoveryCode(email, code)
    
    if ('success' in result) {
      set({
        isLoading: false,
        recoveryToken: result.token,
        currentStep: 'reset-password',
        error: undefined
      })
    } else {
      set({ isLoading: false, error: result })
    }
  },

  resetPassword: async () => {
    const { recoveryToken, newPassword, confirmPassword, email } = get()
    if (!newPassword.trim()) {
      set({
        error: {
          type: 'validation',
          message: 'Por favor ingresa una nueva contraseña',
          field: 'password'
        }
      })
      return false
    }

    if (newPassword !== confirmPassword) {
      set({
        error: {
          type: 'validation',
          message: 'Las contraseñas no coinciden',
          field: 'password'
        }
      })
      return false
    }

    set({ isLoading: true, error: undefined })
    const result = await resetPassword(recoveryToken, newPassword, email)

    if ('success'in result) {
        set({
          isLoading: false,
          error: undefined
        })
        return true
      } else {
        set({ isLoading: false, error: result })
        return false
      }
    },
  
    clearErrors: () => set({ error: undefined }),
    resetState: () => set(initialState)
  }))