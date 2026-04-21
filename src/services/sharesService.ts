import apiClient, { endpoints } from '@/lib/api-client';
import { Share, CreateSharePayload, PaginatedResponse } from '@/types';

class SharesService {
  /**
   * Compartir un post
   */
  async sharePost(postId: string, payload: CreateSharePayload): Promise<Share> {
    const response = await apiClient.post(
      endpoints.social.sharePost(postId),
      payload
    );
    return response.data;
  }

  /**
   * Obtener quiénes compartieron un post
   */
  async getPostShares(postId: string, limit: number = 10, offset: number = 0): Promise<PaginatedResponse<Share>> {
    const response = await apiClient.get(
      endpoints.social.shares(postId),
      { params: { limit, offset } }
    );
    return response.data;
  }
}

export default new SharesService();
