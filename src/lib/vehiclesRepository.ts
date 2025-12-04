import { createServerSupabaseClient } from './supabaseServerClient';

export type Vehicle = {
  id: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  external_id: string | null;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number | null;
  gear_type: string | null;
  fuel_type: string | null;
  main_image_url: string | null;
  short_description: string | null;
  raw_data: Record<string, unknown> | null;
};

export async function getPublishedVehicles(): Promise<Vehicle[]> {
  try {
    const client = createServerSupabaseClient();

    const { data, error } = await client
      .from('vehicles')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching published vehicles:', error);
      throw new Error(`Failed to fetch vehicles: ${error.message}`);
    }

    return data ?? [];
  } catch (err) {
    console.error('Unexpected error in getPublishedVehicles:', err);
    throw err;
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  try {
    const client = createServerSupabaseClient();

    const { data, error } = await client
      .from('vehicles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching vehicle by slug:', error);
      throw new Error(`Failed to fetch vehicle: ${error.message}`);
    }

    return data ?? null;
  } catch (err) {
    console.error('Unexpected error in getVehicleBySlug:', err);
    throw err;
  }
}
