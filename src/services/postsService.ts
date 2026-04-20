import apiClient, { endpoints } from '@/lib/api-client';
import { CreatePostPayload, Post, UpdatePostPayload } from '@/types';

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
    return response.data;
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
}

export default new PostsService();
