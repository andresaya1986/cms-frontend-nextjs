'use client';

import React from 'react';
import { TrendingHashtags } from '@/components/social/TrendingHashtags';
import { useHashtags } from '@/hooks/useHashtags';
import { useRouter } from 'next/navigation';

export default function TrendingPage() {
  const router = useRouter();
  const { posts, isLoading, getPostsByHashtag } = useHashtags();

  const handleSelectHashtag = async (tagName: string) => {
    await getPostsByHashtag(tagName);
    // Podría navegar a una página específica del hashtag
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Trending</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Trending en el sidebar */}
        <div className="md:col-span-1">
          <TrendingHashtags
            limit={15}
            onSelectHashtag={handleSelectHashtag}
            className="bg-white rounded-lg shadow p-6 sticky top-20"
          />
        </div>

        {/* Posts con trending hashtags */}
        <div className="md:col-span-2">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Select a trending hashtag to see related posts
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/posts/${post.slug}`)}
                >
                  <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {post.author.displayName || post.author.username}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
