'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import commentsService from '@/services/commentsService';
import { Comment } from '@/types';

interface CommentsListProps {
  postId: string;
  comments?: Comment[];
  onCommentAdded?: (comment: Comment) => void;
  refreshTrigger?: number;
}

export function CommentsList({ postId, comments: initialComments, onCommentAdded, refreshTrigger }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [loading, setLoading] = useState(!initialComments);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialComments) {
      setComments(initialComments);
      setLoading(false);
      return;
    }

    const loadComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await commentsService.getComments(postId);
        
        // Manejar estructura: { data: [...] } o directamente array
        const commentsList = Array.isArray(response) ? response : response.data || [];
        setComments(commentsList);
      } catch (err: any) {
        console.error('Error loading comments:', err?.message || err);
        // No mostrar error en UI, solo empty state
        setComments([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [postId, initialComments, refreshTrigger]);

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
    onCommentAdded?.(newComment);
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Hace poco';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;

    return d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="py-4 text-center text-neutral-500 dark:text-neutral-400 text-sm"
      >
        <div className="flex justify-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </motion.div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="py-4 text-center text-neutral-500 dark:text-neutral-400 text-sm">
        Sin comentarios aún. ¡Sé el primero en comentar!
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex gap-3 py-3 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0"
          >
            {/* Avatar */}
            {comment.author?.avatarUrl || comment.author?.avatar ? (
              <img
                src={comment.author.avatarUrl || comment.author.avatar}
                alt={comment.author?.username}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}

            {/* Comment Content */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  {comment.author?.displayName || comment.author?.username || 'Anónimo'}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  @{comment.author?.username}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formatDate(comment.createdAt)}
                </span>
              </div>

              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                {comment.content}
              </p>

              {/* Comment Actions */}
              <div className="mt-2 flex gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                {(comment.likeCount || (comment as any).likesCount) > 0 && (
                  <span>❤️ {comment.likeCount || (comment as any).likesCount}</span>
                )}
                <button className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Responder
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
