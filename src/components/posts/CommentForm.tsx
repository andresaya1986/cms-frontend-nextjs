'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import commentsService from '@/services/commentsService';
import { Comment } from '@/types';

interface CommentFormProps {
  postId: string;
  onCommentCreated?: (comment: Comment) => void;
  loading?: boolean;
}

export function CommentForm({ postId, onCommentCreated, loading: parentLoading }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;

    setLoading(true);

    try {
      const comment = await commentsService.createComment(postId, {
        content: content.trim(),
      });

      const createdComment = (comment as any).data || comment;
      
      setContent('');
      onCommentCreated?.(createdComment);
    } catch (err: any) {
      console.error('Error creating comment:', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleBlur = () => {
    if (!content.trim()) {
      setContent('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="Añadir un comentario..."
        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-full bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
        disabled={loading}
      />
    </motion.div>
  );
}
