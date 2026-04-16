// Utilidades comunes para la aplicación

/**
 * Logger utility
 */
export const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NEXT_PUBLIC_LOG_LEVEL === 'debug') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
};

/**
 * Formatea una fecha a formato legible
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

/**
 * Formatea una fecha a hora legible
 */
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * Formatea fecha y hora
 */
export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Valida un email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Trunca un texto a una longitud máxima
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitaliza la primera letra de una palabra
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Obtiene el acrónimo de un nombre
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

/**
 * Maneja errores de API
 */
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'Algo salió mal. Por favor intenta de nuevo.';
};

/**
 * Valida una contraseña
 */
export const isValidPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Espera un tiempo determinado
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Obtiene el color para un hash (útil para avatares)
 */
export const getColorFromHash = (str: string): string => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B88B',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
