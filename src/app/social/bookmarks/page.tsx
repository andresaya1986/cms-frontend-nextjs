'use client';

import React, { useEffect, useState } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Bookmark } from '@/types';
import { BookmarkButton } from '@/components/social/BookmarkButton';

export default function BookmarksPage() {
  const { bookmarks, isLoading, loadBookmarks, total } = useBookmarks();
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadBookmarks(10, (page - 1) * 10);
  }, [page, loadBookmarks]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Saved Posts</h1>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading bookmarks...</div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No saved posts yet</p>
          <p className="text-sm mt-2">Save posts to read them later</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {bookmarks.map((bookmark: Bookmark) => (
              <div
                key={bookmark.id}
                className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{bookmark.post.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{bookmark.post.excerpt}</p>
                  </div>
                  <BookmarkButton postId={bookmark.post.id} initialIsBookmarked={true} />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {bookmark.post.author.displayName || bookmark.post.author.username}</span>
                  <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {total > bookmarks.length && (
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
                disabled={bookmarks.length < 10}
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
