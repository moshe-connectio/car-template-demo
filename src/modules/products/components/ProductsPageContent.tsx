'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductFilters } from './ProductFilters';
import type { FilterOptions } from './ProductFilters';
import { formatPrice } from '@shared/utils/formatting';
import { smartSearch } from '@shared/utils/search';
import type { ProductWithCategory } from '../types';
import { useCart } from '@shared/store/cart';

interface ProductsPageContentProps {
  initialProducts: (ProductWithCategory & { images?: any[] })[];
  allCategories: Array<{ id: string; name: string; slug: string }>;
}

export function ProductsPageContent({ initialProducts = [], allCategories = [] }: ProductsPageContentProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    mainCategorySlug: '',
    categorySlug: '',
    selectedTags: [],
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'newest',
  });

  // Extract all available tags from products, respecting selected category
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    const activeCat = filters.categorySlug || filters.mainCategorySlug;
    const source = activeCat
      ? initialProducts.filter(p => p.category?.slug === activeCat)
      : initialProducts;

    source.forEach(p => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach(tag => tags.add(tag));
      }
    });

    return Array.from(tags).sort();
  }, [initialProducts, filters.mainCategorySlug, filters.categorySlug]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...(initialProducts || [])];

    // Category filter (main or dropdown) - apply BEFORE search
    const activeCat = filters.categorySlug || filters.mainCategorySlug;
    if (activeCat) {
      result = result.filter((p) => p.category?.slug === activeCat);
    }

    // Tags filter
    if (filters.selectedTags.length > 0) {
      result = result.filter((p) => {
        if (!p.tags || !Array.isArray(p.tags)) return false;
        return filters.selectedTags.some((selectedTag: string) => (p.tags as string[]).includes(selectedTag));
      });
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // Smart text search - search in multiple fields including keywords
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((p) => {
        // Simple search in all text fields including search_keywords
        const searchableText = [
          p.name,
          p.short_description,
          p.description,
          p.search_keywords,
          ...(p.tags || [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        
        return searchableText.includes(query);
      });
    }

    // Sorting (skip if search is active - already sorted by relevance)
    if (!filters.searchQuery) {
      switch (filters.sortBy) {
        case 'price-low':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'price-high':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'popular':
          result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
          break;
        case 'newest':
        default:
          result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      }
    }

    return result;
  }, [initialProducts, filters]);

  return (
    <>
      {/* Filters */}
      <ProductFilters
        categories={allCategories}
        availableTags={availableTags}
        onFiltersChange={setFilters}
        maxPrice={10000}
      />

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {filteredProducts.map((product) => (
            <ProductCardSimple key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">לא נמצאו מוצרים התואמים את הסינונים</p>
          <button
            onClick={() => setFilters({
              searchQuery: '',
              mainCategorySlug: '',
              categorySlug: '',
              selectedTags: [],
              minPrice: 0,
              maxPrice: 10000,
              sortBy: 'newest'
            })}
            className="text-primary hover:text-blue-700 font-medium"
          >
            נקה סינונים
          </button>
        </div>
      )}
    </>
  );
}

// Simplified product card for grid
function ProductCardSimple({ product }: { product: ProductWithCategory & { images?: any[] } }) {
  const [isAdded, setIsAdded] = useState(false);
  const [quantity] = useState(1);
  const addItem = useCart((state) => state.addItem);

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
        {product.images && product.images.length > 0 && (
          <Image
            src={product.images[0].image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {product.compare_at_price && product.compare_at_price > product.price && (
          <span className="absolute top-2 left-2 bg-error text-white text-xs font-bold px-2 py-1 rounded">
            -{Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="px-3 pt-3 pb-2 md:px-4 md:pt-4 md:pb-3 flex flex-col gap-1.5 md:gap-2">
        <div className="flex flex-col gap-1 md:gap-1.5">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors text-sm md:text-base">
              {product.name}
            </h3>
          </Link>

          {product.short_description && (
            <p className="text-xs md:text-sm text-gray-600 mb-1.5 md:mb-2 line-clamp-1">
              {product.short_description}
            </p>
          )}

          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-base md:text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-xs md:text-sm text-gray-500 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            addItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              quantity,
              imageUrl: product.images?.[0]?.image_url,
            });
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
    </div>
  );
}
