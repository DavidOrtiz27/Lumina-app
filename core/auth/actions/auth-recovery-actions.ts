import luminaApi from '../api/luminaApi';

// Tipos para el sistema de recuperación
export type RecoveryError = {
  type: 'validation' | 'network' | 'server' | 'unknown';
  message: string;
  field?: 'email' | 'code' | 'password';
};

export type RecoveryStep = 'send-code' | 'verify-code' | 'reset-password';

// Enviar código de recuperación por email
export const sendRecoveryCode = async (email: string): Promise<{ success: true } | RecoveryError> => {
  try {
    if (!email || !email.includes('@')) {
      return {
        type: 'validation',
        message: 'Por favor ingresa un email válido',
        field: 'email'
      };
    }

    const response = await luminaApi.post('/password/forgot', {
      email
    });

    if (response.status === 200) {
      return { success: true };
    }

    return {
      type: 'server',
      message: 'Error del servidor. Intenta más tarde.'
    };
    
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 404) {
        return {
          type: 'validation',
          message: 'Email no encontrado en nuestro sistema',
          field: 'email'
        };
      }
      if (error.response.status === 429) {
        return {
          type: 'validation',
          message: 'Demasiadas solicitudes. Espera unos minutos',
          field: 'email'
        };
      }
      return {
        type: 'server',
        message: 'Error del servidor. Intenta más tarde.'
      };
    }
    
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return {
        type: 'network',
        message: 'Error de conexión. Verifica tu internet.'
      };
    }

    return {
      type: 'unknown',
      message: 'Ocurrió un error inesperado. Intenta de nuevo.'
    };
  }
};

// Verificar código de recuperación
export const verifyRecoveryCode = async (email: string, code: string): Promise<{ success: true; token: string } | RecoveryError> => {
  try {
    if (!code || code.length !== 6) {
      return {
        type: 'validation',
        message: 'El código debe tener 6 caracteres',
        field: 'code'
      };
    }

    const response = await luminaApi.post('/password/verify-code', {
      email,
      code: code.toUpperCase()
    });

    if (response.status === 200 && response.data?.data?.reset_token) {
      return { 
        success: true, 
        token: response.data.data.reset_token 
      };
    }

    return {
      type: 'server',
      message: 'Error del servidor. Intenta más tarde.'
    };
    
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400) {
        return {
          type: 'validation',
          message: 'Código inválido o expirado',
          field: 'code'
        };
      }
      return {
        type: 'server',
        message: 'Error del servidor. Intenta más tarde.'
      };
    }
    
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return {
        type: 'network',
        message: 'Error de conexión. Verifica tu internet.'
      };
    }

    return {
      type: 'unknown',
      message: 'Ocurrió un error inesperado. Intenta de nuevo.'
    };
  }
};

// Reset de contraseña con token
export const resetPassword = async (
  token: string,
  newPassword: string,
  email: string
): Promise<{ success: true; message: string } | RecoveryError> => {
  try {
    if (!newPassword || newPassword.length < 8) {
      return {
        type: 'validation',
        message: 'La contraseña debe tener al menos 8 caracteres',
        field: 'password'
      };
    }
    if (!email) {
      return {
        type: 'validation',
        message: 'Falta el email',
        field: 'email'
      };
    }
    const response = await luminaApi.post('/password/reset', {
      email,
      reset_token: token,
      password: newPassword,
      password_confirmation: newPassword
    });
    if (response.status === 200 && response.data?.success) {
      return { success: true, message: response.data.message };
    }
    return {
      type: 'server',
      message: 'Error del servidor. Intenta más tarde.'
    };
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400) {
        return {
          type: 'validation',
          message: error.response.data?.message || 'Token inválido o expirado. Solicita un nuevo código',
        };
      }
      return {
        type: 'server',
        message: error.response.data?.message || 'Error del servidor. Intenta más tarde.'
      };
    }
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return {
        type: 'network',
        message: 'Error de conexión. Verifica tu internet.'
      };
    }
    return {
      type: 'unknown',
      message: 'Ocurrió un error inesperado. Intenta de nuevo.'
    };
  }
};