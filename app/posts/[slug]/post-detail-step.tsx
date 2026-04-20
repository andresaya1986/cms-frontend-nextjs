'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/types';

interface PostDetailStepProps {
  slug: string;
}

export default function PostDetailStep({ slug }: PostDetailStepProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        console.log('📥 Loading post:', slug);
        setIsLoading(true);
        
        // Usar fetch directo en lugar de servicio
        const response = await fetch(`/api/v1/posts/${slug}`);
        console.log('📊 Fetch response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Post received:', data);
        setPost(data.data || data);
        setError(null);
      } catch (err) {
        console.error('📛 Error:', err);
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        setError(msg);
        setPost(null);
      } finally {
        console.log('✅ Loading complete');
        setIsLoading(false);
      }
    };

    if (slug) {
      console.log('🚀 useEffect triggered for slug:', slug);
      loadPost();
    }
  }, [slug]);

  console.log('🎬 Render:', { slug, isLoading, hasPost: !!post, error });

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Post Detail Debug</h1>
      <p><strong>Slug:</strong> {slug}</p>
      <p><strong>Loading:</strong> {isLoading ? '🔄 YES' : '✅ NO'}</p>
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      {post && (
        <div style={{ marginTop: '20px', border: '1px solid blue', padding: '10px' }}>
          <p><strong>Post Title:</strong> {post.title}</p>
          <p><strong>Post ID:</strong> {post.id}</p>
          <p><strong>Author:</strong> {post.author?.username}</p>
          <p><strong>Created:</strong> {post.createdAt}</p>
        </div>
      )}
      {isLoading && <p>Espera mientras se carga...</p>}
      {!isLoading && !post && <p>No hay datos</p>}
    </div>
  );
}
