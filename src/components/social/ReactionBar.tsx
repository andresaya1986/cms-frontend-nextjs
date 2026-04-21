import React, { useEffect, useState } from 'react';
import { useReactions } from '@/hooks/useReactions';
import { ReactionType } from '@/types';

interface ReactionBarProps {
  targetId: string;
  targetType: 'POST' | 'COMMENT';
  onReactionChange?: (type: ReactionType | null) => void;
}

const REACTION_EMOJIS: Record<ReactionType, string> = {
  LIKE: '👍',
  LOVE: '❤️',
  CARE: '🤗',
  HAHA: '😂',
  WOW: '😮',
  SAD: '😢',
  ANGRY: '😠',
};

const REACTION_LABELS: Record<ReactionType, string> = {
  LIKE: 'Like',
  LOVE: 'Love',
  CARE: 'Care',
  HAHA: 'Haha',
  WOW: 'Wow',
  SAD: 'Sad',
  ANGRY: 'Angry',
};

export function ReactionBar({ targetId, targetType, onReactionChange }: ReactionBarProps) {
  const { stats, isLoading, loadStats, react } = useReactions(targetId, targetType);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);

  // Cargar estadísticas cuando se monta
  useEffect(() => {
    loadStats();
  }, [targetId, loadStats]);

  // Actualizar reacción del usuario
  useEffect(() => {
    if (stats?.userReaction) {
      setUserReaction(stats.userReaction);
    }
  }, [stats?.userReaction]);

  const handleReact = async (type: ReactionType) => {
    await react(type);
    setUserReaction(type);
    onReactionChange?.(type);
  };

  return (
    <div className="flex gap-1 flex-wrap items-center">
      {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => (
        <button
          key={type}
          onClick={() => handleReact(type as ReactionType)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
            userReaction === type
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
          title={REACTION_LABELS[type as ReactionType]}
          disabled={isLoading}
        >
          <span>{emoji}</span>
          {stats && stats[type as ReactionType] > 0 && (
            <span className="text-xs font-medium">{stats[type as ReactionType]}</span>
          )}
        </button>
      ))}

      {stats && stats.total === 0 && (
        <span className="text-xs text-gray-400">Be the first to react</span>
      )}
    </div>
  );
}
