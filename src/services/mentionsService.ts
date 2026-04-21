import apiClient, { endpoints } from '@/lib/api-client';
import { Mention, PaginatedResponse } from '@/types';

class MentionsService {
  /**
   * Obtener menciones de un post
   */
  async getMentions(postId: string, limit: number = 20, offset: number = 0): Promise<PaginatedResponse<Mention>> {
    const response = await apiClient.get(
      endpoints.mentions.list,
      { params: { postId, limit, offset } }
    );
    return response.data;
  }

  /**
   * Obtener menciones recibidas del usuario actual
   */
  async getReceivedMentions(limit: number = 20, offset: number = 0): Promise<PaginatedResponse<Mention> & { unreadCount: number }> {
    const response = await apiClient.get(
      endpoints.mentions.received,
      { params: { limit, offset } }
    );
    return response.data;
  }

  /**
   * Marcar una mención como leída
   */
  async markMentionAsRead(mentionId: string): Promise<{ success: boolean; isRead: boolean }> {
    const response = await apiClient.post(
      endpoints.mentions.markAsRead(mentionId),
      {}
    );
    return response.data;
  }
}

export default new MentionsService();
