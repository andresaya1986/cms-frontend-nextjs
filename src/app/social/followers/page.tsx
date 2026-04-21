'use client';

import React, { useEffect, useState } from 'react';
import { useSocial } from '@/hooks/useSocial';
import { FollowerInfo } from '@/types';
import { FollowButton } from '@/components/social/FollowButton';

export default function FollowersPage() {
  const { getFollowers, isLoading } = useSocial();
  const [followers, setFollowers] = useState<FollowerInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadFollowers = async () => {
      // Obtener el username del usuario actual (esta parte la implementaremos después)
      // Por ahora es un placeholder
      const username = 'current_user';
      const data = await getFollowers(username, 20, (page - 1) * 20);
      if (data) {
        setFollowers(data.data);
        setTotal(data.total);
      }
    };
    loadFollowers();
  }, [page, getFollowers]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Followers</h1>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading followers...</div>
      ) : followers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No followers yet</div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {followers.map((follower) => (
              <div
                key={follower.id}
                className="flex items-center justify-between bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {follower.avatarUrl && (
                    <img
                      src={follower.avatarUrl}
                      alt={follower.username}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {follower.displayName || follower.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate">@{follower.username}</p>
                    {follower.bio && (
                      <p className="text-sm text-gray-600 truncate mt-1">{follower.bio}</p>
                    )}
                  </div>
                </div>
                {follower.isFollowing !== undefined && (
                  <FollowButton
                    userId={follower.id}
                    initialIsFollowing={follower.isFollowing}
                    className="ml-4 flex-shrink-0"
                  />
                )}
              </div>
            ))}
          </div>

          {total > followers.length && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={followers.length < 20}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
