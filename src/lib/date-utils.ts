/**
 * Parsea una fecha de forma segura
 * Maneja múltiples formatos de fecha y retorna un objeto Date válido o null
 */
export function parseDateSafely(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;

  // Intentar parsear como ISO 8601
  let date = new Date(dateStr);
  
  // Si falla, intentar otros formatos
  if (isNaN(date.getTime())) {
    // Intentar remover miisegundos malformados y re-parsear
    const cleanedDate = dateStr.replace(/(\.\d{1,3})([^Z]|$)/, '$1Z');
    date = new Date(cleanedDate);
  }

  return isNaN(date.getTime()) ? null : date;
}

/**
 * Formatea una fecha de forma legible en español
 */
export function formatDate(
  dateStr: string | null | undefined,
  options: {
    includeTime?: boolean;
    format?: 'short' | 'long';
  } = {}
): string {
  const { includeTime = true, format = 'long' } = options;

  const date = parseDateSafely(dateStr);
  if (!date) return 'Fecha inválida';

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
  };

  if (includeTime) {
    dateOptions.hour = '2-digit';
    dateOptions.minute = '2-digit';
  }

  try {
    return date.toLocaleDateString('es-ES', dateOptions);
  } catch {
    return 'Fecha inválida';
  }
}

/**
 * Calcula tiempo relativo desde hace cuánto se creó (e.g., "Hace 2 horas")
 */
export function getRelativeTime(dateStr: string | null | undefined): string {
  const date = parseDateSafely(dateStr);
  if (!date) return 'Hace poco';

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return 'Ahora mismo';
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  if (weeks < 4) return `Hace ${weeks}w`;

  return formatDate(dateStr, { format: 'short' });
}
