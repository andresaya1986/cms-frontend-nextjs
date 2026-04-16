'use client';

import React, { useState } from 'react';

type ReactionType = 'like' | 'love' | 'celebrate' | 'support' | 'insightful' | 'funny';

interface ReactionBarProps {
  onReact?: (reaction: ReactionType) => void;
  currentReaction?: ReactionType | null;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  onComment?: () => void;
  onShare?: () => void;
}

const reactions: { type: ReactionType; emoji: string; label: string; color: string }[] = [
  { type: 'like', emoji: '👍', label: 'Like', color: 'text-primary-600' },
  { type: 'love', emoji: '❤️', label: 'Love', color: 'text-rose-600' },
  { type: 'celebrate', emoji: '🎉', label: 'Celebrate', color: 'text-lime-600' },
  { type: 'support', emoji: '👏', label: 'Support', color: 'text-purple-600' },
  { type: 'insightful', emoji: '💡', label: 'Insightful', color: 'text-amber-600' },
  { type: 'funny', emoji: '😂', label: 'Funny', color: 'text-cyan-600' },
];

export function ReactionBar({
  onReact,
  currentReaction,
  likeCount = 0,
  commentCount = 0,
  shareCount = 0,
  onComment,
  onShare,
}: ReactionBarProps) {
  const [showReactions, setShowReactions] = useState(false);
  const currentReactionData = reactions.find((r) => r.type === currentReaction);

  return (
    <div className="border-t border-neutral-200">
      {/* Stats Row */}
      <div className="flex justify-between px-4 py-2 text-xs text-neutral-600">
        <span>{likeCount > 0 ? `${likeCount} reacciones` : ''}</span>
        <div className="flex gap-4">
          <span>{commentCount > 0 ? `${commentCount} comentarios` : ''}</span>
          <span>{shareCount > 0 ? `${shareCount} compartidos` : ''}</span>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex relative">
        {/* Like/React Button */}
        <div className="flex-1 relative">
          <button
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
            onClick={() => {
              if (onReact && !currentReaction) {
                onReact('like');
              }
              setShowReactions(false);
            }}
            className={`w-full py-2 flex items-center justify-center gap-2 font-medium transition-colors
              ${
                currentReaction
                  ? `${currentReactionData?.color} bg-neutral-50`
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
          >
            {currentReaction ? currentReactionData?.emoji : '👍'}
            <span className="hidden sm:inline">{currentReaction ? currentReactionData?.label : 'Like'}</span>
          </button>

          {/* Reactions Popover */}
          {showReactions && (
            <div className="absolute -top-14 left-0 bg-white rounded-full shadow-cm p-2 flex gap-2 z-50">
              {reactions.map((reaction) => (
                <button
                  key={reaction.type}
                  onMouseLeave={() => setShowReactions(false)}
                  onClick={() => {
                    onReact?.(reaction.type);
                    setShowReactions(false);
                  }}
                  className="text-2xl hover:scale-125 transition-transform"
                  title={reaction.label}
                >
                  {reaction.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment Button */}
        <button
          onClick={onComment}
          className="flex-1 py-2 flex items-center justify-center gap-2 font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          💬
          <span className="hidden sm:inline">Comentar</span>
        </button>

        {/* Share Button */}
        <button
          onClick={onShare}
          className="flex-1 py-2 flex items-center justify-center gap-2 font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          ↗️
          <span className="hidden sm:inline">Compartir</span>
        </button>
      </div>
    </div>
  );
}
