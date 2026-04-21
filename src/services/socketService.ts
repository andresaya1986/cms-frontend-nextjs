import { io, Socket } from 'socket.io-client';
import { appConfig } from '@/lib/config';
import {
  FollowerEvent,
  ReactionEvent,
  ReactionRemovedEvent,
  PostCountersEvent,
  CommentEvent,
  TypingEvent,
  UserPresenceEvent,
  MentionEvent,
  ExtendedNotification,
} from '@/types';

export type SocketEventHandlers = {
  'notification:new'?: (notification: ExtendedNotification) => void;
  'notification:read'?: (data: { notificationId: string; readAt: string }) => void;
  'notification:all-read'?: (data: { count: number; timestamp: string }) => void;
  'notification:deleted'?: (data: { notificationId: string }) => void;
  'notification:cleared'?: (data: { count: number; timestamp: string }) => void;
  
  'follower:gained'?: (data: FollowerEvent) => void;
  'follower:lost'?: (data: { followerId: string; followerCount: number }) => void;
  'user:online'?: (data: UserPresenceEvent) => void;
  'user:offline'?: (data: UserPresenceEvent) => void;
  
  'reaction:added'?: (data: ReactionEvent) => void;
  'reaction:removed'?: (data: ReactionRemovedEvent) => void;
  'reaction:updated'?: (data: { userId: string; postId: string; oldType: string; newType: string; timestamp: string }) => void;
  'post:counters'?: (data: PostCountersEvent) => void;
  
  'comment:added'?: (data: CommentEvent) => void;
  'comment:deleted'?: (data: { postId: string; commentId: string; repliesDeleted: number }) => void;
  'typing:start'?: (data: TypingEvent) => void;
  'typing:stop'?: (data: TypingEvent) => void;
  
  'mention:new'?: (data: MentionEvent) => void;
  
  'post:viewer:joined'?: (data: { userId: string; username: string; postId: string; viewerCount: number }) => void;
  'post:viewer:left'?: (data: { userId: string; postId: string; viewerCount: number }) => void;
  
  'connect'?: () => void;
  'connect_error'?: (error: Error) => void;
  'disconnect'?: () => void;
};

class SocketService {
  private socket: Socket | null = null;
  private handlers: Map<string, Set<Function>> = new Map();
  private isConnecting = false;

  /**
   * Conectar al servidor WebSocket
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Si ya está intentando conectar, esperar a que termine
        const checkInterval = setInterval(() => {
          if (this.socket?.connected) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        return;
      }

      this.isConnecting = true;

      try {
        this.socket = io(appConfig.api.baseUrl.replace(/\/api\/.*/, ''), {
          auth: { token },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling'],
        });

        this.socket.on('connect', () => {
          this.isConnecting = false;
          this.emit('connect');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          this.isConnecting = false;
          this.emit('connect_error', error);
          reject(error);
        });

        this.socket.on('disconnect', () => {
          this.emit('disconnect');
        });

        // Registrar todos los event listeners
        this.setupEventListeners();
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Desconectar del servidor WebSocket
   */
  disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Registrar listener para un evento
   */
  on<T extends keyof SocketEventHandlers>(
    event: T,
    callback: SocketEventHandlers[T]
  ): () => void {
    if (!callback) return () => {};

    // Agregar callback a nuestro mapa local
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(callback as Function);

    // Si ya estamos conectados, registrar directamente
    if (this.socket) {
      this.socket.on(event, callback as any);
    }

    // Retornar función para desuscribirse
    return () => {
      this.handlers.get(event)?.delete(callback as Function);
      if (this.socket) {
        this.socket.off(event, callback as any);
      }
    };
  }

  /**
   * Escuchar un evento solo una vez
   */
  once<T extends keyof SocketEventHandlers>(
    event: T,
    callback: SocketEventHandlers[T]
  ): void {
    if (this.socket) {
      this.socket.once(event, callback as any);
    }
  }

  /**
   * Emitir un evento al servidor
   */
  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Desuscribirse de un evento
   */
  off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  /**
   * Marcar notificación como leída
   */
  markNotificationAsRead(notificationId: string): void {
    this.emit('notification:mark-read', notificationId);
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  markAllNotificationsAsRead(): void {
    this.emit('notification:mark-all-read');
  }

  /**
   * Unirse a un post (para recibir actualizaciones en tiempo real)
   */
  joinPost(postId: string): void {
    this.emit('join:post', postId);
  }

  /**
   * Salir de un post
   */
  leavePost(postId: string): void {
    this.emit('leave:post', postId);
  }

  /**
   * Indicar que el usuario está escribiendo
   */
  startTyping(postId: string): void {
    this.emit('typing:start', { postId });
  }

  /**
   * Indicar que el usuario dejó de escribir
   */
  stopTyping(postId: string): void {
    this.emit('typing:stop', { postId });
  }

  /**
   * Ping para mantener la conexión viva
   */
  ping(): void {
    this.emit('ping');
  }

  /**
   * Emitir una reacción
   */
  addReaction(postId: string, type: string): void {
    this.emit('reaction:add', { postId, type });
  }

  /**
   * Remover una reacción
   */
  removeReaction(postId: string, type: string): void {
    this.emit('reaction:remove', { postId, type });
  }

  /**
   * Emitir que se agregó un comentario
   */
  emitCommentAdded(postId: string, commentId: string): void {
    this.emit('comment:added', { postId, commentId });
  }

  /**
   * Emitir que se eliminó un comentario
   */
  emitCommentDeleted(postId: string, commentId: string): void {
    this.emit('comment:deleted', { postId, commentId });
  }

  /**
   * Emitir que el usuario fue seguido
   */
  emitFollowed(followedUserId: string, followerCount: number): void {
    this.emit('user:followed', { followedUserId, followerCount });
  }

  /**
   * Emitir que dejó de seguir
   */
  emitUnfollowed(unfollowedUserId: string): void {
    this.emit('user:unfollowed', { unfollowedUserId });
  }

  /**
   * Setup de todos los event listeners del socket
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Registrar todos los handlers que ya existen en nuestro mapa
    this.handlers.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, callback as any);
      });
    });
  }
}

export const socketService = new SocketService();
