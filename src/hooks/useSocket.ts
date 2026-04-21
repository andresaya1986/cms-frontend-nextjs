import { useEffect, useCallback, useState } from 'react';
import { socketService, SocketEventHandlers } from '@/services/socketService';
import { useAuth } from '@/context/AuthContext';

export function useSocket() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Conectar cuando tenga token
  useEffect(() => {
    if (!user) return;

    const connect = async () => {
      setIsConnecting(true);
      try {
        // Obtener token del localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.warn('No token found in localStorage');
          setIsConnecting(false);
          return;
        }

        if (!socketService.isConnected()) {
          await socketService.connect(token);
          setIsConnected(true);
        } else {
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setIsConnected(false);
      } finally {
        setIsConnecting(false);
      }
    };

    connect();

    // Desconectar cuando se desmonte o cuando no hay usuario
    return () => {
      // No desconectar inmediatamente, mantener la conexión
    };
  }, [user]);

  // Hook para escuchar eventos
  const on = useCallback(
    <T extends keyof SocketEventHandlers>(
      event: T,
      callback: SocketEventHandlers[T]
    ) => {
      return socketService.on(event, callback);
    },
    []
  );

  // Hook para escuchar una sola vez
  const once = useCallback(
    <T extends keyof SocketEventHandlers>(
      event: T,
      callback: SocketEventHandlers[T]
    ) => {
      socketService.once(event, callback);
    },
    []
  );

  // Hook para emitir eventos
  const emit = useCallback((event: string, data?: any) => {
    socketService.emit(event, data);
  }, []);

  // Hook para marcar notificaciones como leídas
  const markNotificationAsRead = useCallback((notificationId: string) => {
    socketService.markNotificationAsRead(notificationId);
  }, []);

  // Hook para unirse a un post
  const joinPost = useCallback((postId: string) => {
    socketService.joinPost(postId);
  }, []);

  // Hook para salir de un post
  const leavePost = useCallback((postId: string) => {
    socketService.leavePost(postId);
  }, []);

  // Hook para iniciar a escribir
  const startTyping = useCallback((postId: string) => {
    socketService.startTyping(postId);
  }, []);

  // Hook para dejar de escribir
  const stopTyping = useCallback((postId: string) => {
    socketService.stopTyping(postId);
  }, []);

  return {
    isConnected,
    isConnecting,
    on,
    once,
    emit,
    markNotificationAsRead,
    joinPost,
    leavePost,
    startTyping,
    stopTyping,
  };
}
