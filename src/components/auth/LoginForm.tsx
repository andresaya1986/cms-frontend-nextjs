'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getApiConfig, getAuthDebugInfo, logAuthFlow } from '@/lib/debug-helpers';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

    setError('');
    setIsLoading(true);

    logAuthFlow('login_start', { email, debugInfo: getAuthDebugInfo() });

    try {
      const response = await login(email, password);
      logAuthFlow('login_response', { success: true, hasUser: !!response?.user });
      
      console.log('✅ Login exitoso, redirigiendo a /dashboard');
      logAuthFlow('redirect_dashboard', { from: 'LoginForm.handleSubmit' });
      
      // Usar replace() en lugar de push() para mejor UX en auth
      // Esto previene que el user vuelva atrás al entrar al dashboard
      router.replace('/dashboard');
    } catch (err) {
      const errorObj = err as any;
      let errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      
      // Manejar específicamente el error 429
      if (errorObj?.response?.status === 429) {
        errorMessage = '⏱️ Demasiados intentos. Por favor espera 60 segundos antes de intentar de nuevo.';
        setCooldownSeconds(60);
        
        // Decrementar el cooldown cada segundo
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
      logAuthFlow('login_error', { error: errorMessage, status: errorObj?.response?.status });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
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
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cooldownSeconds > 0 
          ? `Espera ${cooldownSeconds}s` 
          : isLoading 
          ? 'Cargando...' 
          : 'Iniciar Sesión'}
      </button>

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
