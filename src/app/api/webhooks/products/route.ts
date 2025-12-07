import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@core/lib/supabase';

/**
 * Webhook API for creating/updating products
 * POST /api/webhooks/products
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📦 Received product webhook:', JSON.stringify(body, null, 2));

    // Support both direct fields and nested data object
    const data = body.data || body;
    const { crmid } = body;

    // Validate required fields
    const name = data.name;
    const slug = data.slug;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug' },
        { status: 400 }
      );
    }

    const client = createServerSupabaseClient();

    // Handle category
    let categoryId = null;
    if (data.category_slug) {
      const { data: category } = await client
        .from('categories')
        .select('id')
        .eq('slug', data.category_slug)
        .single();
      
      if (category) {
        categoryId = category.id;
      }
    }

    // Get images from data or direct field
    const images = data.images || [];

    // Prepare product data
    const productData = {
      crmid: crmid || null,
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      short_description: data.short_description || null,
      price: data.price,
      compare_at_price: data.compare_at_price || null,
      category_id: categoryId,
      sku: data.sku || null,
      stock: data.stock ?? 0,
      weight: data.weight || null,
      dimensions: data.dimensions || null,
      brand: data.brand || null,
      tags: data.tags || null,
      meta_title: data.meta_title || data.name,
      meta_description: data.meta_description || data.short_description,
      is_published: data.is_published ?? true,
      is_featured: data.is_featured ?? false,
      updated_at: new Date().toISOString(),
    };

    console.log('💾 Upserting product:', productData.name);

    // Check if product exists (by crmid or slug)
    let existingProduct = null;
    if (crmid) {
      const { data: existing } = await client
        .from('products')
        .select('id')
        .eq('crmid', crmid)
        .single();
      existingProduct = existing;
    }

    if (!existingProduct) {
      const { data: existing } = await client
        .from('products')
        .select('id')
        .eq('slug', data.slug)
        .single();
      existingProduct = existing;
    }

    let productId: string;

    if (existingProduct) {
      // Update existing product
      console.log('📝 Updating existing product');
      const { data: updated, error } = await client
        .from('products')
        .update(productData)
        .eq('id', existingProduct.id)
        .select()
        .single();

      if (error) throw error;
      productId = updated.id;

      // Delete old images if updating
      if (images && images.length > 0) {
        await client
          .from('product_images')
          .delete()
          .eq('product_id', productId);
      }
    } else {
      // Create new product
      console.log('✨ Creating new product');
      const { data: created, error } = await client
        .from('products')
        .insert({
          ...productData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      productId = created.id;
    }

    // Handle images
    if (images && images.length > 0) {
      console.log(`🖼️ Processing ${images.length} images...`);

      const imageInserts = images.map((img: any, index: number) => ({
        product_id: productId,
        image_url: img.image_url,
        alt_text: img.alt_text || data.name,
        position: img.position ?? index + 1,
        is_primary: img.is_primary ?? (index === 0),
      }));

      const { error: imagesError } = await client
        .from('product_images')
        .insert(imageInserts);

      if (imagesError) {
        console.error('❌ Error inserting images:', imagesError);
        // Continue anyway - product was created
      } else {
        console.log('✅ Images inserted successfully');
      }
    }

    console.log('✅ Product webhook completed successfully');

    return NextResponse.json({
      success: true,
      productId,
      message: existingProduct ? 'Product updated' : 'Product created',
    });

  } catch (error) {
    console.error('❌ Product webhook error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
