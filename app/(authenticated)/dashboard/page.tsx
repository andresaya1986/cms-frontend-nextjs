'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Helper para formatear fecha de forma segura
function formatCreatedAt(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    return date.toLocaleDateString('es-ES');
  } catch {
    return 'N/A';
  }
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Bienvenido, {user?.username}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">📝 Posts</h2>
          <p className="text-gray-600 mb-4">
            Lee, crea y gestiona todos tus posts y artículos.
          </p>
          <Link
            href="/posts"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ver Posts
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">👤 Perfil</h2>
          <p className="text-gray-600 mb-4">
            Actualiza tu información personal y foto de perfil.
          </p>
          <Link
            href="/profile"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Editar Perfil
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">👥 Social</h2>
          <p className="text-gray-600 mb-4">
            Sigue usuarios, da like a posts y ve tu feed.
          </p>
          <Link
            href="/posts"
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Feed Social
          </Link>
        </div>
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Información del Usuario</h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>Email:</strong> {user?.email}
          </li>
          <li>
            <strong>Usuario:</strong> {user?.username}
          </li>
          {user?.firstName && (
            <li>
              <strong>Nombre:</strong> {user.firstName} {user?.lastName || ''}
            </li>
          )}
          <li>
            <strong>Miembro desde:</strong> {formatCreatedAt(user?.createdAt)}
          </li>
        </ul>
      </div>
    </div>
  );
}
