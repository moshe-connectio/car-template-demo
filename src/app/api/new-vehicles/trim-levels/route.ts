/**
 * POST /api/new-vehicles/trim-levels
 * Add a new trim level
 */

import { createServerSupabaseClient } from '@core/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      model_id,
      name,
      slug,
      description,
      price,
      transmission,
      engine_type,
      fuel_type,
      power_hp,
      torque_nm,
      acceleration_0_100,
      top_speed,
      fuel_consumption,
      co2_emissions,
      body_dimensions,
      weight,
      seats,
      doors,
      trunk_volume,
      display_order,
    } = body;

    // Validation
    if (!model_id || !name || !slug || !price) {
      return Response.json(
        { error: 'model_id, name, slug, and price are required' },
        { status: 400 }
      );
    }

    const client = createServerSupabaseClient();

    // Insert trim level
    const { data, error } = await client
      .from('new_vehicles_trim_levels')
      .insert([
        {
          model_id,
          name,
          slug,
          description: description || null,
          price,
          transmission: transmission || null,
          engine_type: engine_type || null,
          fuel_type: fuel_type || null,
          power_hp: power_hp || null,
          torque_nm: torque_nm || null,
          acceleration_0_100: acceleration_0_100 || null,
          top_speed: top_speed || null,
          fuel_consumption: fuel_consumption || null,
          co2_emissions: co2_emissions || null,
          body_dimensions: body_dimensions || null,
          weight: weight || null,
          seats: seats || null,
          doors: doors || null,
          trunk_volume: trunk_volume || null,
          display_order: display_order || 0,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding trim level:', error);
      return Response.json(
        { error: error.message || 'Failed to add trim level' },
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
 * GET /api/new-vehicles/trim-levels?model_id=xxx
 * Get trim levels by model
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const model_id = searchParams.get('model_id');

    const client = createServerSupabaseClient();

    let query = client.from('trim_levels_full_info').select('*');

    if (model_id) {
      query = query.eq('model_id', model_id);
    }

    const { data, error } = await query
      .order('display_order', { ascending: true })
      .order('price', { ascending: true });

    if (error) {
      throw error;
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching trim levels:', error);
    return Response.json(
      { error: 'Failed to fetch trim levels' },
      { status: 500 }
    );
  }
}
