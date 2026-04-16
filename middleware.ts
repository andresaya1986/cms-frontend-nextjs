import { NextRequest, NextResponse } from 'next/server';

// NOTA: El middleware de Next.js se ejecuta en el servidor (Edge Runtime)
// y NO tiene acceso a localStorage del navegador.
// 
// La protección de rutas se comienza en el cliente usando el layout.tsx 
// en (authenticated)/ que usa useAuth() hook para proteger rutas.
//
// Este middleware es principalmente para logging y debugging.
// La lógica principal de protección está en app/(authenticated)/layout.tsx

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Log para debugging (visible en los logs del servidor)
  if (pathname.includes('dashboard') || pathname.includes('profile')) {
    console.log(`[Next.js Middleware] Accessed protected route: ${pathname}`);
  }

  // Por ahora, permitimos que todo pase al cliente
  // La protección real ocurre en el componente (authenticated)/layout.tsx que usa useAuth()
  return NextResponse.next();
}

// Configurar qué rutas monitorea el middleware
export const config = {
  matcher: [
    // Monitorear todas las rutas excepto assets estáticos
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
