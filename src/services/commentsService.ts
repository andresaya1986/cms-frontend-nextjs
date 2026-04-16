import apiClient, { endpoints } from '@/lib/api-client';
import { Comment, CreateCommentPayload } from '@/types';

class CommentsService {
  /**
   * Obtener comentarios de un post
   */
  async getComments(postId: string, page: number = 1, pageSize: number = 10) {
    const response = await apiClient.get(
      endpoints.comments.list(postId),
      { params: { page, pageSize } }
    );
    return response.data;
  }

  /**
   * Crear comentario
   */
  async createComment(
    postId: string,
    payload: CreateCommentPayload
  ): Promise<Comment> {
    const response = await apiClient.post(
      endpoints.comments.create(postId),
      payload
    );
    return response.data;
  }

  /**
   * Actualizar comentario
   */
  async updateComment(
    commentId: string,
    payload: Partial<CreateCommentPayload>
  ): Promise<Comment> {
    const response = await apiClient.put(
      endpoints.comments.update(commentId),
      payload
    );
    return response.data;
  }

  /**
   * Eliminar comentario
   */
  async deleteComment(commentId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(
      endpoints.comments.delete(commentId)
    );
    return response.data;
  }
}

export default new CommentsService();
