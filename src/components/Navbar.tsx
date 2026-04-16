'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-cm border-b border-neutral-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
              💼
            </div>
            <span className="hidden sm:inline font-bold text-lg text-neutral-900">Intranet</span>
          </Link>

          {/* Search Bar */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-1 max-w-xs mx-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Buscar posts, usuarios..."
                  className="w-full px-4 py-2 rounded-lg bg-neutral-100 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <span className="absolute right-3 top-2.5 text-neutral-400">🔍</span>
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {/* Nav Links */}
                <Link
                  href="/dashboard"
                  className="text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/posts"
                  className="text-neutral-700 hover:text-primary-600 font-medium text-sm transition-colors"
                >
                  Posts
                </Link>

                {/* Notifications */}
                <button className="relative p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                  🔔
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
                </button>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:inline text-sm font-medium text-neutral-900">
                      Hola, {user?.username}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-cm-lg border border-neutral-200 py-2 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 text-sm"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        👤 Mi Perfil
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 text-sm"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        ⚙️ Configuración
                      </Link>
                      <button className="block w-full text-left px-4 py-2 text-neutral-700 hover:bg-neutral-50 text-sm border-t border-neutral-200 mt-2 pt-2">
                        🌙 Tema Oscuro
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 text-sm font-medium"
                      >
                        🚪 Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-neutral-200 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/posts"
                  className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Posts
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
