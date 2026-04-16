'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post, Comment } from '@/types';
import postsService from '@/services/postsService';
import commentsService from '@/services/commentsService';
import { useAuth } from '@/context/AuthContext';
import { ReactionBar } from '@/components/ui/ReactionBar';

interface PostDetailPageProps {
  params: {
    slug: string;
  };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        const data = await postsService.getPostBySlug(params.slug);
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando el post');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [params.slug]);

  // Cargar comentarios cuando se abre la sección
  useEffect(() => {
    if (!showComments || !post?.id) return;

    const loadComments = async () => {
      try {
        setIsLoadingComments(true);
        const response = await commentsService.getComments(post.id);
        setComments(response.data || []);
      } catch (err) {
        console.error('Error cargando comentarios:', err);
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadComments();
  }, [showComments, post?.id]);

  const handleAddComment = async () => {
    if (!comment.trim() || !post?.id) return;
    
    try {
      setIsSubmittingComment(true);
      const newComment = await commentsService.createComment(post.id, {
        content: comment,
      });
      
      setComments([newComment, ...comments]);
      setComment('');
      
      // Actualizar contador de comentarios en el post
      setPost({
        ...post,
        commentCount: (post.commentCount || 0) + 1,
      });
    } catch (err) {
      console.error('Error al comentar:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 pb-8 bg-white dark:bg-neutral-950 min-h-screen flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-20 pb-8 bg-white dark:bg-neutral-950 min-h-screen">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-red-800 dark:text-red-200 font-bold mb-2">Error</h2>
            <p className="text-red-600 dark:text-red-300 mb-4">{error || 'Post no encontrado'}</p>
            <Link
              href="/dashboard"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              ← Volver al feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-8 bg-white dark:bg-neutral-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Botón volver */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6 transition-colors"
        >
          ← Volver al feed
        </Link>

        {/* Post container */}
        <article className="bg-white dark:bg-neutral-900 rounded-xl shadow-cm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {/* Header */}
          <div className="px-6 sm:px-8 py-6 border-b border-neutral-200 dark:border-neutral-800">
            {/* Autor */}
            <div className="flex items-center gap-4 mb-4">
              {post.author?.avatarUrl || post.author?.avatar ? (
                <img
                  src={post.author.avatarUrl || post.author.avatar}
                  alt={post.author?.username}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                  {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {post.author?.displayName || post.author?.username}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {new Date(post.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
                {post.excerpt}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-sm text-neutral-500 dark:text-neutral-400">
              <span>{post.type}</span>
              <span>•</span>
              <span>👁️ {post.viewCount} vistas</span>
              <span>•</span>
              <span>❤️ {post.likeCount} reacciones</span>
              <span>•</span>
              <span>💬 {post.commentCount} comentarios</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 py-8 prose dark:prose-invert max-w-none">
            {/* Renderizar contenido como HTML (si está en markdown o HTML) */}
            <div className="text-neutral-900 dark:text-neutral-100 leading-relaxed whitespace-pre-wrap break-words">
              {post.content}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="px-6 sm:px-8 py-6 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                  >
                    #{typeof tag === 'string' ? tag : (tag as any)?.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reactions Bar */}
          <ReactionBar
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            onReact={(reaction) => {
              console.log('Reacted:', reaction);
            }}
            onComment={() => setShowComments(!showComments)}
          />

          {/* Comments Section */}
          {showComments && (
            <div className="px-6 sm:px-8 py-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                Comentarios ({post.commentCount})
              </h3>

              {/* Agregar comentario */}
              <div className="mb-6 flex gap-3">
                {user?.avatarUrl || user?.avatar ? (
                  <img
                    src={user.avatarUrl || user.avatar}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    disabled={isSubmittingComment}
                    className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                    rows={3}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!comment.trim() || isSubmittingComment}
                    className="mt-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmittingComment ? 'Publicando...' : 'Publicar comentario'}
                  </button>
                </div>
              </div>

              {/* Lista de comentarios */}
              {isLoadingComments ? (
                <div className="flex gap-2 justify-center py-4">
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      {c.author?.avatarUrl || c.author?.avatar ? (
                        <img
                          src={c.author.avatarUrl || c.author.avatar}
                          alt={c.author?.username}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {c.author?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="flex-1 bg-white dark:bg-neutral-900 rounded-lg p-3">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                          {c.author?.displayName || c.author?.username}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                          {new Date(c.createdAt).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-neutral-800 dark:text-neutral-200 text-sm">
                          {c.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 dark:text-neutral-400 text-sm text-center py-4">
                  No hay comentarios todavía. ¡Sé el primero en comentar!
                </p>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
