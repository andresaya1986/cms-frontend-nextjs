import apiClient, { endpoints } from '@/lib/api-client';
import { CreatePostPayload, Post, UpdatePostPayload } from '@/types';

interface PostImage {
  id: string;
  uploaderId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string;
  bucket: string;
  key: string;
  width: number;
  height: number;
  altText?: string;
  caption?: string;
  createdAt: string;
}

class PostsService {
  /**
   * Obtener lista de posts
   */
  async getPostsList(page: number = 1, pageSize: number = 10) {
    const response = await apiClient.get(
      endpoints.posts.list,
      { params: { page, pageSize } }
    );
    return response.data;
  }

  /**
   * Obtener post por slug
   */
  async getPostBySlug(slug: string): Promise<Post> {
    const response = await apiClient.get(
      endpoints.posts.getBySlug(slug)
    );
    return response.data;
  }

  /**
   * Crear nuevo post
   */
  async createPost(payload: CreatePostPayload): Promise<Post> {
    const response = await apiClient.post(
      endpoints.posts.create,
      payload
    );
    // Extraer el post del wrapper si existe
    const post = response.data.data || response.data;
    return post;
  }

  /**
   * Actualizar post
   */
  async updatePost(
    id: string,
    payload: UpdatePostPayload
  ): Promise<Post> {
    const response = await apiClient.patch(
      endpoints.posts.update(id),
      payload
    );
    return response.data.data || response.data;
  }

  /**
   * Eliminar post
   */
  async deletePost(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(
      endpoints.posts.delete(id)
    );
    return response.data;
  }

  /**
   * Subir imágenes a un post (máximo 10 imágenes, 50 MB cada una)
   */
  async uploadPostImages(postId: string, files: File[]): Promise<PostImage[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const response = await apiClient.post(
      endpoints.posts.uploadImages(postId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data = response.data.data || response.data;
    // Asegurar que siempre se retorna un array (cuando es una sola imagen, el backend puede retornar un objeto)
    return Array.isArray(data) ? data : [data];
  }

  /**
   * Obtener imágenes de un post
   */
  async getPostImages(postId: string): Promise<PostImage[]> {
    const response = await apiClient.get(
      endpoints.posts.getImages(postId)
    );
    return response.data.data || response.data;
  }

  /**
   * Eliminar una imagen de un post
   */
  async deletePostImage(postId: string, mediaId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(
      endpoints.posts.deleteImage(postId, mediaId)
    );
    return response.data;
  }
}

export default new PostsService();
