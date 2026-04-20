'use client';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import searchService from '@/services/searchService';

interface SearchResult {
  id: string;
  index: string;
  score: number;
  title?: string;
  displayName?: string;
  excerpt?: string;
  username?: string;
  bio?: string;
  content?: string;
  avatar?: string;
  avatarUrl?: string;
  slug?: string;
  createdAt?: string;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'users'>('all');

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usar el endpoint unificado /api/v1/search con type parameter
        const response = await searchService.search(query, activeTab, 50, 1);
        
        // Extraer resultados y asignar índice si es necesario
        const allResults = (response as any).results || [];
        setResults(allResults as SearchResult[]);
      } catch (err) {
        console.error('Search error:', err);
        setError('Error en la búsqueda. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, activeTab]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
            ← Volver
          </Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🔍</span>
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                Resultados de búsqueda
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                {query && (
                  <>
                    Búsqueda: <span className="font-semibold text-blue-600">{query}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-8 border-b border-neutral-200 dark:border-neutral-800">
          {['all', 'posts', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {tab === 'all' && `📋 Todo (${results.length})`}
              {tab === 'posts' && `📝 Posts (${results.length})`}
              {tab === 'users' && `👥 Usuarios (${results.length})`}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Buscando...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && results.length === 0 && query && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              No se encontraron resultados
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Intenta con otros términos o palabras clave
            </p>
          </div>
        )}

        {!loading && !query && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔭</div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Comienza a buscar
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Usa la barra de búsqueda para encontrar posts y usuarios
            </p>
          </div>
        )}

        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={`${result.index}-${result.id}`}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              {result.index === 'cms_posts' ? (
                <Link href={`/posts/${result.slug}`}>
                  <div className="p-6 cursor-pointer group">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {result.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">
                      {result.excerpt || result.content?.substring(0, 150)}
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-neutral-500">
                      <span>📝 Post</span>
                      <span>⭐ Score: {result.score?.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href={`/profile/${result.username}`}>
                  <div className="p-6 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      {result.avatarUrl || result.avatar ? (
                        <img
                          src={result.avatarUrl || result.avatar}
                          alt={result.displayName || result.username}
                          className="w-16 h-16 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold border-2 border-slate-600">
                          {result.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {result.displayName || result.username}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">@{result.username}</p>
                        {result.bio && (
                          <p className="text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-1 text-sm">
                            {result.bio}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
                          <span>👤 Usuario</span>
                          <span>⭐ Score: {result.score?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
