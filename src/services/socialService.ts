import apiClient, { endpoints } from '@/lib/api-client';
import { 
  UserProfile, 
  FeedPost, 
  FollowerInfo, 
  UserSuggestion,
  FollowResponse,
  PaginatedResponse 
} from '@/types';

class SocialService {
  /**
   * Seguir a un usuario
   */
  async followUser(userId: string): Promise<FollowResponse> {
    const response = await apiClient.post(
      endpoints.social.follow(userId),
      {}
    );
    return response.data;
  }

  /**
   * Dejar de seguir a un usuario
   */
  async unfollowUser(userId: string): Promise<FollowResponse> {
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
  async getFeed(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<FeedPost>> {
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

  /**
   * Obtener seguidores de un usuario
   */
  async getFollowers(username: string, limit: number = 20, offset: number = 0): Promise<PaginatedResponse<FollowerInfo>> {
    const response = await apiClient.get(
      endpoints.social.getUserFollowers(username),
      { params: { limit, offset } }
    );
    return response.data;
  }

  /**
   * Obtener usuarios que sigue un usuario
   */
  async getFollowing(username: string, limit: number = 20, offset: number = 0): Promise<PaginatedResponse<FollowerInfo>> {
    const response = await apiClient.get(
      endpoints.social.getUserFollowing(username),
      { params: { limit, offset } }
    );
    return response.data;
  }

  /**
   * Buscar usuarios
   */
  async searchUsers(q: string, limit: number = 20, offset: number = 0): Promise<PaginatedResponse<UserProfile>> {
    const response = await apiClient.get(
      endpoints.social.search,
      { params: { q, limit, offset } }
    );
    return response.data;
  }

  /**
   * Búsqueda avanzada de usuarios
   */
  async searchUsersAdvanced(query: string, limit: number = 20, offset: number = 0): Promise<PaginatedResponse<UserProfile>> {
    const response = await apiClient.get(
      endpoints.social.searchAdvanced,
      { params: { query, limit, offset } }
    );
    return response.data;
  }

  /**
   * Obtener sugerencias de usuarios a seguir
   */
  async getUserSuggestions(limit: number = 10): Promise<{ suggestions: UserSuggestion[] }> {
    const response = await apiClient.get(
      endpoints.social.suggestions,
      { params: { limit } }
    );
    return response.data;
  }
}

export default new SocialService();
