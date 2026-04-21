import apiClient, { endpoints } from '@/lib/api-client';
import { Hashtag, HashtagStats, Post, PaginatedResponse } from '@/types';

class HashtagsService {
  /**
   * Buscar hashtags
   */
  async searchHashtags(query: string, limit: number = 20): Promise<{ hashtags: Hashtag[]; total: number }> {
    const response = await apiClient.get(
      endpoints.hashtags.search,
      { params: { query, limit } }
    );
    return response.data;
  }

  /**
   * Obtener hashtags trending
   */
  async getTrendingHashtags(limit: number = 20): Promise<{ trending: Hashtag[]; lastUpdated: string }> {
    const response = await apiClient.get(
      endpoints.hashtags.trending,
      { params: { limit } }
    );
    return response.data;
  }

  /**
   * Obtener posts con un hashtag específico
   */
  async getPostsByHashtag(
    tagName: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<{
    hashtag: Hashtag;
    posts: Post[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const response = await apiClient.get(
      endpoints.hashtags.getByName(tagName),
      { params: { limit, offset } }
    );
    return response.data;
  }

  /**
   * Obtener estadísticas de un hashtag
   */
  async getHashtagStats(tagName: string): Promise<HashtagStats> {
    const response = await apiClient.get(
      endpoints.hashtags.stats(tagName)
    );
    return response.data;
  }
}

export default new HashtagsService();
