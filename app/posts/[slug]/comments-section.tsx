'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CommentForm } from '@/components/posts/CommentForm';
import { CommentsList } from '@/components/posts/CommentsList';

interface CommentsSectionProps {
  postId: string;
  onCommentAdded?: () => void;
}

export function CommentsSection({ postId, onCommentAdded }: CommentsSectionProps) {
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);

  const handleCommentCreated = () => {
    setCommentRefreshKey((prev) => prev + 1);
    onCommentAdded?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-6 sm:px-8 py-8 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6"
      >
        💬 Comentarios
      </motion.h2>

      {/* Comment Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mb-6"
      >
        <CommentForm postId={postId} onCommentCreated={handleCommentCreated} />
      </motion.div>

      {/* Comments List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-6 space-y-4"
      >
        <CommentsList postId={postId} refreshTrigger={commentRefreshKey} />
      </motion.div>
    </motion.div>
  );
}
