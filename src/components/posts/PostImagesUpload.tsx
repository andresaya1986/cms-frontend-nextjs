'use client';

import { useState, useRef, useEffect } from 'react';
import postsService from '@/services/postsService';

interface PostImage {
  id: string;
  uploaderId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string;
  bucket: string;
  key: string;
  width: number;
  height: number;
  altText?: string;
  caption?: string;
  createdAt: string;
}

interface PostImagesUploadProps {
  postId: string;
  onImagesUploaded?: (images: PostImage[]) => void;
  label?: string;
}

export function PostImagesUpload({ postId, onImagesUploaded, label = 'Agregar imágenes al post' }: PostImagesUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<PostImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar imágenes al montar el componente (una sola vez)
  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        const images = await postsService.getPostImages(postId);
        setUploadedImages(images);
      } catch (err) {
        console.error('Error cargando imágenes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [postId]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validar cantidad de archivos
    if (fileArray.length > 10) {
      setError('Máximo 10 imágenes por request');
      return;
    }

    // Validar cada archivo
    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} no es una imagen válida`);
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError(`${file.name} excede el límite de 50 MB`);
        return;
      }
    }

    try {
      setError(null);
      setIsUploading(true);
      setProgress(0);

      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 15, 85));
      }, 300);

      // Subir archivos
      const uploadedFiles = await postsService.uploadPostImages(postId, fileArray);
      clearInterval(progressInterval);
      setProgress(100);

      // Actualizar lista de imágenes
      setUploadedImages((prev) => [...prev, ...uploadedFiles]);
      onImagesUploaded?.(uploadedFiles);

      // Resetear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => {
        setProgress(0);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir las imágenes');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta imagen?')) return;

    try {
      setError(null);
      await postsService.deletePostImage(postId, imageId);
      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la imagen');
    }
  };

  return (
    <div className="space-y-4">
      {/* Botón de carga */}
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
        multiple
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
        aria-label="Seleccionar imágenes"
      />

      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Barra de progreso */}
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Galería de imágenes */}
      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
            Imágenes del Post ({uploadedImages.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
              >
                {/* Imagen */}
                <img
                  src={image.thumbnailUrl}
                  alt={image.originalName}
                  className="w-full h-32 object-cover group-hover:opacity-75 transition-opacity"
                />

                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                    title="Abrir en nueva pestaña"
                  >
                    <span className="text-lg">🔗</span>
                  </a>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                    title="Eliminar imagen"
                  >
                    <span className="text-lg">🗑️</span>
                  </button>
                </div>

                {/* Información */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="truncate font-semibold">{image.originalName}</p>
                  <p className="text-gray-300">{image.width}x{image.height}px</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay imágenes */}
      {uploadedImages.length === 0 && !isLoading && (
        <div className="text-center py-6 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600">
          <p className="text-neutral-600 dark:text-neutral-400">No hay imágenes aún</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            Máx 10 imágenes, 50 MB cada una (JPG, PNG, WebP, GIF)
          </p>
        </div>
      )}
    </div>
  );
}
