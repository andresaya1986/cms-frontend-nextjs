'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si está autenticado, redirigir a /dashboard
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Mientras se redirige, mostrar algo
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenido a Intranet
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Una plataforma moderna para compartir contenido, conectar con otros usuarios y crear
            una comunidad activa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
            >
              Registrarse
            </Link>
            <Link
              href="/auth/login"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 font-semibold text-lg"
            >
              Iniciar Sesión
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-xl font-semibold mb-2">Comparte Contenido</h3>
              <p className="text-gray-600">
                Crea y publica posts, artículos y noticias para tu comunidad.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-xl font-semibold mb-2">Conecta</h3>
              <p className="text-gray-600">
                Sigue a otros usuarios, dale like a sus posts y interactúa.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-xl font-semibold mb-2">Comenta</h3>
              <p className="text-gray-600">
                Discute y comenta en posts para construir conversaciones significativas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
