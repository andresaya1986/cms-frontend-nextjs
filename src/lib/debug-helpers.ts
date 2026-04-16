/**
 * debug-helpers.ts
 * Utilidades de debugging para verificar configuración de API
 * 
 * Uso:
 * import { logAuthFlow } from '@/lib/debug-helpers';
 * logAuthFlow('login_start', { email, hasToken });
 */

type DebugEventType = 
  | 'login_start'
  | 'login_response'
  | 'login_error'
  | 'token_saved'
  | 'user_set'
  | 'auth_check'
  | 'redirect_dashboard'
  | 'redirect_login'
  | 'session_guard_triggered';

export interface DebugEvent {
  type: DebugEventType;
  timestamp: string;
  data: Record<string, any>;
}

const DEBUG_ENABLED = process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true';
const debugLog: DebugEvent[] = [];

export function logAuthFlow(type: DebugEventType, data: Record<string, any>) {
  if (!DEBUG_ENABLED) return;

  const event: DebugEvent = {
    type,
    timestamp: new Date().toLocaleTimeString(),
    data: {
      ...data,
      url: typeof window !== 'undefined' ? window.location.pathname : 'N/A',
    },
  };

  debugLog.push(event);
  console.log(`[AUTH DEBUG ${event.timestamp}] ${type}:`, event.data);

  // Mantener solo los últimos 50 eventos
  if (debugLog.length > 50) {
    debugLog.shift();
  }
}

export function getDebugLog(): DebugEvent[] {
  return debugLog;
}

export function clearDebugLog() {
  debugLog.length = 0;
}

/**
 * Obtener información de configuración de API para debugging
 */
export function getApiConfig() {
  return {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    version: process.env.NEXT_PUBLIC_API_VERSION,
    fullAuthLoginUrl: `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/auth/login`,
    environment: process.env.NODE_ENV,
    debugEnabled: DEBUG_ENABLED,
  };
}

/**
 * Verificar estado de autenticación desde localStorage
 */
export function getAuthDebugInfo() {
  if (typeof window === 'undefined') {
    return { error: 'Window not available (SSR)' };
  }

  const token = localStorage.getItem('auth_token');
  const refreshToken = localStorage.getItem('refresh_token');

  return {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    hasRefreshToken: !!refreshToken,
    refreshTokenLength: refreshToken?.length || 0,
    tokenPrefix: token?.substring(0, 20) + '...',
  };
}
