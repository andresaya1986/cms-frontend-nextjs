import { useState, useCallback } from 'react';
import sharesService from '@/services/sharesService';
import { Share } from '@/types';

export function useShare() {
  const [shares, setShares] = useState<Share[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Compartir un post
  const sharePost = useCallback(async (postId: string, message?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await sharesService.sharePost(postId, { postId, message });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sharing post');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener shares de un post
  const getPostShares = useCallback(async (postId: string, limit = 10, offset = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await sharesService.getPostShares(postId, limit, offset);
      setShares(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading shares');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    shares,
    isLoading,
    error,
    total,
    sharePost,
    getPostShares
  };
}
