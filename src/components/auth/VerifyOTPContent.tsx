'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import authService from '@/services/authService';
import Link from 'next/link';

function VerifyOTPForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!email) {
      setStatus('error');
      setMessage('Email no proporcionado. Por favor, regístrate de nuevo.');
    }
  }, [email]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    if (!email) {
      setStatus('error');
      setMessage('Email no disponible');
      return;
    }

    if (!otp || otp.length < 4) {
      setStatus('error');
      setMessage('Por favor ingresa un código válido');
      return;
    }

    try {
      // Verificar el OTP
      const response = await authService.verifyEmail({
        email,
        otp: otp.trim(),
        type: 'EMAIL_VERIFICATION',
      });

      setStatus('success');
      setMessage('✅ Código verificado correctamente. Tu cuenta ha sido activada.');
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Error al verificar el código';
      setMessage(`❌ ${errorMessage}`);
      console.error('Verify OTP error:', err);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setMessage('');

    if (!email) {
      setMessage('Email no disponible');
      setIsResending(false);
      return;
    }

    try {
      await authService.resendOTP({ 
        email,
        type: 'EMAIL_VERIFICATION',
      });
      setMessage('✅ Código reenviado. Revisa tu email.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al reenviar el código';
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-semibold">Error: Email no encontrado</p>
          <p className="text-sm mt-2">Por favor, regístrate de nuevo.</p>
        </div>
        <Link
          href="/auth/register"
          className="block text-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Volver a Registrarse
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-2">Verificar Tu Cuenta</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Hemos enviado un código de verificación a<br />
        <strong>{email}</strong>
      </p>

      {message && (
        <div
          className={`px-4 py-3 rounded mb-6 ${
            status === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : status === 'error'
              ? 'bg-red-100 border border-red-400 text-red-700'
              : 'bg-blue-100 border border-blue-400 text-blue-700'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Código OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="000000"
            maxLength={6}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono"
            disabled={status === 'loading' || status === 'success'}
            autoComplete="off"
          />
          <p className="text-xs text-gray-500 mt-2">
            Ingresa el código de 6 dígitos que recibiste por email
          </p>
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || status === 'success' || !otp}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {status === 'loading' ? 'Verificando...' : 'Verificar Código'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600 mb-4">¿No recibiste el código?</p>
        <button
          onClick={handleResendOTP}
          disabled={isResending}
          className="w-full text-blue-600 hover:underline font-semibold disabled:opacity-50"
        >
          {isResending ? 'Reenviando...' : 'Reenviar Código'}
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export function VerifyOTPContent() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <VerifyOTPForm />
    </Suspense>
  );
}
