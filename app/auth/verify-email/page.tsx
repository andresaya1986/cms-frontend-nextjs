'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import authService from '@/services/authService';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de verificación no encontrado');
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('¡Email verificado correctamente!');
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Error al verificar email');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando tu email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2 text-green-600">¡Éxito!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/auth/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Ir a Iniciar Sesión
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2 text-red-600">Error</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/auth/register"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Volver a Registrarse
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center">
          <p>Cargando...</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
