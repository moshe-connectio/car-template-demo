import { createServerSupabaseClient } from './supabaseServerClient';

export type Vehicle = {
  id: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  external_id: string | null;
  crmid: string | null;
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
    console.log('🔍 Creating Supabase client...');
    const client = createServerSupabaseClient();
    console.log('✅ Client created');

    console.log('🔍 Fetching published vehicles...');
    const { data, error } = await client
      .from('vehicles')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching published vehicles:', error);
      throw new Error(`Failed to fetch vehicles: ${error.message}`);
    }

    console.log(`✅ Successfully fetched ${data?.length ?? 0} vehicles`);
    return data ?? [];
  } catch (err) {
    console.error('❌ Unexpected error in getPublishedVehicles:', err);
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

export async function getVehicleByCrmId(crmid: string): Promise<Vehicle | null> {
  try {
    console.log(`🔍 Fetching vehicle by CRM ID: ${crmid}`);
    const client = createServerSupabaseClient();

    const { data, error } = await client
      .from('vehicles')
      .select('*')
      .eq('crmid', crmid)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching vehicle by CRM ID:', error);
      throw new Error(`Failed to fetch vehicle: ${error.message}`);
    }

    if (data) {
      console.log(`✅ Found vehicle with CRM ID: ${data.id}`);
    } else {
      console.log(`ℹ️ No vehicle found with CRM ID: ${crmid}`);
    }

    return data ?? null;
  } catch (err) {
    console.error('Unexpected error in getVehicleByCrmId:', err);
    throw err;
  }
}

export type CreateVehicleInput = Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>;

export async function createVehicle(
  vehicleData: CreateVehicleInput
): Promise<Vehicle> {
  try {
    console.log('🔍 Creating new vehicle...');
    const client = createServerSupabaseClient();

    const { data, error } = await client
      .from('vehicles')
      .insert([vehicleData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating vehicle:', error);
      throw new Error(`Failed to create vehicle: ${error.message}`);
    }

    console.log('✅ Vehicle created successfully:', data?.id);
    return data;
  } catch (err) {
    console.error('❌ Unexpected error in createVehicle:', err);
    throw err;
  }
}

export type UpdateVehicleInput = Partial<Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>>;

export async function updateVehicle(
  id: string,
  vehicleData: UpdateVehicleInput
): Promise<Vehicle> {
  try {
    console.log(`🔍 Updating vehicle ${id}...`);
    const client = createServerSupabaseClient();

    const { data, error } = await client
      .from('vehicles')
      .update(vehicleData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating vehicle:', error);
      throw new Error(`Failed to update vehicle: ${error.message}`);
    }

    console.log('✅ Vehicle updated successfully:', id);
    return data;
  } catch (err) {
    console.error('❌ Unexpected error in updateVehicle:', err);
    throw err;
  }
}

export async function upsertVehicleByCrmId(
  crmid: string,
  vehicleData: CreateVehicleInput
): Promise<{ vehicle: Vehicle; action: 'created' | 'updated' }> {
  try {
    console.log(`🔄 Upserting vehicle with CRM ID: ${crmid}`);

    // Check if vehicle exists
    const existingVehicle = await getVehicleByCrmId(crmid);

    if (existingVehicle) {
      // Update existing vehicle
      console.log(`✏️ Vehicle exists, updating it...`);
      const updatedVehicle = await updateVehicle(existingVehicle.id, vehicleData);
      return { vehicle: updatedVehicle, action: 'updated' };
    } else {
      // Create new vehicle
      console.log(`📝 Vehicle does not exist, creating it...`);
      const newVehicle = await createVehicle(vehicleData);
      return { vehicle: newVehicle, action: 'created' };
    }
  } catch (err) {
    console.error('❌ Unexpected error in upsertVehicleByCrmId:', err);
    throw err;
  }
}
