/**
 * Products Repository
 * Data access layer for products, categories, and images
 */

import { createServerSupabaseClient } from '@core/lib/supabase';
import type { 
  Product, 
  ProductWithImages, 
  ProductWithCategory,
  Category, 
  ProductImage 
} from '../types';

/**
 * Get all published products with their primary image and category
 */
export async function getPublishedProducts(): Promise<ProductWithCategory[]> {
  console.log('🔍 Fetching published products...');
  
  const client = createServerSupabaseClient();
  
  const { data, error } = await client
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }

  console.log(`✅ Successfully fetched ${data?.length || 0} products`);
  return data || [];
}

/**
 * Get a single product by slug with all images
 */
export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  console.log(`🔍 Fetching product by slug: ${slug}`);
  
  const client = createServerSupabaseClient();
  
  const { data, error } = await client
    .from('products')
    .select(`
      *,
      images:product_images(*),
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.log('⚠️ Product not found');
      return null;
    }
    console.error('❌ Error fetching product:', error);
    throw error;
  }

  // Sort images by position
  if (data?.images) {
    data.images.sort((a: ProductImage, b: ProductImage) => a.position - b.position);
  }

  console.log(`✅ Successfully fetched product: ${data?.name}`);
  return data;
}

/**
 * Get all active categories with subcategories
 */
export async function getCategories(): Promise<Category[]> {
  console.log('🔍 Fetching categories...');
  
  const client = createServerSupabaseClient();
  
  const { data, error } = await client
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }

  console.log(`✅ Successfully fetched ${data?.length || 0} categories`);
  return data || [];
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(categorySlug: string): Promise<ProductWithCategory[]> {
  console.log(`🔍 Fetching products for category: ${categorySlug}`);
  
  const client = createServerSupabaseClient();
  
  // First get the category
  const { data: category } = await client
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .eq('is_active', true)
    .single();

  if (!category) {
    console.log('⚠️ Category not found');
    return [];
  }

  // Then get products
  const { data, error } = await client
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching products by category:', error);
    throw error;
  }

  console.log(`✅ Successfully fetched ${data?.length || 0} products`);
  return data || [];
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 6): Promise<ProductWithCategory[]> {
  console.log(`🔍 Fetching ${limit} featured products...`);
  
  const client = createServerSupabaseClient();
  
  const { data, error } = await client
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('❌ Error fetching featured products:', error);
    throw error;
  }

  console.log(`✅ Successfully fetched ${data?.length || 0} featured products`);
  return data || [];
}

/**
 * Get primary image for a product
 */
export async function getProductPrimaryImage(productId: string): Promise<ProductImage | null> {
  const client = createServerSupabaseClient();
  
  const { data, error } = await client
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .eq('is_primary', true)
    .single();

  if (error) {
    // If no primary image, get first image by position
    const { data: firstImage } = await client
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('position', { ascending: true })
      .limit(1)
      .single();
    
    return firstImage || null;
  }

  return data;
}
