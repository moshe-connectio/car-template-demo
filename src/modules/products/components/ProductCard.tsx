'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ProductWithCategory, ProductImage } from '../types';
import { formatPrice } from '@shared/utils/formatting';
import { useCart } from '@shared/store/cart';

type ProductCardProps = {
  product: ProductWithCategory;
  images?: ProductImage[];
};

export function ProductCard({ product, images = [] }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((state) => state.addItem);
  
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  const currentImage = images[currentImageIndex];
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {currentImage ? (
          <>
            <img
              src={currentImage.image_url}
              alt={currentImage.alt_text || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            
            {/* Navigation Arrows - Show on hover if multiple images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="תמונה קודמת"
                >
                  <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="תמונה הבאה"
                >
                  <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Dots Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'bg-white w-4' 
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                      aria-label={`תמונה ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.is_featured && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
              מומלץ
            </span>
          )}
          {hasDiscount && (
            <span className="bg-error text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
              אזל מהמלאי
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pt-3 pb-2 md:px-4 md:pt-4 md:pb-3 flex flex-col gap-1.5 md:gap-2">
        <div className="flex flex-col gap-1 md:gap-1.5">
          {/* Category */}
          {product.category && (
            <p className="text-[11px] md:text-xs text-gray-500 mb-1">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-primary transition-colors text-sm md:text-base">
            {product.name}
          </h3>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-xs md:text-sm text-gray-600 mb-1.5 md:mb-2 line-clamp-2">
              {product.short_description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-base md:text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs md:text-sm text-gray-500 line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock > 0 && product.stock < 10 && (
            <p className="text-[11px] md:text-xs text-warning">
              נותרו {product.stock} במלאי
            </p>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
              disabled={quantity === 1}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-bold transition-colors"
              aria-label="הקטן כמות"
            >
              −
            </button>
            <span className="px-3 py-1 font-bold text-center flex-1 bg-gray-50 rounded text-sm md:text-base">
              {quantity}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuantity(Math.min(product.stock, quantity + 1));
              }}
              disabled={quantity >= product.stock}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-bold transition-colors"
              aria-label="הגדל כמות"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              quantity,
              imageUrl: images[0]?.image_url,
            });
            setQuantity(1);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
          }}
          disabled={product.stock === 0}
          className={`w-full mt-1 font-bold py-2 px-3 rounded transition-all duration-200 text-sm ${
            isAdded
              ? 'bg-success text-white'
              : product.stock > 0
              ? 'bg-primary hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAdded ? '✓ נוסף!' : product.stock > 0 ? 'הוסף לעגלה' : 'אזל'}
        </button>
      </div>
    </Link>
  );
}
