'use client';

import { useEffect, useState } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { PostList } from '@/components/posts/PostList';
import { CreatePostForm } from '@/components/posts/CreatePostForm';

export default function PostsPage() {
  const { posts, isLoading, error, fetchPosts, deletePost } = usePosts();
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
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">📝 Posts</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
        >
          + Crear Post
        </button>
      </div>

      {/* Errores */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* Modal de crear post */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 mb-8">
          <div className="bg-white rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-4xl">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Nuevo Post</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <CreatePostForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lista de posts */}
      <PostList posts={posts} isLoading={isLoading} onDeletePost={handleDeletePost} />

      {/* Paginación */}
      {posts.length > 0 && (
        <div className="flex justify-center gap-4 mt-12 pb-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition"
          >
            ← Anterior
          </button>
          <div className="py-2 px-6 bg-gray-100 text-gray-700 rounded-lg font-semibold">
            Página {page}
          </div>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
