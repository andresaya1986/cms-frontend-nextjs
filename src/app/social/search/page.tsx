'use client';

import React, { useState } from 'react';
import { SearchUsers } from '@/components/social/SearchUsers';
import { UserProfile } from '@/types';

export default function SearchPage() {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Discover Users</h1>
        <p className="text-gray-600 mb-6">
          Find and follow new users to see what they're posting about
        </p>

        <SearchUsers
          onSelectUser={setSelectedUser}
          className="mb-8"
        />
      </div>

      {selectedUser && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-4">
            {selectedUser.avatarUrl && (
              <img
                src={selectedUser.avatarUrl}
                alt={selectedUser.username}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">
                {selectedUser.displayName || selectedUser.username}
              </h2>
              <p className="text-gray-500">@{selectedUser.username}</p>
            </div>
          </div>

          {selectedUser.bio && (
            <p className="text-gray-700 mb-4">{selectedUser.bio}</p>
          )}

          <div className="flex gap-6 text-sm">
            <div>
              <p className="font-bold text-lg">{selectedUser.postCount || 0}</p>
              <p className="text-gray-600">Posts</p>
            </div>
            <div>
              <p className="font-bold text-lg">{selectedUser.followerCount}</p>
              <p className="text-gray-600">Followers</p>
            </div>
            <div>
              <p className="font-bold text-lg">{selectedUser.followingCount}</p>
              <p className="text-gray-600">Following</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
