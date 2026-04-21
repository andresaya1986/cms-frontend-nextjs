'use client';

import React, { useState, useRef, memo } from 'react';
import { Post } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ReactionBar } from './ReactionBar';
import { CommentForm } from '@/components/posts/CommentForm';
import { CommentsList } from '@/components/posts/CommentsList';
import { PostImages } from '@/components/posts/PostImages';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
  onReact?: (postId: string, reaction: string) => void;
}

function PostCardComponent({ post, onDelete, onReact }: PostCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCommentCreated = () => {
    setCommentRefreshKey((prev) => prev + 1);
  };

  // Verificar si el usuario puede editar/eliminar
  const canEdit = user && (user.id === post.author?.id || user.role === 'ADMIN');

  // Normalizar los nombres de los campos (API usa likesCount, nosotros usamos likeCount)
  const likeCount = post.likeCount ?? post.likesCount ?? 0;
  const commentCount = post.commentCount ?? post.commentsCount ?? 0;

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Hace poco';
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;

    return d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  const handleEdit = () => {
    router.push(`/posts/${post.slug}/edit`);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm('¿Eliminar este post?')) {
      onDelete?.(post.id);
      setShowMenu(false);
    }
  };

  return (
    <div
      className="bg-white dark:bg-neutral-900 rounded-xl shadow-cm hover:shadow-cm-lg transition-shadow mb-4 overflow-hidden border border-neutral-200 dark:border-neutral-800"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {post.author?.avatarUrl || post.author?.avatar ? (
            <img
              src={post.author.avatarUrl || post.author.avatar}
              alt={post.author?.username}
              className="w-12 h-12 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-lg border-2 border-slate-600 dark:border-slate-700 shadow-md">
              {post.author?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
                {post.author?.displayName || post.author?.username || 'Anónimo'}
              </h3>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">@{post.author?.username}</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Menu */}
        {isHovering && canEdit && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors p-1"
              title="Más opciones"
            >
              ⋯
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors first:rounded-t-lg flex items-center gap-2 text-neutral-800 dark:text-neutral-200"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 transition-colors last:rounded-b-lg flex items-center gap-2 text-red-600 dark:text-red-400"
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="px-6 pb-2">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            post.status === 'PUBLISHED'
              ? 'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300'
              : post.status === 'DRAFT'
              ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
              : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          {post.status === 'PUBLISHED' && '✓ Publicado'}
          {post.status === 'DRAFT' && '✎ Borrador'}
          {post.status === 'ARCHIVED' && '◊ Archivado'}
        </span>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-2 cursor-pointer">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2 mb-3">{post.excerpt}</p>}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-full">
                {'#'}{typeof tag === 'string' ? tag : (tag as any)?.name || 'tag'}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-full">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Post Images */}
      <PostImages postId={post.id} />

      {/* Single Unified Reaction Bar (like LinkedIn) */}
      <ReactionBar
        postId={post.id}
        likeCount={likeCount}
        commentCount={commentCount}
        viewCount={post.viewCount}
        onComment={() => setShowComments(!showComments)}
      />

      {/* Comments Section */}
      {showComments && (
        <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">💬 Comentarios</h3>
            <CommentForm postId={post.id} onCommentCreated={handleCommentCreated} />
            <div className="mt-4 bg-white dark:bg-neutral-700 rounded-lg p-4">
              <CommentsList postId={post.id} refreshTrigger={commentRefreshKey} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const PostCard = memo(PostCardComponent, (prev, next) => {
  // Re-render solo si el post ID cambió
  return prev.post.id === next.post.id;
});
