import React, { useState, useEffect, useCallback } from 'react';
import { useSocial } from '@/hooks/useSocial';
import { UserProfile } from '@/types';
import { FollowButton } from './FollowButton';

interface SearchUsersProps {
  onSelectUser?: (user: UserProfile) => void;
  className?: string;
}

export function SearchUsers({ onSelectUser, className = '' }: SearchUsersProps) {
  const { searchUsers, isLoading } = useSocial();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      if (searchTimeout) clearTimeout(searchTimeout);

      const timeout = setTimeout(async () => {
        const data = await searchUsers(searchQuery, 10);
        setResults(data?.data || []);
      }, 300);

      setSearchTimeout(timeout);
    },
    [searchUsers, searchTimeout]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleSelectUser = (user: UserProfile) => {
    onSelectUser?.(user);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowResults(true)}
        placeholder="Search users..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showResults && (results.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <div
                key={user.id}
                className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectUser(user)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {user.avatarUrl && (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{user.displayName || user.username}</p>
                      <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                    </div>
                  </div>
                  <FollowButton userId={user.id} initialIsFollowing={user.isFollowing} className="ml-2" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}
