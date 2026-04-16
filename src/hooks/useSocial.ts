import { useState, useCallback } from 'react';
import { UserProfile } from '@/types';
import socialService from '@/services/socialService';

export function useSocial() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const followUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await socialService.followUser(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error following user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unfollowUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await socialService.unfollowUser(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error unfollowing user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const likePost = useCallback(async (postId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await socialService.likePost(postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error liking post');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unlikePost = useCallback(async (postId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await socialService.unlikePost(postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error unliking post');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFeed = useCallback(async (page = 1, pageSize = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      return await socialService.getFeed(page, pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching feed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserProfile = useCallback(async (username: string): Promise<UserProfile | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await socialService.getUserProfile(username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    followUser,
    unfollowUser,
    likePost,
    unlikePost,
    getFeed,
    getUserProfile,
  };
}
