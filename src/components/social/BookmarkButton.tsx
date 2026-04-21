import React, { useState } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';

interface BookmarkButtonProps {
  postId: string;
  initialIsBookmarked?: boolean;
  onBookmarkChange?: (isBookmarked: boolean) => void;
  className?: string;
}

export function BookmarkButton({
  postId,
  initialIsBookmarked = false,
  onBookmarkChange,
  className = '',
}: BookmarkButtonProps) {
  const { toggleBookmark, isLoading } = useBookmarks();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const handleClick = async () => {
    try {
      await toggleBookmark(postId);
      const newState = !isBookmarked;
      setIsBookmarked(newState);
      onBookmarkChange?.(newState);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-2 rounded-lg transition-colors inline-flex items-center gap-2 ${
        isBookmarked
          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={isBookmarked ? 'Unsave' : 'Save'}
    >
      {isBookmarked ? '🔖' : '󰐕'}
    </button>
  );
}
