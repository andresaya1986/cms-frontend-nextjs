'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Intranet
        </Link>

        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/posts" className="hover:text-blue-600">
                Posts
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm">Hola, {user?.username}!</span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-800"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
