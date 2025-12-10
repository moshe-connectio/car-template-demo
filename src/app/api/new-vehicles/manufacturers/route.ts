/**
 * POST /api/new-vehicles/manufacturers
 * Add a new manufacturer
 */

import { createServerSupabaseClient } from '@core/lib/supabase';
import type { Manufacturer } from '@modules/new-vehicles/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, logo_url, banner_url, description, country, website_url, display_order } = body;

    // Validation
    if (!name || !slug) {
      return Response.json(
        { error: 'name and slug are required' },
        { status: 400 }
      );
    }

    const client = createServerSupabaseClient();

    // Insert manufacturer
    const { data, error } = await client
      .from('new_vehicles_manufacturers')
      .insert([
        {
          name,
          slug,
          logo_url: logo_url || null,
          banner_url: banner_url || null,
          description: description || null,
          country: country || null,
          website_url: website_url || null,
          display_order: display_order || 0,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding manufacturer:', error);
      return Response.json(
        { error: error.message || 'Failed to add manufacturer' },
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
 * GET /api/new-vehicles/manufacturers
 * Get all manufacturers
 */
export async function GET(request: Request) {
  try {
    const client = createServerSupabaseClient();

    const { data, error } = await client
      .from('manufacturers_with_counts')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    return Response.json(
      { error: 'Failed to fetch manufacturers' },
      { status: 500 }
    );
  }
}
