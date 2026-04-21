import apiClient, { endpoints } from '@/lib/api-client';

interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
}

interface ProfileResponse {
  user: {
    id: string;
    email: string;
    username: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    coverUrl?: string;
    role: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    createdAt: string;
    _count?: {
      followers: number;
      following: number;
      posts: number;
    };
  };
}

class ProfileService {
  /**
   * Actualizar datos del perfil del usuario
   */
  async updateProfile(data: UpdateProfileData): Promise<ProfileResponse> {
    const response = await apiClient.patch(endpoints.auth.profile, data);
    return response.data;
  }

  /**
   * Obtener perfil actual del usuario
   */
  async getCurrentProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get(endpoints.auth.me);
    return response.data;
  }
}

export default new ProfileService();
