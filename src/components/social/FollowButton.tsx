import React, { useCallback } from 'react';
import { useSocial } from '@/hooks/useSocial';
import { FollowResponse } from '@/types';

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
}

export function FollowButton({
  userId,
  initialIsFollowing = false,
  onFollowChange,
  className = '',
}: FollowButtonProps) {
  const { followUser, unfollowUser, isLoading } = useSocial();
  const [isFollowing, setIsFollowing] = React.useState(initialIsFollowing);

  const handleClick = useCallback(async () => {
    try {
      let result: FollowResponse | undefined;
      if (isFollowing) {
        result = await unfollowUser(userId);
      } else {
        result = await followUser(userId);
      }

      if (result) {
        setIsFollowing(result.isFollowing);
        onFollowChange?.(result.isFollowing);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  }, [isFollowing, userId, followUser, unfollowUser, onFollowChange]);

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isFollowing
          ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
