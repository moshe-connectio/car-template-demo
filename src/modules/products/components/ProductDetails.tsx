'use client';

import { useState } from 'react';
import type { ProductWithImages } from '@modules/products/types';
import { formatPrice } from '@shared/utils/formatting';
import { useCart } from '@shared/store/cart';
import { FaPlus, FaMinus } from 'react-icons/fa';

type ProductDetailsProps = {
  product: ProductWithImages;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Category */}
      {product.category && (
        <div>
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
            {product.category.name}
          </span>
        </div>
      )}

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        {product.brand && (
          <p className="text-lg text-gray-600">
            מותג: <span className="font-semibold">{product.brand}</span>
          </p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
              <span className="bg-error text-white px-3 py-1 rounded-full text-sm font-bold">
                -{discountPercentage}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Short Description */}
      {product.short_description && (
        <p className="text-lg text-gray-600 leading-relaxed">
          {product.short_description}
        </p>
      )}

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {product.stock > 0 ? (
          <>
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              במלאי ({product.stock} יחידות)
            </span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-sm font-medium text-error">
              אזל מהמלאי
            </span>
          </>
        )}
      </div>

      {/* Add to Cart Button */}
      <div className="space-y-3">
        {/* Quantity Selector */}
        <div className="flex items-center border border-gray-300 rounded-lg w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity === 1}
            className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="הקטן כמות"
          >
            <FaMinus className="w-4 h-4" />
          </button>
          <span className="px-6 py-2 font-bold text-center min-w-16 text-lg">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={quantity >= product.stock}
            className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="הגדל כמות"
          >
            <FaPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={product.stock === 0}
          onClick={() => {
            addItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              quantity,
              imageUrl: product.images?.[0]?.image_url,
            });
            setQuantity(1);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
          }}
          className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-200 ${
            isAdded
              ? 'bg-success text-white'
              : product.stock > 0
              ? 'bg-primary hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAdded ? '✓ נוסף לעגלה!' : product.stock > 0 ? 'הוסף לעגלה' : 'אזל מהמלאי'}
        </button>
      </div>

      {/* Full Description */}
      {product.description && (
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            תיאור המוצר
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </div>
      )}

      {/* Specifications */}
      {(product.sku || product.weight || product.dimensions) && (
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            מפרטים
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {product.sku && (
              <div>
                <p className="text-sm text-gray-600">מק"ט</p>
                <p className="text-lg font-medium text-gray-900">{product.sku}</p>
              </div>
            )}
            {product.weight && (
              <div>
                <p className="text-sm text-gray-600">משקל</p>
                <p className="text-lg font-medium text-gray-900">{product.weight} ק"ג</p>
              </div>
            )}
            {product.dimensions && (
              <div>
                <p className="text-sm text-gray-600">מידות</p>
                <p className="text-lg font-medium text-gray-900">{product.dimensions}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="border-t pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase">
            תגיות
          </h2>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
