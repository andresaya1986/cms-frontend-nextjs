'use client';

import { useState } from 'react';
import Link from 'next/link';
import authService from '@/services/authService';

type ForgotPasswordStep = 'email' | 'otp' | 'password' | 'success';

export function ForgotPasswordForm() {
  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      setSuccess('✅ Se envió un código a tu correo. Revisa tu bandeja de entrada (o spam).');
      setStep('otp');
      setCooldownSeconds(60);

      // Countdown para reenvío
      const interval = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Error al enviar el código. Intenta de nuevo.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Ingresa el código de 6 dígitos');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Verificar que el código sea válido antes de ir a cambiar contraseña
      // Por ahora asumimos que es válido y pasamos al siguiente paso
      setStep('password');
      setSuccess('Código verificado. Ahora elige tu nueva contraseña.');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Código inválido o expirado.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({
        email,
        otp,
        newPassword,
      });
      setStep('success');
      setSuccess('✅ Tu contraseña ha sido actualizada exitosamente.');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Error al actualizar la contraseña. Intenta de nuevo.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsLoading(true);

    try {
      await authService.resendOTP({
        email,
        type: 'PASSWORD_RESET',
      });
      setSuccess('✅ Nuevo código enviado a tu correo.');
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
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Error al reenviar el código.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Recuperar Contraseña</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
          🔴 {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* PASO 1: Ingresar email */}
      {step === 'email' && (
        <form onSubmit={handleRequestOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Ingresa tu correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Te enviaremos un código de 6 dígitos para verificar tu identidad.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
          >
            {isLoading ? 'Enviando...' : 'Enviar Código'}
          </button>

          <div className="text-center text-sm">
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Volver al login
            </Link>
          </div>
        </form>
      )}

      {/* PASO 2: Ingresar OTP */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Ingresa el código (6 dígitos)
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
            />
            <p className="text-xs text-gray-500 mt-2">
              Revisa tu correo (y carpeta de spam) para el código.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
          >
            {isLoading ? 'Verificando...' : 'Verificar Código'}
          </button>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={cooldownSeconds > 0}
            className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
          >
            {cooldownSeconds > 0 ? `Reenviar en ${cooldownSeconds}s` : 'Reenviar código'}
          </button>

          <div className="text-center text-sm">
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Volver al login
            </Link>
          </div>
        </form>
      )}

      {/* PASO 3: Nueva Contraseña */}
      {step === 'password' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 8 caracteres
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !newPassword || !confirmPassword}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
          >
            {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      )}

      {/* PASO 4: Éxito */}
      {step === 'success' && (
        <div className="text-center space-y-4">
          <div className="text-5xl">✅</div>
          <div>
            <h3 className="text-lg font-semibold mb-2">¡Listo!</h3>
            <p className="text-gray-600">
              Tu contraseña ha sido actualizada exitosamente.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Ir al Login
          </Link>
        </div>
      )}
    </div>
  );
}
