import { Suspense } from 'react';
import { Header } from '@shared/components/layout/Header';
import { Footer } from '@shared/components/layout/Footer';
import { Container } from '@shared/components/layout/Container';
import { getPublishedProducts, getCategories } from '@modules/products/lib/repository';
import { ProductsPageContent } from '@modules/products/components/ProductsPageContent';
import { createServerSupabaseClient } from '@core/lib/supabase';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getCategories(),
  ]);

  // Fetch all images for all products
  const client = createServerSupabaseClient();
  const productIds = products.map(p => p.id);
  
  const { data: allImages } = await client
    .from('product_images')
    .select('*')
    .in('product_id', productIds)
    .order('position', { ascending: true });

  // Group images by product
  const imagesByProduct = (allImages || []).reduce((acc: any, img: any) => {
    if (!acc[img.product_id]) {
      acc[img.product_id] = [];
    }
    acc[img.product_id].push(img);
    return acc;
  }, {});

  // Add images to products
  const productsWithImages = products.map(p => ({
    ...p,
    images: imagesByProduct[p.id] || []
  }));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <Container className="py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              כל המוצרים
            </h1>
            <p className="text-gray-600">
              {productsWithImages.length} מוצרים זמינים
            </p>
          </div>

          <Suspense fallback={<div>טוען מוצרים...</div>}>
            <ProductsPageContent
              initialProducts={productsWithImages as any}
              allCategories={categories}
            />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  );
}
