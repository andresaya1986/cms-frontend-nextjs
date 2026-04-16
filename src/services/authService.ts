import apiClient, { endpoints } from '@/lib/api-client';
import { 
  AuthResponse, 
  LoginPayload, 
  RegisterPayload, 
  User,
  OTPVerifyPayload,
  ResendOTPPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  Session,
} from '@/types';

class AuthService {
  /**
   * Registrar nuevo usuario
   * NOTA: No autentica. El usuario solo está autenticado después de verificar el email y hacer login.
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post(
      endpoints.auth.register,
      payload
    );
    const data = response.data;
    // NO guardar el token en registro - el usuario debe verificar email y luego hacer login
    return data;
  }

  /**
   * Iniciar sesión
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post(
      endpoints.auth.login,
      payload
    );
    const data = response.data;
    if (data.accessToken) {
      localStorage.setItem('auth_token', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
    } else if (data.token) {
      localStorage.setItem('auth_token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
    }
    return data;
  }

  /**
   * Verificar 2FA con OTP
   */
  async verify2FA(payload: OTPVerifyPayload): Promise<AuthResponse> {
    const response = await apiClient.post(
      endpoints.auth.verify2FA,
      payload
    );
    const data = response.data;
    if (data.accessToken) {
      localStorage.setItem('auth_token', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
    }
    return data;
  }

  /**
   * Verificar email con token o OTP payload
   * NOTA: Solo activa la cuenta. No autentica. El usuario debe hacer login después.
   */
  async verifyEmail(payload: OTPVerifyPayload | string): Promise<{ success: boolean }> {
    // Permitir tanto un token string como un OTPVerifyPayload object
    const verifyPayload = typeof payload === 'string' 
      ? { token: payload } 
      : payload;
    
    const response = await apiClient.post(
      endpoints.auth.verifyEmail,
      verifyPayload
    );
    // NO guardar token aquí - el usuario debe hacer login después de verificar
    return response.data;
  }

  /**
   * Reenviar OTP
   */
  async resendOTP(payload: ResendOTPPayload): Promise<{ success: boolean }> {
    const response = await apiClient.post(
      endpoints.auth.resendOTP,
      payload
    );
    return response.data;
  }

  /**
   * Requerir reset de contraseña
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ success: boolean }> {
    const response = await apiClient.post(
      endpoints.auth.forgotPassword,
      payload
    );
    return response.data;
  }

  /**
   * Reset de contraseña con OTP
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean }> {
    const response = await apiClient.post(
      endpoints.auth.resetPassword,
      payload
    );
    return response.data;
  }

  /**
   * Obtener datos del usuario autenticado
   */
  async me(): Promise<User> {
    const response = await apiClient.get(endpoints.auth.me);
    return response.data;
  }

  /**
   * Listar sesiones del usuario
   */
  async getSessions(): Promise<Session[]> {
    const response = await apiClient.get(endpoints.auth.sessions);
    return response.data;
  }

  /**
   * Eliminar una sesión específica
   */
  async deleteSession(sessionId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(
      endpoints.auth.deleteSession(sessionId)
    );
    return response.data;
  }

  /**
   * Refrescar token JWT
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await apiClient.post(
      endpoints.auth.refresh,
      { refreshToken }
    );
    const data = response.data;
    if (data.accessToken) {
      localStorage.setItem('auth_token', data.accessToken);
    } else if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    return data;
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
