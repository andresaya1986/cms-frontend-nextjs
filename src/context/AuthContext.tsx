'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '@/types';
import authService from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, username: string, password: string, firstName?: string, lastName?: string) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper para verificar si hay sesión válida
function hasValidSession(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user_data');
  return !!(token && user);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario al montar el componente
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Intentar cargar sesión del localStorage
        const savedUserData = localStorage.getItem('user_data');
        const token = localStorage.getItem('auth_token');
        
        if (token && savedUserData) {
          try {
            const user = JSON.parse(savedUserData);
            setUser(user);
            console.log('✅ Sesión recuperada desde localStorage:', user.email);
            
            // NO validar en background - causa rate limiting con 429
            // El token será validado automáticamente en el interceptor si es inválido
          } catch (parseError) {
            console.warn('❌ Error parseando user_data, limpiando sesión');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            localStorage.removeItem('refresh_token');
            setUser(null);
          }
        } else {
          if (token && !savedUserData) {
            console.warn('⚠️ Token existe pero user_data no, intentando cargar de API');
            try {
              const freshData = await authService.me();
              setUser(freshData);
              localStorage.setItem('user_data', JSON.stringify(freshData));
              console.log('✅ Usuario cargado desde API');
            } catch (err) {
              console.error('❌ Error cargando usuario de API, limpiando sesión');
              authService.logout();
              setUser(null);
            }
          } else {
            console.log('⚠️ No hay sesión guardada');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('❌ Error crítico en loadUser:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
    
    // Escuchar evento de sesión perdida (ej: error 401 del API)
    const handleSessionLost = () => {
      console.log('⚠️ Sesión perdida detectada - limpiando estado');
      setUser(null);
      setIsLoading(false);
    };
    
    window.addEventListener('session-lost', handleSessionLost);
    return () => window.removeEventListener('session-lost', handleSessionLost);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      console.log('AuthContext.login response:', response); // Debug
      
      // El backend retorna: { accessToken, refreshToken, user, ... }
      let userData: User | null = null;
      if (response && response.user) {
        console.log('Setting user from response.user:', response.user);
        userData = response.user;
        setUser(response.user);
      } else if (response && ('id' in response || 'email' in response)) {
        // Si response es directamente el user
        console.log('Setting user from response directly:', response);
        userData = response as unknown as User;
        setUser(userData);
      } else {
        throw new Error('Invalid login response structure');
      }
      
      // Guardar el user en localStorage para persista al recargar
      if (userData) {
        localStorage.setItem('user_data', JSON.stringify(userData));
        console.log('✅ User guardado en localStorage');
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        email,
        username,
        password,
        firstName,
        lastName,
      });
      // NO autenticar en registro. El usuario solo se autentica después de:
      // 1. Verificar el email (via OTP)
      // 2. Hacer login
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const refreshUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.me();
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
        console.log('✅ Usuario refrescado');
      } catch (error) {
        console.error('Error refreshing user:', error);
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user && authService.isAuthenticated(),
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
