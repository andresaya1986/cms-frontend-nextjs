'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import mediaService from '@/services/mediaService';

interface ProfileAvatarUploadProps {
  currentAvatar?: string;
  onUploadSuccess?: (avatarUrl: string) => void;
}

export function ProfileAvatarUpload({ currentAvatar, onUploadSuccess }: ProfileAvatarUploadProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 10MB para avatares)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no puede ser mayor a 10 MB');
      return;
    }

    try {
      setError(null);
      setIsUploading(true);

      // Mostrar preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Subir avatar al endpoint específico de perfil
      const response = await mediaService.uploadAvatar(file);
      
      // El backend retorna { user, url }
      const avatarUrl = response.url || response.user?.avatarUrl;
      setPreviewUrl(avatarUrl);
      onUploadSuccess?.(avatarUrl);

      // Resetear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
      setPreviewUrl(currentAvatar || null);
    } finally {
      setIsUploading(false);
    }
  };

  const initials = user?.username?.charAt(0).toUpperCase() || '?';

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Avatar Preview */}
      <div className="relative group">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-blue-500">
            <span className="text-5xl font-bold text-white">{initials}</span>
          </div>
        )}

        {/* Upload Overlay */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <span className="text-white text-sm font-medium">
              {isUploading ? 'Cargando...' : 'Cambiar'}
            </span>
          </div>
        </button>

        {/* Loading Spinner */}
        {isUploading && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-300 border-t-blue-500"></div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
        aria-label="Seleccionar foto de perfil"
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg max-w-sm text-center text-sm">
          {error}
        </div>
      )}

      {/* Info Text */}
      <p className="text-neutral-600 dark:text-neutral-400 text-center text-sm max-w-sm">
        Haz clic en la foto para cambiarla. Acepta PNG, JPG, WebP (máximo 10 MB)
      </p>
    </div>
  );
}
