'use client';

import { SidebarProfile } from '@/components/ui/SidebarProfile';
import { TrendingCard } from '@/components/ui/TrendingCard';
import { CreatePostForm } from '@/components/posts/CreatePostForm';
import { PostList } from '@/components/posts/PostList';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { posts, isLoading } = usePosts();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Renderizar el feed del dashboard: SidebarProfile + Feed central + TrendingCard
  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-3">
        {/* Grid responsivo: 1 col mobile, 4 col md/lg */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
          
          {/* LEFT SIDEBAR - Perfil Usuario (hidden en mobile) */}
          <div className="hidden md:block">
            <SidebarProfile user={user} />
          </div>

          {/* CENTER FEED */}
          <div className="md:col-span-2 lg:col-span-2">
            {/* Card crear post */}
            <div className="bg-white rounded-lg shadow-cm p-4 mb-4">
              <div className="flex gap-3">
                {user?.avatarUrl || user?.avatar ? (
                  <img
                    src={user.avatarUrl || user.avatar}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-semibold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Escribe algo..."
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 cursor-pointer transition-colors outline-none placeholder-stone-500"
                  readOnly
                />
              </div>
            </div>

            {/* Posts list */}
            <PostList posts={posts} isLoading={isLoading} />
          </div>

          {/* RIGHT SIDEBAR - Tendencias (hidden en md, visible en lg) */}
          <div className="hidden lg:block">
            <TrendingCard />
          </div>
        </div>
      </div>

      {/* Modal crear post */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Crear Post</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-2xl text-stone-400 hover:text-stone-700"
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
