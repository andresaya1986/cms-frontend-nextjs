'use client';

import { useState } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { PostType, PostStatus, PostVisibility } from '@/types';

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const { createPost, isLoading, error: hookError } = usePosts();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    type: 'ARTICLE' as PostType,
    status: 'DRAFT' as PostStatus,
    visibility: 'PUBLIC' as PostVisibility,
    metaTitle: '',
    metaDescription: '',
    tags: '',
    categories: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

    if (!formData.title.trim()) {
      setError('El título es requerido');
      return;
    }

    if (!formData.content.trim()) {
      setError('El contenido es requerido');
      return;
    }

    try {
      // Construir el payload con todos los campos que espera el backend
      const payload = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        type: formData.type,
        status: formData.status,
        visibility: formData.visibility,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        categories: formData.categories ? formData.categories.split(',').map(c => c.trim()).filter(Boolean) : undefined,
      };

      const newPost = await createPost(payload);

      if (newPost) {
        setSuccess(true);
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          type: 'ARTICLE',
          status: 'DRAFT',
          visibility: 'PUBLIC',
          metaTitle: '',
          metaDescription: '',
          tags: '',
          categories: '',
        });

        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando el post');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Crear Nuevo Post</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {hookError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {hookError}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ✅ Post creado exitosamente. Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium mb-2">Título *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título del post"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Tipo de Post */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="ARTICLE">Artículo</option>
              <option value="NEWS">Noticia</option>
              <option value="TUTORIAL">Tutorial</option>
              <option value="GUIDE">Guía</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Visibilidad</label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="PUBLIC">Público</option>
              <option value="PRIVATE">Privado</option>
              <option value="RESTRICTED">Restringido</option>
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium mb-2">Resumen (opcional)</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Resumen corto del post"
            rows={2}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Contenido */}
        <div>
          <label className="block text-sm font-medium mb-2">Contenido *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Contenido del post..."
            rows={12}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-2">
            Puedes usar Markdown para formatear el contenido
          </p>
        </div>

        {/* Meta información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Meta Título (opcional)</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              placeholder="Título para SEO"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meta Descripción (opcional)</label>
            <input
              type="text"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              placeholder="Descripción para SEO"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Tags y categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tags (opcional)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Separadas por comas: tag1, tag2, tag3"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categorías (opcional)</label>
            <input
              type="text"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              placeholder="Separadas por comas: cat1, cat2"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-end pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {isLoading ? 'Creando...' : 'Crear Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
