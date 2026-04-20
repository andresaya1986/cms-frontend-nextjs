'use client';

import { SidebarProfile } from '@/components/ui/SidebarProfile';
import { CreatePostForm } from '@/components/posts/CreatePostForm';
import { PostList } from '@/components/posts/PostList';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef, useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { posts, isLoading, fetchPosts, loadMorePosts, hasMore } = usePosts();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Cargar posts iniciales
  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // Infinite scroll: detectar cuando se llega al final
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMorePosts, hasMore, isLoading]);

  // Renderizar el feed del dashboard: SidebarProfile + Feed central + TrendingCard
  return (
    <div className="pt-20 pb-8 bg-white dark:bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-3">
        {/* Grid responsivo: 1 col mobile, 3 col md/lg (sin tendencias) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          
          {/* LEFT SIDEBAR - Perfil Usuario (hidden en mobile) */}
          <div className="hidden md:block">
            <SidebarProfile user={user} />
          </div>

          {/* CENTER FEED */}
          <div className="md:col-span-2 lg:col-span-2">
            {/* Card crear post */}
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-cm p-4 mb-4 border border-neutral-200 dark:border-neutral-800">
              <div className="flex gap-3">
                {user?.avatarUrl || user?.avatar ? (
                  <img
                    src={user.avatarUrl || user.avatar}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-semibold border-2 border-slate-600 shadow-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Escribe algo..."
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 px-4 py-2 rounded-full bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 cursor-pointer transition-colors outline-none placeholder-stone-500 dark:placeholder-stone-400 text-neutral-900 dark:text-neutral-100"
                  readOnly
                />
              </div>
            </div>

            {/* Posts list */}
            <PostList posts={posts} isLoading={isLoading} />

            {/* Infinite scroll observer target */}
            <div ref={observerTarget} className="py-8 flex justify-center">
              {isLoading && hasMore && (
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              )}
              {!hasMore && posts.length > 0 && (
                <p className="text-neutral-500 dark:text-neutral-400">No hay más posts</p>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR - Tendencias REMOVIDA */}
        </div>
      </div>

      {/* Modal crear post */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-lg w-full max-w-[600px] max-h-[95vh] overflow-y-auto border border-neutral-200 dark:border-neutral-700">
            <div className="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Crear Post</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-2xl text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <CreatePostForm onSuccess={() => setShowCreateModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
