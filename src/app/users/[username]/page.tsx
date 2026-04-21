'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSocial } from '@/hooks/useSocial';
import { UserProfile, Post } from '@/types';
import { FollowButton } from '@/components/social/FollowButton';

export default function UserProfilePage() {
  const params = useParams();
  const username = (params.username as string) || '';

  const { getUserProfile, isLoading: profileLoading } = useSocial();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      if (username) {
        const data = await getUserProfile(username);
        setProfile(data);
      }
    };
    loadProfile();
  }, [username, getUserProfile]);

  if (profileLoading || !profile) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow mb-8">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-lg" />

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-6 mb-6">
            {profile.avatarUrl && (
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="w-24 h-24 rounded-full border-4 border-white -mt-12 bg-white"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {profile.displayName || profile.username}
              </h1>
              <p className="text-gray-500">@{profile.username}</p>
            </div>
            <FollowButton
              userId={profile.id}
              initialIsFollowing={profile.isFollowing}
            />
          </div>

          {profile.bio && (
            <p className="text-gray-700 mb-4">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-8 border-t pt-4">
            <div>
              <p className="font-bold text-lg">{profile.postCount || 0}</p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
            <div className="cursor-pointer hover:text-blue-600">
              <p className="font-bold text-lg">{profile.followerCount}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="cursor-pointer hover:text-blue-600">
              <p className="font-bold text-lg">{profile.followingCount}</p>
              <p className="text-sm text-gray-600">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No posts yet
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
