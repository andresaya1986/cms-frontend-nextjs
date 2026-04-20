'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Post, UpdatePostPayload } from '@/types';
import postsService from '@/services/postsService';
import Link from 'next/link';

interface EditPostClientProps {
  post: Post;
}

export function EditPostClient({ post }: EditPostClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || '',
    type: post.type as any,
    status: post.status as any,
    visibility: post.visibility as any,
    metaTitle: post.metaTitle || '',
    metaDescription: post.metaDescription || '',
    coverImage: post.coverImage || '',
    tags: post.tags?.join(', ') || '',
    categories: post.categories?.join(', ') || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar permisos
  const canEdit = user && (user.id === post.author?.id || user.role === 'ADMIN');
  if (!canEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="mb-6">No tienes permisos para editar este post.</p>
          <Link href="/dashboard" className="text-primary-600 hover:underline">
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    if (!formData.title.trim()) {
      setError('El título es requerido');
      setIsLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      setError('El contenido es requerido');
      setIsLoading(false);
      return;
    }

    try {
      const payload: UpdatePostPayload = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        type: formData.type,
        status: formData.status,
        visibility: formData.visibility,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        coverImage: formData.coverImage || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        categories: formData.categories ? formData.categories.split(',').map(c => c.trim()).filter(Boolean) : undefined,
      };

      const updatedPost = await postsService.updatePost(post.id, payload);
      setSuccess(true);

      setTimeout(() => {
        // Usar el slug del post actualizado si existe, sino usar el slug anterior
        const redirectSlug = updatedPost?.slug || post.slug;
        router.push(`/posts/${redirectSlug}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando el post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-8 max-w-4xl mx-auto border border-neutral-200 dark:border-neutral-800 my-8">
      <div className="mb-6">
        <Link href={`/posts/${post.slug}`} className="text-primary-600 hover:text-primary-700 font-medium">
          ← Volver al post
        </Link>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Editar Post</h2>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-6">
          ✅ Post actualizado exitosamente. Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Título *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título del post"
            className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
        </div>

        {/* Tipo, Estado, Visibilidad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Tipo</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            >
              <option value="ARTICLE">Artículo</option>
              <option value="NEWS">Noticia</option>
              <option value="TUTORIAL">Tutorial</option>
              <option value="GUIDE">Guía</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            >
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Visibilidad</label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            >
              <option value="PUBLIC">Público</option>
              <option value="PRIVATE">Privado</option>
              <option value="RESTRICTED">Restringido</option>
            </select>
          </div>
        </div>

        {/* Imagen y Excerpt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Imagen (opcional)</label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="URL de la imagen"
              className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
            {formData.coverImage && (
              <div className="mt-2 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                <img src={formData.coverImage} alt="Preview" className="w-full h-32 object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Resumen (opcional)</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Resumen corto del post"
              rows={5}
              className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Contenido */}
        <div>
          <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Contenido *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Contenido del post..."
            rows={12}
            className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            disabled={isLoading}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            Puedes usar Markdown para formatear el contenido
          </p>
        </div>

        {/* Meta información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Meta Título (opcional)</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              placeholder="Título para SEO"
              className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Meta Descripción (opcional)</label>
            <input
              type="text"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              placeholder="Descripción para SEO"
              className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Tags y categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Tags (opcional)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Separadas por comas: tag1, tag2, tag3"
              className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-900 dark:text-neutral-100">Categorías (opcional)</label>
            <input
              type="text"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              placeholder="Separadas por comas: cat1, cat2"
              className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-end pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <Link
            href={`/posts/${post.slug}`}
            className="px-6 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </span>
            ) : (
              '✓ Guardar Cambios'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
