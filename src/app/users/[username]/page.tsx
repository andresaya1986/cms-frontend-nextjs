'use client';

import React, { useEffect, useState, useParams } from 'react';
import { useSocial } from '@/hooks/useSocial';
import { usePosts } from '@/hooks/usePosts';
import { UserProfile, Post } from '@/types';
import { FollowButton } from '@/components/social/FollowButton';
import { usePathname } from 'next/navigation';

export default function UserProfilePage() {
  const pathname = usePathname();
  const username = pathname?.split('/').pop() || '';
  
  const { getUserProfile, isLoading: profileLoading } = useSocial();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getUserProfile(username);
      setProfile(data);
    };
    if (username) loadProfile();
  }, [username, getUserProfile]);

  if (profileLoading || !profile) {
    return (
      <div className=\"max-w-4xl mx-auto py-8 px-4 text-center\">\n        <div className=\"text-gray-500\">Loading profile...</div>\n      </div>\n    );\n  }\n\n  return (\n    <div className=\"max-w-4xl mx-auto py-8 px-4\">\n      {/* Profile Header */}\n      <div className=\"bg-white rounded-lg shadow mb-8\">\n        {/* Banner */}\n        <div className=\"h-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-lg\" />\n\n        {/* Profile Info */}\n        <div className=\"px-6 pb-6\">\n          <div className=\"flex items-end gap-6 mb-6\">\n            {profile.avatarUrl && (\n              <img\n                src={profile.avatarUrl}\n                alt={profile.username}\n                className=\"w-24 h-24 rounded-full border-4 border-white -mt-12 bg-white\"\n              />\n            )}\n            <div className=\"flex-1\">\n              <h1 className=\"text-3xl font-bold\">\n                {profile.displayName || profile.username}\n              </h1>\n              <p className=\"text-gray-500\">@{profile.username}</p>\n            </div>\n            <FollowButton\n              userId={profile.id}\n              initialIsFollowing={profile.isFollowing}\n            />\n          </div>\n\n          {profile.bio && (\n            <p className=\"text-gray-700 mb-4\">{profile.bio}</p>\n          )}\n\n          {/* Stats */}\n          <div className=\"flex gap-8 border-t pt-4\">\n            <div>\n              <p className=\"font-bold text-lg\">{profile.postCount || 0}</p>\n              <p className=\"text-sm text-gray-600\">Posts</p>\n            </div>\n            <div className=\"cursor-pointer hover:text-blue-600\">\n              <p className=\"font-bold text-lg\">{profile.followerCount}</p>\n              <p className=\"text-sm text-gray-600\">Followers</p>\n            </div>\n            <div className=\"cursor-pointer hover:text-blue-600\">\n              <p className=\"font-bold text-lg\">{profile.followingCount}</p>\n              <p className=\"text-sm text-gray-600\">Following</p>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      {/* User Posts */}\n      <div>\n        <h2 className=\"text-2xl font-bold mb-6\">Posts</h2>\n        {posts.length === 0 ? (\n          <div className=\"text-center py-8 text-gray-500\">\n            No posts yet\n          </div>\n        ) : (\n          <div className=\"space-y-4\">\n            {posts.map((post) => (\n              <div\n                key={post.id}\n                className=\"bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow\"\n              >\n                <h3 className=\"text-lg font-bold mb-2\">{post.title}</h3>\n                <p className=\"text-gray-600 line-clamp-2 mb-4\">{post.excerpt}</p>\n                <p className=\"text-sm text-gray-500\">\n                  {new Date(post.createdAt).toLocaleDateString()}\n                </p>\n              </div>\n            ))}\n          </div>\n        )}\n      </div>\n    </div>\n  );\n}\n