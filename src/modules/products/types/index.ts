/**
 * Product Module Types
 * Types matching the Supabase database schema
 */

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  crmid: string | null;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  sku: string | null;
  stock: number;
  weight: number | null;
  dimensions: string | null;
  brand: string | null;
  tags: string[] | null;
  search_keywords: string | null; // כמו: "כסא, כיסא, כסאות, כיסאות"
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  position: number;
  is_primary: boolean;
  created_at: string;
};

export type ProductWithImages = Product & {
  images: ProductImage[];
  category?: Category | null;
};

export type ProductWithCategory = Product & {
  category: Category | null;
};
