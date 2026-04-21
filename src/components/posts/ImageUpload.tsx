'use client';

import { useState, useRef } from 'react';
import mediaService from '@/services/mediaService';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string, imageData?: any) => void;
  label?: string;
}

export function ImageUpload({ onImageSelect, label = 'Seleccionar imagen destacada' }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 50MB según la guía)
    if (file.size > 50 * 1024 * 1024) {
      setError('La imagen no puede ser mayor a 50 MB');
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      setProgress(0);

      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 30, 90));
      }, 300);

      // Subir archivo
      const media = await mediaService.upload(file);
      clearInterval(progressInterval);
      setProgress(100);

      // Usar URL optimizada
      const imageUrl = media.url;
      onImageSelect(imageUrl, media);

      // Resetear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => {
        setProgress(0);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Cargando... {progress}%
          </>
        ) : (
          <>
            <span>📸</span>
            {label}
          </>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
        aria-label="Seleccionar imagen"
      />

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
