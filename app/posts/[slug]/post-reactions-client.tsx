'use client';

import { ReactionBar } from '@/components/ui/ReactionBar';
import { useState } from 'react';

interface PostReactionsClientProps {
  postId: string;
  likeCount: number;
  commentCount: number;
  onCommentClick?: () => void;
  refreshTrigger?: number;
}

export function PostReactionsClient({
  postId,
  likeCount,
  commentCount,
  onCommentClick,
  refreshTrigger = 0,
}: PostReactionsClientProps) {
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  const [likes, setLikes] = useState(likeCount ?? 0);
  const [comments, setComments] = useState(commentCount ?? 0);

  const handleReact = async (reaction: string) => {
    setCurrentReaction(reaction);
    setLikes(likes + 1);
    // Aquí puedes agregar la lógica para guardar la reacción en el servidor
    console.log('Reacted with:', reaction);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Compartir post',
          text: 'Mira este post interesante',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copiar enlace al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <ReactionBar
      postId={postId}
      likeCount={likes}
      commentCount={comments}
      onComment={onCommentClick}
      refreshTrigger={refreshTrigger}
    />
  );
}
