import React, { useEffect } from 'react';
import { useHashtags } from '@/hooks/useHashtags';

interface TrendingHashtagsProps {
  limit?: number;
  onSelectHashtag?: (tagName: string) => void;
  className?: string;
}

export function TrendingHashtags({ limit = 10, onSelectHashtag, className = '' }: TrendingHashtagsProps) {
  const { trending, isLoading, loadTrendingHashtags } = useHashtags();

  useEffect(() => {
    loadTrendingHashtags(limit);
  }, [limit, loadTrendingHashtags]);

  if (isLoading) {
    return <div className={`p-4 text-center text-gray-500 ${className}`}>Loading trends...</div>;
  }

  if (trending.length === 0) {
    return <div className={`p-4 text-center text-gray-500 ${className}`}>No trending hashtags</div>;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="font-bold text-lg mb-4">Trending Now</h3>
      {trending.map((hashtag) => (
        <div
          key={hashtag.id}
          onClick={() => onSelectHashtag?.(hashtag.name)}
          className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">#{hashtag.name}</p>
              <p className="text-sm text-gray-500">{hashtag.count} posts</p>
            </div>
            {hashtag.trendingScore && (
              <div className="text-right">
                <p className="text-xs font-bold text-blue-600">
                  {hashtag.trendingScore.toFixed(1)}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
