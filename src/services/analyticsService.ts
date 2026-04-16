import apiClient, { endpoints } from '@/lib/api-client';
import { PostAnalytics, UserAnalytics } from '@/types';

class AnalyticsService {
  /**
   * Obtener estadísticas de un post
   */
  async getPostStats(postId: string): Promise<PostAnalytics> {
    const response = await apiClient.get(
      endpoints.analytics.postStats(postId)
    );
    return response.data;
  }

  /**
   * Obtener estadísticas de un usuario
   */
  async getUserStats(userId: string): Promise<UserAnalytics> {
    const response = await apiClient.get(
      endpoints.analytics.userStats(userId)
    );
    return response.data;
  }
}

export default new AnalyticsService();
