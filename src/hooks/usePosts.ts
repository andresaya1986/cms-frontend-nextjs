import { useState, useCallback, useRef } from 'react';
import { Post } from '@/types';
import postsService from '@/services/postsService';

// Función para transformar datos de la API al formato esperado
function transformPost(apiPost: any): Post {
  return {
    ...apiPost,
    // Renombrar campos
    likeCount: apiPost.likesCount || 0,
    commentCount: apiPost.commentsCount || 0,
    // Transformar tags: de {tag: {name}} a string[]
    tags: apiPost.tags?.map((t: any) => t.tag?.name || t.tag?.slug || t.name || '').filter(Boolean) || [],
    // Transformar categorías: de {category: {name}} a string[]
    categories: apiPost.categories?.map((c: any) => c.category?.name || c.category?.slug || c.name || '').filter(Boolean) || [],
  };
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  // Usar refs para mantener estado sin causar reconstrucción de funciones
  const currentPageRef = useRef(1);
  const pageSizeRef = useRef(10);

  const fetchPosts = useCallback(async (page = 1, newPageSize = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postsService.getPostsList(page, newPageSize);
      const postsList = data.data || data;
      // Transformar todos los posts
      const transformedPosts = Array.isArray(postsList) 
        ? postsList.map(transformPost)
        : [transformPost(postsList)];
      setPosts(transformedPosts);
      currentPageRef.current = page;
      pageSizeRef.current = newPageSize;
      // Determinar si hay más posts
      setHasMore(transformedPosts.length === newPageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar más posts (para infinite scroll)
  const loadMorePosts = useCallback(async () => {
    // Guard: si ya estamos cargando, no hagas nada
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const nextPage = currentPageRef.current + 1;
      const pageSize = pageSizeRef.current;
      
      const data = await postsService.getPostsList(nextPage, pageSize);
      const postsList = data.data || data;
      const transformedPosts = Array.isArray(postsList)
        ? postsList.map(transformPost)
        : [transformPost(postsList)];
      
      setPosts((prev) => [...prev, ...transformedPosts]);
      currentPageRef.current = nextPage;
      setHasMore(transformedPosts.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading more posts');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const getPost = useCallback(async (slug: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const post = await postsService.getPostBySlug(slug);
      return transformPost(post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching post');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPost = useCallback(async (payload: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPost = await postsService.createPost(payload);
      const transformed = transformPost(newPost);
      setPosts((prev) => [transformed, ...prev]);
      return transformed;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating post');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id: string, title?: string, content?: string, excerpt?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await postsService.updatePost(id, { title, content, excerpt });
      const transformed = transformPost(updated);
      setPosts((prev) => prev.map((p) => (p.id === id ? transformed : p)));
      return transformed;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating post');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await postsService.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting post');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    posts,
    isLoading,
    error,
    fetchPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    loadMorePosts,
    hasMore,
  };
}
