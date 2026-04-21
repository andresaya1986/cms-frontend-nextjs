'use client';

import React, { useEffect, useState } from 'react';
import { useSocial } from '@/hooks/useSocial';
import { FollowerInfo } from '@/types';
import { FollowButton } from '@/components/social/FollowButton';

export default function FollowingPage() {
  const { getFollowing, isLoading } = useSocial();
  const [following, setFollowing] = useState<FollowerInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadFollowing = async () => {
      // Obtener el username del usuario actual
      const username = 'current_user';
      const data = await getFollowing(username, 20, (page - 1) * 20);
      if (data) {
        setFollowing(data.data);
        setTotal(data.total);
      }
    };
    loadFollowing();
  }, [page, getFollowing]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Following</h1>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading following list...</div>
      ) : following.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Not following anyone yet</div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {following.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {user.displayName || user.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                    {user.bio && (
                      <p className="text-sm text-gray-600 truncate mt-1">{user.bio}</p>
                    )}
                  </div>
                </div>
                <button
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-shrink-0"
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>

          {total > following.length && (
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
                disabled={following.length < 20}
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
