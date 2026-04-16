'use client';

import React, { useState } from 'react';
import { Post } from '@/types';
import { ReactionBar } from './ReactionBar';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
  onReact?: (postId: string, reaction: string) => void;
}

export function PostCard({ post, onDelete, onReact }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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

  return (
    <div
      className="bg-white rounded-xl shadow-cm hover:shadow-cm-lg transition-shadow mb-4 overflow-hidden border border-neutral-200"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
            {post.author?.username?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <h3 className="font-bold text-neutral-900">
                {post.author?.displayName || post.author?.username || 'Anónimo'}
              </h3>
              <span className="text-sm text-neutral-600">@{post.author?.username}</span>
            </div>
            <p className="text-xs text-neutral-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Menu */}
        {isHovering && (
          <button
            onClick={() => {
              if (confirm('¿Eliminar este post?')) {
                onDelete?.(post.id);
              }
            }}
            className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
            title="Más opciones"
          >
            ⋯
          </button>
        )}
      </div>

      {/* Status Badge */}
      <div className="px-6 pb-2">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            post.status === 'PUBLISHED'
              ? 'bg-accent-100 text-accent-700'
              : post.status === 'DRAFT'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-neutral-100 text-neutral-700'
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
          <h2 className="text-xl font-bold text-neutral-900 hover:text-primary-600 transition-colors mb-2 cursor-pointer">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && <p className="text-neutral-600 text-sm line-clamp-2 mb-3">{post.excerpt}</p>}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full">
                {'#'}{typeof tag === 'string' ? tag : (tag as any)?.name || 'tag'}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-6 py-3 bg-neutral-50 flex justify-between text-sm text-neutral-600 border-t border-neutral-100">
        <span>👁️ {post.viewCount} vistas</span>
        <span>❤️ {post.likeCount} reacciones</span>
        <span>💬 {post.commentCount} comentarios</span>
      </div>

      {/* Reaction Bar */}
      <ReactionBar
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        onReact={(reaction) => onReact?.(post.id, reaction)}
        onComment={() => setShowComments(!showComments)}
      />

      {/* Comments Section */}
      {showComments && (
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
          <p className="text-neutral-600 text-sm">💬 {post.commentCount} comentarios</p>
          {/* TODO: Implementar lista de comentarios */}
        </div>
      )}
    </div>
  );
}
