import { Header } from '@shared/components/layout/Header';
import { Footer } from '@shared/components/layout/Footer';
import { Container } from '@shared/components/layout/Container';
import { ProductImageCarousel } from '@modules/products/components/ProductImageCarousel';
import { ProductDetails } from '@modules/products/components/ProductDetails';
import { getProductBySlug, getPublishedProducts } from '@modules/products/lib/repository';
import { notFound } from 'next/navigation';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return {
      title: 'מוצר לא נמצא',
    };
  }

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.short_description,
    openGraph: {
      title: product.meta_title || product.name,
      description: product.meta_description || product.short_description,
      images: product.images && product.images.length > 0 ? [product.images[0].image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <Container className="py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <a href="/" className="hover:text-primary transition-colors">
              דף הבית
            </a>
            <span>/</span>
            <a href="/products" className="hover:text-primary transition-colors">
              מוצרים
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>

          {/* Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Images */}
            <div>
              <ProductImageCarousel 
                images={product.images || []} 
                productName={product.name}
              />
            </div>

            {/* Right: Details */}
            <div>
              <ProductDetails product={product} />
            </div>
          </div>

          {/* Related Products (optional) */}
          {product.category && (
            <div className="mt-16 border-t pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                מוצרים קשורים בקטגוריה: {product.category.name}
              </h2>
              {/* TODO: Add related products grid here */}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
