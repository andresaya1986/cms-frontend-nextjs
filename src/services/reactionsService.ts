import apiClient, { endpoints } from '@/lib/api-client';
import { Reaction, ReactionStats, CreateReactionPayload, PaginatedResponse, ReactionType } from '@/types';

class ReactionsService {
  /**
   * Crear o actualizar una reacción (toggle)
   */
  async addReaction(payload: CreateReactionPayload): Promise<Reaction> {
    const response = await apiClient.post(
      endpoints.reactions.create,
      payload
    );
    return response.data;
  }

  /**
   * Remover una reacción
   */
  async removeReaction(targetId: string, targetType: 'POST' | 'COMMENT'): Promise<{ success: boolean }> {
    const response = await apiClient.delete(
      endpoints.reactions.create,
      { data: { targetId, targetType } }
    );
    return response.data;
  }

  /**
   * Obtener reacciones de un post o comentario
   */
  async getReactions(
    targetId: string,
    targetType: 'POST' | 'COMMENT',
    limit: number = 20,
    offset: number = 0
  ): Promise<PaginatedResponse<Reaction>> {
    const response = await apiClient.get(
      endpoints.reactions.list,
      { params: { targetId, targetType, limit, offset } }
    );
    return response.data;
  }

  /**
   * Obtener estadísticas de reacciones
   */
  async getReactionStats(targetId: string, targetType: 'POST' | 'COMMENT'): Promise<ReactionStats> {
    const response = await apiClient.get(
      endpoints.reactions.stats,
      { params: { targetId, targetType } }
    );
    return response.data;
  }

  /**
   * Cambiar el tipo de reacción
   */
  async updateReaction(
    targetId: string,
    targetType: 'POST' | 'COMMENT',
    newType: ReactionType
  ): Promise<Reaction> {
    const response = await apiClient.patch(
      endpoints.reactions.create,
      { targetId, targetType, type: newType }
    );
    return response.data;
  }
}

export default new ReactionsService();
