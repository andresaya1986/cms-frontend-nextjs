'use client';

import { Post } from '@/types';
import Link from 'next/link';

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
  onDeletePost?: (id: string) => void;
}

export function PostList({ posts, isLoading, onDeletePost }: PostListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg mb-4">📝 No hay posts aún</p>
        <p className="text-gray-400 text-sm">Crea el primero para comenzar a compartir contenido</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-500"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 cursor-pointer transition">
                  {post.title}
                </h2>
              </Link>
              {post.excerpt && <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${
                post.status === 'PUBLISHED'
                  ? 'bg-green-100 text-green-800'
                  : post.status === 'DRAFT'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {post.status === 'PUBLISHED' && '✓ Publicado'}
              {post.status === 'DRAFT' && '📝 Borrador'}
              {post.status === 'ARCHIVED' && '📦 Archivado'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-y">
            <div className="text-sm">
              <span className="text-gray-500">Por</span>
              <p className="font-semibold">@{post.author.username}</p>
            </div>
            <div className="text-sm text-right">
              <span className="text-gray-500">Publicado</span>
              <p className="font-semibold">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-6 text-gray-600">
              <span>👁️ {post.viewCount} vistas</span>
              <span>❤️ {post.likeCount} likes</span>
              <span>💬 {post.commentCount} comentarios</span>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/posts/${post.slug}`}
                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition"
              >
                Leer
              </Link>
              <button
                onClick={() => onDeletePost?.(post.id)}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
              >
                Eliminar
              </button>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
