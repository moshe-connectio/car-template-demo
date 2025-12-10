/**
 * POST /api/new-vehicles/models
 * Add a new model
 */

import { createServerSupabaseClient } from '@core/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      manufacturer_id,
      name,
      slug,
      description,
      image_url,
      body_type,
      segment,
      year_from,
      year_to,
      base_price,
      display_order,
    } = body;

    // Validation
    if (!manufacturer_id || !name || !slug) {
      return Response.json(
        { error: 'manufacturer_id, name, and slug are required' },
        { status: 400 }
      );
    }

    const client = createServerSupabaseClient();

    // Insert model
    const { data, error } = await client
      .from('new_vehicles_models')
      .insert([
        {
          manufacturer_id,
          name,
          slug,
          description: description || null,
          image_url: image_url || null,
          body_type: body_type || null,
          segment: segment || null,
          year_from: year_from || null,
          year_to: year_to || null,
          base_price: base_price || null,
          display_order: display_order || 0,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding model:', error);
      return Response.json(
        { error: error.message || 'Failed to add model' },
        { status: 400 }
      );
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/new-vehicles/models?manufacturer_id=xxx
 * Get models by manufacturer
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const manufacturer_id = searchParams.get('manufacturer_id');

    const client = createServerSupabaseClient();

    let query = client.from('models_with_manufacturer').select('*');

    if (manufacturer_id) {
      query = query.eq('manufacturer_id', manufacturer_id);
    }

    const { data, error } = await query
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching models:', error);
    return Response.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
