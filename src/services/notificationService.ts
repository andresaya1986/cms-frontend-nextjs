import apiClient, { endpoints } from '@/lib/api-client';
import { ExtendedNotification, PaginatedResponse } from '@/types';

class NotificationService {
  /**
   * Listar notificaciones del usuario
   */
  async list(page = 1, limit = 20): Promise<PaginatedResponse<ExtendedNotification>> {
    const response = await apiClient.get(
      endpoints.notifications.list,
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.patch(
      endpoints.notifications.markAsRead(id)
    );
    return response.data;
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<{ success: boolean }> {
    const response = await apiClient.patch(
      endpoints.notifications.markAllAsRead
    );
    return response.data;
  }
}

export default new NotificationService();
