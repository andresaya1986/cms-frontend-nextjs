'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getApiConfig, getAuthDebugInfo, logAuthFlow } from '@/lib/debug-helpers';

interface ErrorType {
  type: 'user_not_found' | 'invalid_password' | 'too_many_attempts' | 'unknown' | 'network' | 'account_inactive';
  message: string;
  suggestion?: string;
}

function parseAuthError(err: any): ErrorType {
  const errorObj = err as any;
  const status = errorObj?.response?.status;
  const data = errorObj?.response?.data;
  const message = data?.message || data?.error || '';

  // Error 429: Demasiados intentos
  if (status === 429) {
    return {
      type: 'too_many_attempts',
      message: 'Demasiados intentos fallidos',
      suggestion: 'Por favor espera 60 segundos antes de intentar de nuevo. Si olvidaste tu contraseña, puedes resetearla aquí.',
    };
  }

  // Error 401: No autenticado
  if (status === 401) {
    // Tratar de diferenciar entre usuario no existe vs contraseña incorrecta
    if (message.toLowerCase().includes('not found') || message.toLowerCase().includes('no existe')) {
      return {
        type: 'user_not_found',
        message: 'No encontramos una cuenta con este correo',
        suggestion: '¿No tienes cuenta? Puedes registrarte aquí. Si crees que es un error, intenta con otro correo.',
      };
    }
    if (message.toLowerCase().includes('password') || message.toLowerCase().includes('contraseña')) {
      return {
        type: 'invalid_password',
        message: 'Contraseña incorrecta',
        suggestion: '¿Olvidaste tu contraseña? Puedes resetearla aquí.',
      };
    }
    // Por defecto para 401
    return {
      type: 'invalid_password',
      message: 'Email o contraseña incorrectos',
      suggestion: '¿Olvidaste tu contraseña? Puedes resetearla aquí.',
    };
  }

  // Error de red
  if (status === 0 || !status) {
    return {
      type: 'network',
      message: 'Error de conexión',
      suggestion: 'No pudimos conectar con el servidor. Verifica tu conexión a internet e intenta de nuevo.',
    };
  }

  // Error 403: Cuenta inactiva
  if (status === 403) {
    return {
      type: 'account_inactive',
      message: 'Tu cuenta está inactiva',
      suggestion: 'Contacta al administrador para activar tu cuenta.',
    };
  }

  // Error desconocido
  return {
    type: 'unknown',
    message: message || 'Hubo un error al iniciar sesión',
    suggestion: 'Por favor intenta de nuevo. Si el problema persiste, contacta al soporte.',
  };
}

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si hay cooldown, no permitir submit
    if (cooldownSeconds > 0) {
      return;
    }

    setError(null);
    setIsLoading(true);

    logAuthFlow('login_start', { email, debugInfo: getAuthDebugInfo() });

    try {
      const response = await login(email, password);
      logAuthFlow('login_response', { success: true, hasUser: !!response?.user });
      
      console.log('✅ Login exitoso, redirigiendo a /dashboard');
      logAuthFlow('redirect_dashboard', { from: 'LoginForm.handleSubmit' });
      
      router.replace('/dashboard');
    } catch (err) {
      const errorType = parseAuthError(err);
      
      // Si es demasiados intentos, activar cooldown
      if (errorType.type === 'too_many_attempts') {
        setCooldownSeconds(60);
        const interval = setInterval(() => {
          setCooldownSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      
      console.error('❌ Login error:', err);
      logAuthFlow('login_error', { errorType: errorType.type, status: (err as any)?.response?.status });
      setError(errorType);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
          {/* Icono + Mensaje principal */}
          <div className="flex gap-3">
            <div className="text-2xl flex-shrink-0">
              {error.type === 'too_many_attempts' && '⏱️'}
              {error.type === 'user_not_found' && '🔍'}
              {error.type === 'invalid_password' && '🔐'}
              {error.type === 'account_inactive' && '🚫'}
              {error.type === 'network' && '📡'}
              {error.type === 'unknown' && '⚠️'}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-800">{error.message}</p>
              {error.suggestion && (
                <p className="text-red-700 text-sm mt-1">{error.suggestion}</p>
              )}
            </div>
          </div>

          {/* Acciones sugeridas */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-red-200">
            {(error.type === 'invalid_password' || error.type === 'too_many_attempts') && (
              <Link
                href="/auth/forgot-password"
                className="text-sm text-red-700 hover:text-red-900 underline font-medium"
              >
                Recuperar contraseña →
              </Link>
            )}
            {error.type === 'user_not_found' && (
              <Link
                href="/auth/register"
                className="text-sm text-red-700 hover:text-red-900 underline font-medium"
              >
                Registrarse aquí →
              </Link>
            )}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || cooldownSeconds > 0}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
      >
        {cooldownSeconds > 0 
          ? `Espera ${cooldownSeconds}s` 
          : isLoading 
          ? 'Cargando...' 
          : 'Iniciar Sesión'}
      </button>

      {/* Enlaces de ayuda */}
      <div className="flex justify-between items-center text-sm pt-2">
        <Link
          href="/auth/forgot-password"
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <Link
          href="/auth/register"
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          Crear cuenta
        </Link>
      </div>

      {/* Debug Info */}
      {showDebug && (
        <div className="mt-6 pt-6 border-t border-gray-300 text-xs bg-gray-50 p-3 rounded">
          <button
            type="button"
            onClick={() => setShowDebug(!showDebug)}
            className="text-blue-600 hover:underline mb-2"
          >
            {showDebug ? '▼' : '▶'} Debug Info
          </button>
          {showDebug && (
            <div className="space-y-1 text-gray-600 font-mono">
              <div><strong>API URL:</strong> {getApiConfig().fullAuthLoginUrl}</div>
              <div><strong>Base URL:</strong> {getApiConfig().baseUrl}</div>
              <div><strong>Version:</strong> {getApiConfig().version}</div>
              <div><strong>Token en localStorage:</strong> {getAuthDebugInfo().hasToken ? '✅ Sí' : '❌ No'}</div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
