import apiClient, { endpoints } from '@/lib/api-client';
import { Bookmark, PaginatedResponse } from '@/types';

class BookmarksService {
  /**
   * Guardar o desguardar un post
   */
  async toggleBookmark(postId: string): Promise<{ isBookmarked: boolean }> {
    const response = await apiClient.post(
      endpoints.social.bookmarkPost(postId),
      {}
    );
    return response.data;
  }

  /**
   * Obtener posts guardados del usuario
   */
  async getBookmarks(limit: number = 20, offset: number = 0): Promise<PaginatedResponse<Bookmark>> {
    const response = await apiClient.get(
      endpoints.social.bookmarks,
      { params: { limit, offset } }
    );
    return response.data;
  }

  /**
   * Eliminar un bookmark
   */
  async deleteBookmark(postId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(
      endpoints.social.bookmarkPost(postId)
    );
    return response.data;
  }
}

export default new BookmarksService();
