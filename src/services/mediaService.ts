import apiClient, { endpoints } from '@/lib/api-client';
import { Media } from '@/types';

class MediaService {
  /**
   * Subir archivo
   */
  async upload(file: File, type?: string): Promise<Media> {
    const formData = new FormData();
    formData.append('file', file);
    if (type) {
      formData.append('type', type);
    }

    const response = await apiClient.post(
      endpoints.media.upload,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Obtener archivo por ID
   */
  async getById(id: string): Promise<Media> {
    const response = await apiClient.get(
      endpoints.media.getById(id)
    );
    return response.data;
  }

  /**
   * Eliminar archivo
   */
  async delete(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(
      endpoints.media.delete(id)
    );
    return response.data;
  }
}

export default new MediaService();
