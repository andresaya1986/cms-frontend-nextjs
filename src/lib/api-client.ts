import axios from 'axios';
import { appConfig } from './config';

// Crear el cliente axios con configuración centralizada
const apiClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== REQUEST DEDUPLICATION ====================
// Evitar requests duplicados que se hagan simultáneamente (ej: ReactionBar × 8 posts)
const pendingRequests = new Map<string, Promise<any>>();

function generateRequestKey(config: any): string {
  // Clave única basada en método, URL y params
  return `${config.method?.toUpperCase()}:${config.url}:${JSON.stringify(config.params || {})}`;
}

// Interceptor para incluir el JWT en las peticiones
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para deduplicación de requests GET
apiClient.interceptors.response.use(
  (response) => {
    // Limpiar la clave del request pendiente después de completarse
    const key = generateRequestKey(response.config);
    pendingRequests.delete(key);
    return response;
  },
  (error) => {
    // Limpiar incluso en error
    if (error.config) {
      const key = generateRequestKey(error.config);
      pendingRequests.delete(key);
    }
    
    if (error.response?.status === 401) {
      // No autenticado, limpiar sesión completamente
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      // Notificar al contexto que la sesión se perdió
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('session-lost'));
      }
    }
    return Promise.reject(error);
  }
);

// Wrapper para deduplicar GET requests
const originalGet = apiClient.get;
apiClient.get = function(this: any, url: string, config?: any) {
  const fullConfig = { ...config, url, method: 'GET' };
  const key = generateRequestKey(fullConfig);
  
  // Si ya hay un request pendiente con la misma clave, retornar la promise existente
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }
  
  // Crear un nuevo request y almacenarlo
  const promise = originalGet.call(this, url, config);
  pendingRequests.set(key, promise);
  
  return promise;
} as typeof apiClient.get;

// ==================== ENDPOINTS ====================
const API_VERSION = appConfig.api.version;

// Endpoints de Autenticación
const authEndpoints = {
  register: `/${API_VERSION}/auth/register`,
  login: `/${API_VERSION}/auth/login`,
  verify2FA: `/${API_VERSION}/auth/verify-2fa`,
  verifyEmail: `/${API_VERSION}/auth/verify-email`,
  resendOTP: `/${API_VERSION}/auth/resend-otp`,
  forgotPassword: `/${API_VERSION}/auth/forgot-password`,
  resetPassword: `/${API_VERSION}/auth/reset-password`,
  me: `/${API_VERSION}/auth/me`,
  logout: `/${API_VERSION}/auth/logout`,
  refresh: `/${API_VERSION}/auth/refresh`,
  sessions: `/${API_VERSION}/auth/sessions`,
  deleteSession: (sessionId: string) => `/${API_VERSION}/auth/sessions/${sessionId}`,
  profile: `/${API_VERSION}/auth/profile`,
  profileAvatar: `/${API_VERSION}/auth/profile/avatar`,
};

// Endpoints de Posts/Artículos
const postsEndpoints = {
  list: `/${API_VERSION}/posts`,
  create: `/${API_VERSION}/posts`,
  getBySlug: (slug: string) => `/${API_VERSION}/posts/${slug}`,
  getById: (id: string) => `/${API_VERSION}/posts/${id}`,
  update: (id: string) => `/${API_VERSION}/posts/${id}`,
  delete: (id: string) => `/${API_VERSION}/posts/${id}`,
  // Endpoints de imágenes en posts
  uploadImages: (id: string) => `/${API_VERSION}/posts/${id}/images`,
  getImages: (id: string) => `/${API_VERSION}/posts/${id}/images`,
  deleteImage: (id: string, mediaId: string) => `/${API_VERSION}/posts/${id}/images/${mediaId}`,
};

// Endpoints de Social (seguir, likes, feed)
const socialEndpoints = {
  follow: (userId: string) => `/${API_VERSION}/social/follow/${userId}`,
  unfollow: (userId: string) => `/${API_VERSION}/social/follow/${userId}`,
  like: `/${API_VERSION}/social/like`,
  unlike: `/${API_VERSION}/social/like`,
  feed: `/${API_VERSION}/social/feed`,
  getUserProfile: (username: string) => `/${API_VERSION}/social/users/${username}`,
  getUserFollowers: (username: string) => `/${API_VERSION}/social/users/${username}/followers`,
  getUserFollowing: (username: string) => `/${API_VERSION}/social/users/${username}/following`,
};

// Endpoints de Comentarios
const commentsEndpoints = {
  list: `/${API_VERSION}/comments`,
  create: `/${API_VERSION}/comments`,
  update: (commentId: string) => `/${API_VERSION}/comments/${commentId}`,
  delete: (commentId: string) => `/${API_VERSION}/comments/${commentId}`,
};

// Endpoints de Búsqueda
const searchEndpoints = {
  general: `/${API_VERSION}/search`,
  posts: `/${API_VERSION}/search/posts`,
  users: `/${API_VERSION}/search/users`,
};

// Endpoints de Media/Archivos
const mediaEndpoints = {
  upload: `/${API_VERSION}/media/upload`,
  list: `/${API_VERSION}/media`,
  getById: (id: string) => `/${API_VERSION}/media/${id}`,
  delete: (id: string) => `/${API_VERSION}/media/${id}`,
};

// Endpoints de Notificaciones
const notificationsEndpoints = {
  list: `/${API_VERSION}/notifications`,
  markAsRead: (id: string) => `/${API_VERSION}/notifications/${id}/read`,
  markAllAsRead: `/${API_VERSION}/notifications/read-all`,
};

// Endpoints de Analytics
const analyticsEndpoints = {
  postStats: (postId: string) => `/${API_VERSION}/analytics/posts/${postId}`,
  userStats: (userId: string) => `/${API_VERSION}/analytics/users/${userId}`,
};

// Endpoints de Health
const healthEndpoints = {
  health: `/health`,
  metrics: `/metrics`,
};

// Exportar endpoints agrupados
export const endpoints = {
  auth: authEndpoints,
  posts: postsEndpoints,
  social: socialEndpoints,
  comments: commentsEndpoints,
  search: searchEndpoints,
  media: mediaEndpoints,
  notifications: notificationsEndpoints,
  analytics: analyticsEndpoints,
  health: healthEndpoints,
};

export default apiClient;