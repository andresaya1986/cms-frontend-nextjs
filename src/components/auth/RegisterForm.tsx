'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Si hay cooldown, no permitir submit
    if (cooldownSeconds > 0) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await register(
        formData.email,
        formData.username,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      console.log('✅ Registro exitoso, redirigiendo a verify-otp');
      // Redirigir a verificación de OTP con el email como parámetro
      router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      const errorObj = err as any;
      let errorMessage = err instanceof Error ? err.message : 'Error al registrarse';
      
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
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Registrarse</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Usuario</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="tunombre"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Juan"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Apellido</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Pérez"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contraseña</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || cooldownSeconds > 0}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cooldownSeconds > 0 
          ? `Espera ${cooldownSeconds}s` 
          : isLoading 
          ? 'Registrando...' 
          : 'Registrarse'}
      </button>
    </form>
  );
}
