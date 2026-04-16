'use client';

import React from 'react';
import { User } from '@/types';
import Link from 'next/link';

interface SidebarProfileProps {
  user: User | null;
}

export function SidebarProfile({ user }: SidebarProfileProps) {
  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-cm p-6 border border-neutral-200">
        <div className="text-center text-neutral-500">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-cm overflow-hidden border border-neutral-200">
        {/* Header Background */}
        <div className="h-20 bg-gradient-to-r from-primary-400 to-primary-600" />

        {/* Profile Content */}
        <div className="px-6 pb-4">
          {/* Avatar */}
          <div className="flex justify-center -mt-10 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-300 to-primary-600 border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-cm">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          {/* Info */}
          <h3 className="text-center font-bold text-lg text-neutral-900">{user.displayName || user.username}</h3>
          <p className="text-center text-sm text-neutral-600 mb-1">@{user.username}</p>
          <p className="text-center text-xs text-primary-600 font-medium mb-4">{user.role === 'ADMIN' ? '👑 Administrador' : '👤 Usuario'}</p>

          {/* Bio */}
          {user.bio && (
            <p className="text-center text-sm text-neutral-700 mb-4 line-clamp-2">{user.bio}</p>
          )}

          {/* Edit Profile Button */}
          <Link
            href="/profile"
            className="block w-full py-2 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors text-center"
          >
            Ver Perfil
          </Link>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl shadow-cm border border-neutral-200 divide-y divide-neutral-200">
        <div className="px-6 py-4">
          <div className="text-xs text-neutral-600 mb-1">Mi Actividad</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600">0</div>
              <div className="text-xs text-neutral-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-accent-600">0</div>
              <div className="text-xs text-neutral-600">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">0</div>
              <div className="text-xs text-neutral-600">Siguiendo</div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <button className="w-full py-2 px-3 rounded-lg bg-neutral-100 text-neutral-900 text-sm font-medium hover:bg-neutral-200 transition-colors">
            Ver Estadísticas
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-cm border border-neutral-200 divide-y divide-neutral-200">
        <Link
          href="/posts"
          className="block px-6 py-3 text-neutral-700 hover:bg-neutral-50 font-medium text-sm transition-colors"
        >
          📝 Mis Posts
        </Link>
        <Link href="/profile" className="block px-6 py-3 text-neutral-700 hover:bg-neutral-50 font-medium text-sm transition-colors">
          ⚙️ Configuración
        </Link>
        <button className="w-full text-left px-6 py-3 text-neutral-700 hover:bg-neutral-50 font-medium text-sm transition-colors">
          🔖 Guardados
        </button>
      </div>
    </div>
  );
}
