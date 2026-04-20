import apiClient, { endpoints } from '@/lib/api-client';
import { SearchResult, Post, UserProfile } from '@/types';

class SearchService {
  /**
   * Búsqueda general (posts y usuarios)
   */
  async search(query: string, type: 'all' | 'posts' | 'users' = 'all', limit = 20, page = 1): Promise<SearchResult<any>> {
    const response = await apiClient.get(
      endpoints.search.general,
      {
        params: {
          q: query,
          type,
          limit,
          page,
        },
      }
    );
    return response.data;
  }

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
