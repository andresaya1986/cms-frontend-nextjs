'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/types';
import { PostImages } from '@/components/posts/PostImages';
import { PostReactionsClient } from './post-reactions-client';
import { CommentsSection } from './comments-section';

interface PostDetailClientProps {
  post: Post;
}

export function PostDetailClient({ post }: PostDetailClientProps) {
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  // Verificar si el usuario puede editar el post
  const canEdit = user && (user.id === post.author?.id || user.role === 'ADMIN');

  const handleCommentCreated = () => {
    setCommentRefreshKey((prev) => prev + 1);
  };

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pt-20 pb-8 bg-white dark:bg-neutral-950 min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Botón volver */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium"
          >
            ← Volver al feed
          </Link>
        </motion.div>

        {/* Post container */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-neutral-900 rounded-xl shadow-cm border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 sm:px-8 py-6 border-b border-neutral-200 dark:border-neutral-800">
            {/* Botones de acción (Solo para dueño y admin) */}
            {canEdit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-3 mb-4 justify-end"
              >
                <Link
                  href={`/posts/${post.slug}/edit`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors font-medium text-sm"
                >
                  ✏️ Editar
                </Link>
              </motion.div>
            )}

            {/* Autor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center gap-4 mb-4"
            >
              {post.author?.avatarUrl ? (
                <img
                  src={post.author.avatarUrl}
                  alt={post.author?.username}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-lg border-2 border-slate-600 dark:border-slate-700 shadow-md">
                  {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {post.author?.displayName || post.author?.username}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatDate(post.createdAt)}</p>
              </div>
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 leading-tight"
            >
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            {post.excerpt && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-lg text-neutral-600 dark:text-neutral-400 mb-4"
              >
                {post.excerpt}
              </motion.p>
            )}

            {/* Meta info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="flex flex-wrap gap-4 text-sm text-neutral-500 dark:text-neutral-400"
            >
              <span>{post.type}</span>
              <span>•</span>
              <span>👁️ {post.viewCount} vistas</span>
              <span>•</span>
              <span>❤️ {post.likeCount ?? post.likesCount ?? 0} reacciones</span>
            </motion.div>
          </div>

          {/* Images */}
          <PostImages featuredImage={post.featuredImage} media={post.media} />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="px-6 sm:px-8 py-8 prose dark:prose-invert max-w-none"
          >
            <div className="text-neutral-900 dark:text-neutral-100 leading-relaxed whitespace-pre-wrap break-words">
              {post.content}
            </div>
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="px-6 sm:px-8 py-6 border-t border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: any, idx: number) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.4 + idx * 0.05 }}
                    className="inline-block px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                  >
                    #{typeof tag === 'string' ? tag : tag?.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reactions Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <PostReactionsClient
              postId={post.id}
              likeCount={post.likeCount ?? post.likesCount ?? 0}
              commentCount={post.commentCount ?? post.commentsCount ?? 0}
              refreshTrigger={commentRefreshKey}
            />
          </motion.div>

          {/* Comments Section */}
          <CommentsSection postId={post.id} onCommentAdded={handleCommentCreated} />
        </motion.article>
      </div>
    </motion.div>
  );
}
