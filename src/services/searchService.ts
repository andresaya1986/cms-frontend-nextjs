import apiClient, { endpoints } from '@/lib/api-client';
import { SearchResult, Post, UserProfile } from '@/types';

class SearchService {
  /**
   * Buscar posts
   */
  async searchPosts(query: string, limit = 10, page = 1): Promise<SearchResult<Post>> {
    const response = await apiClient.get(
      endpoints.search.posts,
      {
        params: {
          q: query,
          limit,
          page,
        },
      }
    );
    return response.data;
  }

  /**
   * Buscar usuarios
   */
  async searchUsers(query: string, limit = 10, page = 1): Promise<SearchResult<UserProfile>> {
    const response = await apiClient.get(
      endpoints.search.users,
      {
        params: {
          q: query,
          limit,
          page,
        },
      }
    );
    return response.data;
  }
}

export default new SearchService();
