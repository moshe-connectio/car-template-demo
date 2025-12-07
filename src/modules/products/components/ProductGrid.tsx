import { createServerSupabaseClient } from '@core/lib/supabase';
import type { ProductWithCategory, ProductImage } from '../types';
import { ProductCard } from './ProductCard';

type ProductGridProps = {
  products: ProductWithCategory[];
  emptyMessage?: string;
};

export async function ProductGrid({ 
  products, 
  emptyMessage = 'לא נמצאו מוצרים' 
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
        <p className="mt-1 text-sm text-gray-500">נסה לחפש משהו אחר או לבדוק שוב מאוחר יותר</p>
      </div>
    );
  }

  // Fetch all images for all products
  const client = createServerSupabaseClient();
  const productIds = products.map(p => p.id);
  
  const { data: allImages } = await client
    .from('product_images')
    .select('*')
    .in('product_id', productIds)
    .order('position', { ascending: true });

  // Group images by product
  const imagesByProduct = (allImages || []).reduce((acc, img) => {
    if (!acc[img.product_id]) {
      acc[img.product_id] = [];
    }
    acc[img.product_id].push(img as ProductImage);
    return acc;
  }, {} as Record<string, ProductImage[]>);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          images={imagesByProduct[product.id] || []}
        />
      ))}
    </div>
  );
}
