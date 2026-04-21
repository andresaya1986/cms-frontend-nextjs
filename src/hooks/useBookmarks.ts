import { useState, useCallback } from 'react';
import bookmarksService from '@/services/bookmarksService';
import { Bookmark } from '@/types';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Cargar bookmarks
  const loadBookmarks = useCallback(async (limit = 20, offset = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookmarksService.getBookmarks(limit, offset);
      setBookmarks(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading bookmarks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle bookmark
  const toggleBookmark = useCallback(async (postId: string) => {
    setError(null);
    try {
      await bookmarksService.toggleBookmark(postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error toggling bookmark');
    }
  }, []);

  // Eliminar bookmark
  const deleteBookmark = useCallback(async (postId: string) => {
    setError(null);
    try {
      await bookmarksService.deleteBookmark(postId);
      // Remover de la lista local
      setBookmarks(prev => prev.filter(b => b.postId !== postId));
      setTotal(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting bookmark');
    }
  }, []);

  return {
    bookmarks,
    isLoading,
    error,
    total,
    loadBookmarks,
    toggleBookmark,
    deleteBookmark
  };
}
