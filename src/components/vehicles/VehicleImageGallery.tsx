'use client';

import { useState } from 'react';
import Image from 'next/image';
import { VehicleImage } from '@/lib/vehiclesRepository';

interface VehicleImageGalleryProps {
  images: VehicleImage[] | null;
  vehicleTitle: string;
}

export default function VehicleImageGallery({
  images,
  vehicleTitle,
}: VehicleImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Sort images by position
  const sortedImages = images
    ? [...images].sort((a, b) => a.position - b.position)
    : [];

  // If no images, show placeholder
  if (sortedImages.length === 0) {
    return (
      <div className="w-full bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  // Get the selected image to display (not just the primary)
  const displayedImage = sortedImages[selectedImageIndex];

  return (
    <div className="w-full">
      {/* Main Image Display */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
        <Image
          src={displayedImage.image_url}
          alt={displayedImage.alt_text || vehicleTitle}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
          onError={() => {
            // Fallback: if Next.js Image fails, show a regular img tag
            console.warn(`Failed to load image: ${displayedImage.image_url}`);
          }}
        />
        {/* Position Badge */}
        <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {selectedImageIndex + 1} / {sortedImages.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {/* All images as thumbnails */}
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 transition-all duration-200 border-2 ${
                selectedImageIndex === index
                  ? 'border-primary-600 ring-2 ring-primary-400'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              aria-label={`View image ${index + 1}${image.alt_text ? ': ' + image.alt_text : ''}`}
            >
              <Image
                src={image.image_url}
                alt={`Thumbnail ${image.alt_text || `image ${index + 1}`}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs rounded px-1">
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="mt-3 text-sm text-gray-600">
        Showing {sortedImages.length} image{sortedImages.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
