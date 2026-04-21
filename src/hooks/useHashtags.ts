import { useState, useCallback } from 'react';
import hashtagsService from '@/services/hashtagsService';
import { Hashtag, Post, HashtagStats } from '@/types';

export function useHashtags() {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [trending, setTrending] = useState<Hashtag[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<HashtagStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar hashtags
  const searchHashtags = useCallback(async (query: string, limit = 20) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await hashtagsService.searchHashtags(query, limit);
      setHashtags(data.hashtags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching hashtags');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar trending hashtags
  const loadTrendingHashtags = useCallback(async (limit = 20) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await hashtagsService.getTrendingHashtags(limit);
      setTrending(data.trending);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading trending hashtags');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener posts con un hashtag
  const getPostsByHashtag = useCallback(async (tagName: string, limit = 10, offset = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await hashtagsService.getPostsByHashtag(tagName, limit, offset);
      setPosts(data.posts);
      setHashtags([data.hashtag]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading posts for hashtag');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener estadísticas de hashtag
  const getHashtagStats = useCallback(async (tagName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await hashtagsService.getHashtagStats(tagName);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading hashtag stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    hashtags,
    trending,
    posts,
    stats,
    isLoading,
    error,
    searchHashtags,
    loadTrendingHashtags,
    getPostsByHashtag,
    getHashtagStats
  };
}
