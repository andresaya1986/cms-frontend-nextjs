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
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 mb-6 leading-tight">
                  Tu Intranet <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Profesional</span>
                </h1>
                <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed max-w-xl">
                  Conecta con tu equipo, comparte conocimiento y colabora en tiempo real. Una plataforma moderna diseñada para tu organización.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  Comenzar Gratis
                  <span className="ml-2">→</span>
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold text-lg hover:bg-blue-50 transition-all duration-300"
                >
                  Iniciar Sesión
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-neutral-200">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-blue-600">10K+</span>
                    <span className="text-neutral-600">Usuarios</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-blue-600">50K+</span>
                    <span className="text-neutral-600">Posts</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-blue-600">99.9%</span>
                    <span className="text-neutral-600">Uptime</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-full flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl blur-2xl opacity-30"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-7xl mb-4">🌐</div>
                      <p className="text-white font-semibold text-lg">Conectado</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-neutral-200 rounded w-24 mb-1"></div>
                        <div className="h-2 bg-neutral-100 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-neutral-100 rounded w-full"></div>
                      <div className="h-3 bg-neutral-100 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Todo lo que necesitas
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Herramientas poderosas para que tu equipo colabore y crezca juntos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500/10">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Comparte Contenido
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Crea, publica y comparte posts, artículos, noticias y recursos con tu comunidad en tiempo real.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500/10">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Colabora
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Comenta, reacciona y colabora con otros usuarios para fomentar el diálogo y el trabajo en equipo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500/10">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Conéctate
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Sigue perfiles, construye tu red profesional y mantén conexiones significativas dentro de tu organización.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500/10">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Busca Fácilmente
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Encuentra exactamente lo que buscas con nuestro potente motor de búsqueda integrado.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group relative p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500/10">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Rápido y Ágil
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Experiencia ultrarrápida optimizada para máxima productividad y rendimiento del equipo.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group relative p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500/10">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Seguro
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Tus datos están protegidos con encriptación de nivel empresarial y controles de privacidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para transformar tu organización?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de equipos que ya están colaborando de manera más eficiente
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Crear Cuenta Gratis
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">🌐</div>
                <span className="font-bold text-white">Intranet</span>
              </div>
              <p className="text-sm">La plataforma de colaboración empresarial moderna</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Características</a></li>
                <li><a href="#" className="hover:text-white transition">Precios</a></li>
                <li><a href="#" className="hover:text-white transition">Seguridad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition">Términos</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8">
            <p className="text-center text-sm">© 2026 Intranet. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
}
