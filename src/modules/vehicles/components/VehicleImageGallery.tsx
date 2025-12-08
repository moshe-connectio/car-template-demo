'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { VehicleImage } from '@modules/vehicles/lib/repository';

interface VehicleImageGalleryProps {
  images: VehicleImage[] | null;
  vehicleTitle: string;
  disableThumbnailClick?: boolean;
  onImageChange?: (index: number) => void;
  selectedIndex?: number;
  imageHeight?: string; // Tailwind height class (e.g., 'h-52', 'h-96')
}

export default function VehicleImageGallery({
  images,
  vehicleTitle,
  disableThumbnailClick = false,
  onImageChange,
  selectedIndex = 0,
  imageHeight = 'h-52',
}: VehicleImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(selectedIndex);

  // Sync internal state with prop when prop changes
  useEffect(() => {
    setSelectedImageIndex(selectedIndex);
  }, [selectedIndex]);

  // Sort images by position
  const sortedImages = images
    ? [...images].sort((a, b) => a.position - b.position)
    : [];

  // If no images, show placeholder grid
  if (sortedImages.length === 0) {
    return (
      <div className="w-full">
        {/* Main Placeholder */}
        <div className="w-full h-52 bg-gray-200 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Placeholder Thumbnails */}
        <div className="flex gap-1 overflow-x-auto">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="w-14 h-14 bg-gray-200 rounded shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  // Get the selected image to display (not just the primary)
  const displayedImage = sortedImages[selectedImageIndex];

  return (
    <div className="w-full">
      {/* Main Image Display */}
      <div className={`relative w-full ${imageHeight} bg-gray-100 rounded-lg overflow-hidden mb-2 p-3`}>
        <Image
          src={displayedImage.image_url}
          alt={displayedImage.alt_text || vehicleTitle}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
          onError={() => {
            // Fallback: if Next.js Image fails, show a regular img tag
            console.warn(`Failed to load image: ${displayedImage.image_url}`);
          }}
        />
        {/* Image Counter */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
          {selectedImageIndex + 1} / {sortedImages.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {sortedImages.length > 1 && (
        <div className="flex gap-1 overflow-x-auto">
          {/* All images as thumbnails */}
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={(e) => {
                e.stopPropagation();
                if (!disableThumbnailClick) {
                  setSelectedImageIndex(index);
                  onImageChange?.(index);
                }
              }}
              className={`relative w-14 h-14 rounded overflow-hidden shrink-0 transition-all duration-200 border-2 ${
                selectedImageIndex === index
                  ? 'border-primary ring-2 ring-primary/50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              aria-label={`View image ${index + 1}${image.alt_text ? ': ' + image.alt_text : ''}`}
            >
              <Image
                src={image.image_url}
                alt={`Thumbnail ${image.alt_text || `image ${index + 1}`}`}
                fill
                className="object-cover"
                unoptimized
                sizes="56px"
              />
              <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-xs rounded px-0.5">
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
