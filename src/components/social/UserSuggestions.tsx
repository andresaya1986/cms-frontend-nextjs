import React, { useEffect } from 'react';
import { useSocial } from '@/hooks/useSocial';
import { FollowButton } from './FollowButton';

interface UserSuggestionsProps {
  limit?: number;
  className?: string;
}

export function UserSuggestions({ limit = 10, className = '' }: UserSuggestionsProps) {
  const { getUserSuggestions, isLoading } = useSocial();
  const [suggestions, setSuggestions] = React.useState<any[]>([]);

  useEffect(() => {
    const loadSuggestions = async () => {
      const data = await getUserSuggestions(limit);
      setSuggestions(data || []);
    };
    loadSuggestions();
  }, [limit, getUserSuggestions]);

  if (isLoading) {
    return <div className={`p-4 text-center text-gray-500 ${className}`}>Loading suggestions...</div>;
  }

  if (suggestions.length === 0) {
    return <div className={`p-4 text-center text-gray-500 ${className}`}>No suggestions available</div>;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-bold text-lg mb-4">Suggested for you</h3>
      {suggestions.map((suggestion) => (
        <div key={suggestion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {suggestion.user.avatarUrl && (
              <img
                src={suggestion.user.avatarUrl}
                alt={suggestion.user.username}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="font-medium truncate">
                {suggestion.user.displayName || suggestion.user.username}
              </p>
              <p className="text-sm text-gray-500 truncate">@{suggestion.user.username}</p>
              {suggestion.mutualFollowers && (
                <p className="text-xs text-gray-400">
                  {suggestion.mutualFollowers} mutual followers
                </p>
              )}
            </div>
          </div>
          <FollowButton
            userId={suggestion.user.id}
            initialIsFollowing={suggestion.user.isFollowing}
            className="ml-2 flex-shrink-0"
          />
        </div>
      ))}
    </div>
  );
}
