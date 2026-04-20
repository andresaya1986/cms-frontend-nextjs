'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '@/lib/api-client';

type ReactionType = 'LIKE' | 'LOVE' | 'CARE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';

interface ReactionBarProps {
  postId?: string;
  commentId?: string;
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  onComment?: () => void;
  refreshTrigger?: number;
}

const reactions: { type: ReactionType; emoji: string; label: string; color: string }[] = [
  { type: 'LIKE', emoji: '👍', label: 'Like', color: 'text-blue-600' },
  { type: 'LOVE', emoji: '❤️', label: 'Love', color: 'text-red-600' },
  { type: 'CARE', emoji: '🤗', label: 'Care', color: 'text-orange-600' },
  { type: 'HAHA', emoji: '😂', label: 'Haha', color: 'text-yellow-600' },
  { type: 'WOW', emoji: '😮', label: 'Wow', color: 'text-green-600' },
  { type: 'SAD', emoji: '😢', label: 'Sad', color: 'text-slate-600' },
  { type: 'ANGRY', emoji: '😠', label: 'Angry', color: 'text-red-700' },
];

export function ReactionBar({
  postId,
  commentId,
  likeCount = 0,
  commentCount = 0,
  viewCount = 0,
  onComment,
  refreshTrigger = 0,
}: ReactionBarProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [myReaction, setMyReaction] = useState<ReactionType | null>(null);
  const [totalReactions, setTotalReactions] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Ref para timeout de cierre de popover
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Cargar mi reacción actual y conteos al montar
  const loadReactionData = async () => {
    if (!postId && !commentId) return;

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      // Obtener mi reacción
      const myReactionParams = new URLSearchParams();
      if (postId) myReactionParams.append('postId', postId);
      if (commentId) myReactionParams.append('commentId', commentId);

      const myReactionRes = await api.get(
        `/v1/reactions/my-reaction?${myReactionParams.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyReaction(myReactionRes.data.data.type || null);

      // Obtener conteos
      const countsParams = new URLSearchParams();
      if (postId) countsParams.append('postId', postId);
      if (commentId) countsParams.append('commentId', commentId);

      const countsRes = await api.get(
        `/v1/reactions/count?${countsParams.toString()}`,
        { headers: {} }
      );
      setTotalReactions(countsRes.data.data.total || 0);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  useEffect(() => {
    loadReactionData();
  }, [postId, commentId, refreshTrigger]);

  const handleToggleReaction = async (reactionType: ReactionType) => {
    if (!postId && !commentId || loading) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await api.post(
        '/v1/reactions',
        {
          type: reactionType,
          ...(postId && { postId }),
          ...(commentId && { commentId })
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Actualizar mi reacción basado en la acción
      const action = response.data.action;
      if (action === 'created' || action === 'updated') {
        setMyReaction(reactionType);
      } else if (action === 'deleted') {
        setMyReaction(null);
      }

      // Recargar conteos
      await loadReactionData();
      setShowReactions(false);
    } catch (error) {
      console.error('Error toggling reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonEnter = () => {
    setShowReactions(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleButtonLeave = (e: React.MouseEvent) => {
    // Verificar si el mouse se va al popover
    const relatedElement = e.relatedTarget as HTMLElement;
    if (relatedElement?.classList?.contains('reaction-popover')) {
      return;
    }
    
    // Esperar un poco antes de cerrar para evitar flickering
    timeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 100);
  };

  const handlePopoverEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handlePopoverLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 150);
  };

  const handleClick = async () => {
    // Click simple en el botón = LIKE rápido
    if (!myReaction && !loading) {
      await handleToggleReaction('LIKE');
    }
  };

  const currentReactionData = myReaction
    ? reactions.find((r) => r.type === myReaction)
    : null;

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-700">
      {/* Stats Row - LinkedIn Style */}
      <div className="flex justify-between items-center px-4 py-2 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex gap-4">
          {viewCount > 0 && <span>👁️ {viewCount}</span>}
          {totalReactions > 0 && <span>❤️ {totalReactions}</span>}
          {commentCount > 0 && <span>💬 {commentCount}</span>}
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex relative border-t border-neutral-200 dark:border-neutral-700">
        {/* Like/React Button - Facebook style: Click for like, Hold for reactions */}
        <div 
          className="flex-1 relative"
          onMouseEnter={handleButtonEnter}
          onMouseLeave={handleButtonLeave}
        >
          <button
            onClick={handleClick}
            className={`w-full py-2 flex items-center justify-center gap-2 font-medium transition-colors select-none cursor-pointer
              ${
                myReaction
                  ? `${currentReactionData?.color} bg-neutral-50 dark:bg-neutral-800`
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={loading}
          >
            {myReaction ? currentReactionData?.emoji : '👍'}
            <span className="hidden sm:inline">
              {myReaction ? currentReactionData?.label : 'Like'}
            </span>
          </button>

          {/* Reactions Popover - Show on hover */}
          <div
            className={`reaction-popover absolute -top-14 left-0 bg-white dark:bg-neutral-800 rounded-full shadow-lg p-2 flex gap-2 z-50 border border-neutral-200 dark:border-neutral-700 transition-all ${
              showReactions ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onMouseEnter={handlePopoverEnter}
            onMouseLeave={handlePopoverLeave}
          >
            {reactions.map((reaction) => (
              <button
                key={reaction.type}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleToggleReaction(reaction.type);
                }}
                className={`text-2xl hover:scale-125 transition-transform select-none pointer-events-auto
                  ${
                    myReaction === reaction.type
                      ? 'scale-125 drop-shadow-lg'
                      : ''
                  }
                `}
                title={reaction.label}
              >
                {reaction.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Comment Button */}
        <button
          onClick={onComment}
          className="flex-1 py-2 flex items-center justify-center gap-2 font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          💬
          <span className="hidden sm:inline">Comentar</span>
        </button>
      </div>
    </div>
  );
}
