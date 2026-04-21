import { useState, useCallback } from 'react';
import mentionsService from '@/services/mentionsService';
import { Mention } from '@/types';

export function useMentions() {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [receivedMentions, setReceivedMentions] = useState<Mention[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar menciones de un post
  const loadPostMentions = useCallback(async (postId: string, limit = 20, offset = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mentionsService.getMentions(postId, limit, offset);
      setMentions(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading mentions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar menciones recibidas
  const loadReceivedMentions = useCallback(async (limit = 20, offset = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mentionsService.getReceivedMentions(limit, offset);
      setReceivedMentions(data.data);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading received mentions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Marcar mención como leída
  const markAsRead = useCallback(async (mentionId: string) => {
    setError(null);
    try {
      await mentionsService.markMentionAsRead(mentionId);
      // Actualizar estado local
      setReceivedMentions(prev =>
        prev.map(m => m.id === mentionId ? { ...m, isRead: true } : m)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error marking mention as read');
    }
  }, []);

  return {
    mentions,
    receivedMentions,
    unreadCount,
    isLoading,
    error,
    loadPostMentions,
    loadReceivedMentions,
    markAsRead
  };
}
