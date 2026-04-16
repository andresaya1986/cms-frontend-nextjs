import apiClient, { endpoints } from '@/lib/api-client';
import { UserProfile, FeedPost } from '@/types';

class SocialService {
  /**
   * Seguir a un usuario
   */
  async followUser(userId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post(
      endpoints.social.follow(userId),
      {}
    );
    return response.data;
  }

  /**
   * Dejar de seguir a un usuario
   */
  async unfollowUser(userId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(
      endpoints.social.follow(userId)
    );
    return response.data;
  }

  /**
   * Dar like a un post
   */
  async likePost(postId: string): Promise<{ success: boolean; likes: number }> {
    const response = await apiClient.post(
      endpoints.social.like,
      { postId }
    );
    return response.data;
  }

  /**
   * Quitar like de un post
   */
  async unlikePost(postId: string): Promise<{ success: boolean; likes: number }> {
    const response = await apiClient.delete(
      endpoints.social.like,
      { data: { postId } }
    );
    return response.data;
  }

  /**
   * Obtener feed de posts
   */
  async getFeed(page: number = 1, pageSize: number = 10) {
    const response = await apiClient.get(
      endpoints.social.feed,
      { params: { page, pageSize } }
    );
    return response.data;
  }

  /**
   * Obtener perfil de usuario
   */
  async getUserProfile(username: string): Promise<UserProfile> {
    const response = await apiClient.get(
      endpoints.social.getUserProfile(username)
    );
    return response.data;
  }
}

export default new SocialService();
