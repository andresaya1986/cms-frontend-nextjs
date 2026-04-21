import { useState, useCallback } from 'react';
import reactionsService from '@/services/reactionsService';
import { ReactionType, ReactionStats, Reaction } from '@/types';

export function useReactions(targetId: string, targetType: 'POST' | 'COMMENT' = 'POST') {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [stats, setStats] = useState<ReactionStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar estadísticas de reacciones
  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reactionsService.getReactionStats(targetId, targetType);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading reactions');
    } finally {
      setIsLoading(false);
    }
  }, [targetId, targetType]);

  // Cargar reacciones
  const loadReactions = useCallback(async (limit = 20, offset = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reactionsService.getReactions(targetId, targetType, limit, offset);
      setReactions(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading reactions');
    } finally {
      setIsLoading(false);
    }
  }, [targetId, targetType]);

  // Agregar o cambiar reacción
  const react = useCallback(async (type: ReactionType) => {
    setError(null);
    try {
      await reactionsService.addReaction({
        targetId,
        targetType,
        type
      });
      // Recarga estadísticas después de agregar reacción
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding reaction');
    }
  }, [targetId, targetType, loadStats]);

  // Remover reacción
  const unreact = useCallback(async () => {
    setError(null);
    try {
      await reactionsService.removeReaction(targetId, targetType);
      // Recarga estadísticas después de remover reacción
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing reaction');
    }
  }, [targetId, targetType, loadStats]);

  return {
    reactions,
    stats,
    isLoading,
    error,
    loadStats,
    loadReactions,
    react,
    unreact
  };
}
