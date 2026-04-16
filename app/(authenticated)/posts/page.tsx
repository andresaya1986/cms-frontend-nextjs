'use client';

import { useEffect, useState } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { PostList } from '@/components/posts/PostList';
import { CreatePostForm } from '@/components/posts/CreatePostForm';
import { SidebarProfile } from '@/components/ui/SidebarProfile';
import { TrendingCard } from '@/components/ui/TrendingCard';
import { useAuth } from '@/context/AuthContext';

export default function PostsPage() {
  const { posts, isLoading, error, fetchPosts, deletePost } = usePosts();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchPosts(page, 10);
  }, [page, fetchPosts]);

  const handleDeletePost = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
      await deletePost(id);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchPosts(1, 10);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="hidden md:block">
          <SidebarProfile user={user} />
        </div>

        {/* Center Feed */}
        <div className="md:col-span-2">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">📝 Posts</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-semibold transition shadow-cm"
            >
              + Crear Post
            </button>
          </div>

          {/* Errors */}
          {error && (
            <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded-lg mb-6">
              ⚠️ {error}
            </div>
          )}

          {/* Create Post Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 mb-8">
              <div className="bg-white rounded-xl shadow-cm-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 flex justify-between items-center p-6 border-b border-neutral-200 bg-neutral-50">
                  <h2 className="text-2xl font-bold">Crear Post</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-2xl text-neutral-400 hover:text-neutral-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6">
                  <CreatePostForm onSuccess={handleCreateSuccess} onCancel={() => setShowCreateModal(false)} />
                </div>
              </div>
            </div>
          )}

          {/* Posts List */}
          <PostList 
            posts={posts} 
            isLoading={isLoading} 
            onDeletePost={handleDeletePost}
          />

          {/* Pagination */}
          {posts.length > 0 && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-6 py-2 rounded-lg bg-neutral-200 text-neutral-700 disabled:opacity-50 font-medium hover:bg-neutral-300 transition"
              >
                ← Anterior
              </button>
              <span className="text-neutral-600 font-medium">Página {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                className="px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block">
          <TrendingCard />
        </div>
      </div>
    </div>
  );
}
