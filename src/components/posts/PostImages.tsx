'use client';

import { useState } from 'react';
import { PostMedia } from '@/types';

interface PostImagesProps {
  featuredImage?: string | null;
  media?: PostMedia[];
}

export function PostImages({ featuredImage, media = [] }: PostImagesProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Combinar featuredImage + media en un único array
  const allImages = [];
  
  // Agregar featuredImage como primera imagen si existe
  if (featuredImage) {
    allImages.push({
      id: 'featured',
      url: featuredImage,
      thumbnailUrl: featuredImage,
      originalName: 'Imagen principal',
      order: -1,
    });
  }
  
  // Agregar imágenes del media ordenadas
  if (media && media.length > 0) {
    const sortedMedia = [...media].sort((a, b) => (a.order || 0) - (b.order || 0));
    sortedMedia.forEach((item) => {
      if (item.media) {
        allImages.push({
          id: item.media.id,
          url: item.media.url,
          thumbnailUrl: item.media.thumbnailUrl,
          originalName: item.media.originalName,
          order: item.order,
        });
      }
    });
  }

  // Si no hay imágenes, no mostrar nada
  if (allImages.length === 0) {
    return null;
  }

  const currentImage = allImages[currentImageIndex];

  // Una sola imagen
  if (allImages.length === 1) {
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
        {allImages.length > 1 && (
          <>
            {/* Botón anterior */}
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? allImages.length - 1 : prev - 1
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Imagen anterior"
            >
              ‹
            </button>

            {/* Botón siguiente */}
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === allImages.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Siguiente imagen"
            >
              ›
            </button>

            {/* Indicador de página */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {allImages.map((image, idx) => (
            <button
              key={image.id}
              onClick={() => setCurrentImageIndex(idx)}
              className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentImageIndex
                  ? 'border-primary-500'
                  : 'border-neutral-300 dark:border-neutral-600 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image.thumbnailUrl}
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
