'use client';

import { Post } from '@/types';
import { PostCard } from '../ui/PostCard';

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
  onDeletePost?: (id: string) => void;
  onReact?: (postId: string, reaction: string) => void;
}

export function PostList({ posts, isLoading, onDeletePost, onReact }: PostListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-96 h-64 bg-neutral-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-50 rounded-xl">
        <p className="text-neutral-500 text-lg mb-2">📝 No hay posts aún</p>
        <p className="text-neutral-400 text-sm">Crea el primero para comenzar a compartir contenido</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={onDeletePost}
          onReact={onReact}
        />
      ))}
    </div>
  );
}
