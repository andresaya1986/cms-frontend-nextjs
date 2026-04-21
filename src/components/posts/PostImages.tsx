'use client';

import { useState, useEffect, useRef } from 'react';
import postsService from '@/services/postsService';

interface PostImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  originalName: string;
  width: number;
  height: number;
}

interface PostImagesProps {
  postId: string;
}

export function PostImages({ postId }: PostImagesProps) {
  const [images, setImages] = useState<PostImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Si ya cargó, no cargar de nuevo
    if (hasLoadedRef.current) {
      return;
    }

    const loadImages = async () => {
      try {
        // Cancelar request anterior si existe
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        setIsLoading(true);

        const fetchedImages = await postsService.getPostImages(postId);
        setImages(Array.isArray(fetchedImages) ? fetchedImages : []);
        hasLoadedRef.current = true;
      } catch (err) {
        // Solo loguear si no es un abort
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error cargando imágenes:', err);
        }
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [postId]);

  // Si no hay imágenes o está cargando, no mostrar nada
  if (isLoading || images.length === 0) {
    return null;
  }

  const currentImage = images[currentImageIndex];

  // Una sola imagen
  if (images.length === 1) {
    return (
      <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800/50">
        <img
          src={currentImage.url}
          alt={currentImage.originalName}
          className="w-full rounded-lg object-cover max-h-96"
        />
      </div>
    );
  }

  // Múltiples imágenes con carrusel
  return (
    <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800/50">
      {/* Imagen principal */}
      <div className="relative">
        <img
          src={currentImage.url}
          alt={currentImage.originalName}
          className="w-full rounded-lg object-cover max-h-96"
        />

        {/* Controles de navegación */}
        {images.length > 1 && (
          <>
            {/* Botón anterior */}
            <button
              onClick={() =>
                setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Imagen anterior"
            >
              ‹
            </button>

            {/* Botón siguiente */}
            <button
              onClick={() =>
                setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Siguiente imagen"
            >
              ›
            </button>

            {/* Indicador de página */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentImageIndex(idx)}
              className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentImageIndex
                  ? 'border-primary-500'
                  : 'border-neutral-300 dark:border-neutral-600 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.thumbnailUrl}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
