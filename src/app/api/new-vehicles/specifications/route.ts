/**
 * POST /api/new-vehicles/specifications
 * Add specification to a trim level
 */

import { createServerSupabaseClient } from '@core/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trim_id, spec_key, spec_value, category, display_order } = body;

    // Validation
    if (!trim_id || !spec_key || !spec_value) {
      return Response.json(
        { error: 'trim_id, spec_key, and spec_value are required' },
        { status: 400 }
      );
    }

    const client = createServerSupabaseClient();

    // Insert specification
    const { data, error } = await client
      .from('new_vehicles_specifications')
      .insert([
        {
          trim_id,
          spec_key,
          spec_value,
          category: category || null,
          display_order: display_order || 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding specification:', error);
      return Response.json(
        { error: error.message || 'Failed to add specification' },
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
 * GET /api/new-vehicles/specifications?trim_id=xxx&category=xxx
 * Get specifications by trim level
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trim_id = searchParams.get('trim_id');
    const category = searchParams.get('category');

    const client = createServerSupabaseClient();

    let query = client.from('new_vehicles_specifications').select('*');

    if (trim_id) {
      query = query.eq('trim_id', trim_id);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching specifications:', error);
    return Response.json(
      { error: 'Failed to fetch specifications' },
      { status: 500 }
    );
  }
}
