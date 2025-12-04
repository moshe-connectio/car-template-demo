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
  categories: string[]; // Vehicle categories (e.g., ["SUV", "4x4", "יוקרה"], etc.)
  main_image_url: string | null;
  short_description: string | null;
  images: VehicleImage[] | null; // Array of up to 10 images
  raw_data: Record<string, unknown> | null;
};

export type VehicleImage = {
  id: string;
  vehicle_id: string;
  image_url: string;
  position: number; // 1-10, where 1 is primary image
  alt_text: string | null;
  uploaded_at: string;
};

export async function getPublishedVehicles(): Promise<Vehicle[]> {
  try {
    console.log('🔍 Creating Supabase client...');
    const client = createServerSupabaseClient();
    console.log('✅ Client created');

    console.log('🔍 Fetching vehicles (published and recently sold)...');
    // Fetch both published vehicles AND recently sold vehicles (is_published = false)
    // This allows us to show sold items with a ribbon for up to 2 days
    const response = await client
      .from('vehicles')
      .select(`
        *,
        images:vehicle_images(id, vehicle_id, image_url, position, alt_text, uploaded_at)
      `)
      .order('created_at', { ascending: false });

    let data = response.data;
    let error = response.error;

    // If the relationship doesn't exist yet, fall back to basic fetch
    if (error && error.code === 'PGRST200') {
      console.warn(
        '⚠️ vehicle_images table not found or relationship not defined, falling back to basic fetch'
      );
      const fallbackResponse = await client
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      data = fallbackResponse.data;
      error = fallbackResponse.error;
    }

    if (error) {
      console.error('❌ Error fetching vehicles:', error);
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

    // Fetch both published and recently sold vehicles (is_published = false)
    // This allows us to show sold items with a ribbon for up to 2 days
    // Get first result in case multiple vehicles have the same slug
    const response = await client
      .from('vehicles')
      .select(`
        *,
        images:vehicle_images(id, vehicle_id, image_url, position, alt_text, uploaded_at)
      `)
      .eq('slug', slug)
      .order('created_at', { ascending: false })
      .limit(1);

    let data = response.data?.[0] ?? null;
    let error = response.error;

    // If the relationship doesn't exist yet, fall back to basic fetch
    if (error && error.code === 'PGRST200') {
      console.warn(
        '⚠️ vehicle_images table not found or relationship not defined, falling back to basic fetch'
      );
      const fallbackResponse = await client
        .from('vehicles')
        .select('*')
        .eq('slug', slug)
        .order('created_at', { ascending: false })
        .limit(1);
      data = fallbackResponse.data?.[0] ?? null;
      error = fallbackResponse.error;
    }

    if (error) {
      console.error('Error fetching vehicle by slug:', error);
      throw new Error(`Failed to fetch vehicle: ${error.message}`);
    }

    return data ?? null;
  } catch (err) {
    console.error('Unexpected error in getVehicleBySlug:', err);
    throw err;
  }
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  try {
    const client = createServerSupabaseClient();

    const response = await client
      .from('vehicles')
      .select(`
        *,
        images:vehicle_images(id, vehicle_id, image_url, position, alt_text, uploaded_at)
      `)
      .eq('id', id)
      .single();

    let data = response.data;
    let error = response.error;

    // If the relationship doesn't exist yet, fall back to basic fetch
    if (error && error.code === 'PGRST200') {
      console.warn(
        '⚠️ vehicle_images table not found or relationship not defined, falling back to basic fetch'
      );
      const fallbackResponse = await client
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
      data = fallbackResponse.data;
      error = fallbackResponse.error;
    }

    if (error) {
      console.error('Error fetching vehicle by id:', error);
      throw new Error(`Failed to fetch vehicle: ${error.message}`);
    }

    return data ?? null;
  } catch (err) {
    console.error('Unexpected error in getVehicleById:', err);
    throw err;
  }
}

export async function getVehicleByIdSuffix(idSuffix: string): Promise<Vehicle | null> {
  try {
    const client = createServerSupabaseClient();

    // Fetch all vehicles and find the one whose ID ends with the suffix
    const response = await client
      .from('vehicles')
      .select(`
        *,
        images:vehicle_images(id, vehicle_id, image_url, position, alt_text, uploaded_at)
      `);

    let data = response.data;
    let error = response.error;

    // If the relationship doesn't exist yet, fall back to basic fetch
    if (error && error.code === 'PGRST200') {
      console.warn(
        '⚠️ vehicle_images table not found or relationship not defined, falling back to basic fetch'
      );
      const fallbackResponse = await client
        .from('vehicles')
        .select('*');
      data = fallbackResponse.data;
      error = fallbackResponse.error;
    }

    if (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error(`Failed to fetch vehicles: ${error.message}`);
    }

    // Find vehicle whose ID ends with the suffix
    const vehicle = data?.find((v: Vehicle) => v.id.endsWith(idSuffix));
    return vehicle ?? null;
  } catch (err) {
    console.error('Unexpected error in getVehicleByIdSuffix:', err);
    throw err;
  }
}

export async function getVehicleByCrmId(crmid: string): Promise<Vehicle | null> {
  try {
    console.log(`🔍 Fetching vehicle by CRM ID: ${crmid}`);
    const client = createServerSupabaseClient();

    const response = await client
      .from('vehicles')
      .select(`
        *,
        images:vehicle_images(id, vehicle_id, image_url, position, alt_text, uploaded_at)
      `)
      .eq('crmid', crmid)
      .single();

    let data = response.data;
    let error = response.error;

    // If the relationship doesn't exist yet, fall back to basic fetch
    if (error && error.code === 'PGRST200') {
      console.warn(
        '⚠️ vehicle_images table not found or relationship not defined, falling back to basic fetch'
      );
      const fallbackResponse = await client
        .from('vehicles')
        .select('*')
        .eq('crmid', crmid)
        .single();
      data = fallbackResponse.data;
      error = fallbackResponse.error;
    }

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
      .select(`
        *,
        images:vehicle_images(id, vehicle_id, image_url, position, alt_text, uploaded_at)
      `)
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
      .select(`
        *,
        images:vehicle_images(id, vehicle_id, image_url, position, alt_text, uploaded_at)
      `)
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

// Image Management Functions

export type AddImageInput = Omit<VehicleImage, 'id' | 'uploaded_at'>;

export async function getVehicleImages(
  vehicleId: string
): Promise<VehicleImage[]> {
  try {
    console.log(`🔍 Fetching images for vehicle ${vehicleId}`);
    const client = createServerSupabaseClient();

    const { data, error } = await client
      .from('vehicle_images')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('position', { ascending: true });

    if (error) {
      console.error('❌ Error fetching vehicle images:', error);
      throw new Error(`Failed to fetch vehicle images: ${error.message}`);
    }

    console.log(`✅ Found ${data?.length || 0} images for vehicle ${vehicleId}`);
    return data ?? [];
  } catch (err) {
    console.error('❌ Unexpected error in getVehicleImages:', err);
    throw err;
  }
}

export async function addImagesToVehicle(
  vehicleId: string,
  images: AddImageInput[]
): Promise<VehicleImage[]> {
  try {
    console.log(`🔍 Adding ${images.length} images to vehicle ${vehicleId}`);
    const client = createServerSupabaseClient();

    if (images.length === 0) {
      console.log('ℹ️ No images to add');
      return [];
    }

    // Validate positions are within 1-10 range
    for (const img of images) {
      if (img.position < 1 || img.position > 10) {
        throw new Error(`Image position must be between 1 and 10, got ${img.position}`);
      }
    }

    const { data, error } = await client
      .from('vehicle_images')
      .insert(images)
      .select();

    if (error) {
      console.error('❌ Error adding images to vehicle:', error);
      throw new Error(`Failed to add images: ${error.message}`);
    }

    console.log(`✅ Successfully added ${data?.length || 0} images to vehicle`);
    return data ?? [];
  } catch (err) {
    console.error('❌ Unexpected error in addImagesToVehicle:', err);
    throw err;
  }
}

export async function updateVehicleImage(
  imageId: string,
  updates: Partial<Omit<VehicleImage, 'id' | 'vehicle_id' | 'uploaded_at'>>
): Promise<VehicleImage> {
  try {
    console.log(`🔍 Updating image ${imageId}`);
    const client = createServerSupabaseClient();

    if (updates.position && (updates.position < 1 || updates.position > 10)) {
      throw new Error(
        `Image position must be between 1 and 10, got ${updates.position}`
      );
    }

    const { data, error } = await client
      .from('vehicle_images')
      .update(updates)
      .eq('id', imageId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating image:', error);
      throw new Error(`Failed to update image: ${error.message}`);
    }

    console.log(`✅ Image updated successfully: ${imageId}`);
    return data;
  } catch (err) {
    console.error('❌ Unexpected error in updateVehicleImage:', err);
    throw err;
  }
}

export async function deleteVehicleImage(imageId: string): Promise<void> {
  try {
    console.log(`🔍 Deleting image ${imageId}`);
    const client = createServerSupabaseClient();

    const { error } = await client
      .from('vehicle_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      console.error('❌ Error deleting image:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }

    console.log(`✅ Image deleted successfully: ${imageId}`);
  } catch (err) {
    console.error('❌ Unexpected error in deleteVehicleImage:', err);
    throw err;
  }
}

export async function reorderVehicleImages(
  vehicleId: string,
  imageOrder: { id: string; position: number }[]
): Promise<VehicleImage[]> {
  try {
    console.log(`🔍 Reordering ${imageOrder.length} images for vehicle ${vehicleId}`);
    const client = createServerSupabaseClient();

    // Validate all positions
    for (const item of imageOrder) {
      if (item.position < 1 || item.position > 10) {
        throw new Error(
          `Image position must be between 1 and 10, got ${item.position}`
        );
      }
    }

    // Update all images in parallel
    const updates = imageOrder.map((item) =>
      updateVehicleImage(item.id, { position: item.position })
    );

    const results = await Promise.all(updates);
    console.log(`✅ Successfully reordered ${results.length} images`);
    return results;
  } catch (err) {
    console.error('❌ Unexpected error in reorderVehicleImages:', err);
    throw err;
  }
}

/**
 * Delete vehicles that have been marked as sold (is_published = false)
 * and were updated more than 2 days ago
 */
export async function deleteSoldVehicles(): Promise<number> {
  try {
    console.log('🗑️ Cleaning up sold vehicles older than 2 days...');
    const client = createServerSupabaseClient();

    // Calculate the date from 2 days ago
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoISO = twoDaysAgo.toISOString();

    console.log(`🔍 Looking for vehicles marked as sold before ${twoDaysAgoISO}`);

    // Delete vehicles that are not published and were updated more than 2 days ago
    const response = await client
      .from('vehicles')
      .delete()
      .eq('is_published', false)
      .lt('updated_at', twoDaysAgoISO);

    if (response.error) {
      console.error('❌ Error deleting sold vehicles:', response.error);
      throw new Error(`Failed to delete sold vehicles: ${response.error.message}`);
    }

    const deletedCount = response.count ?? 0;
    console.log(`✅ Successfully deleted ${deletedCount} sold vehicles`);
    return deletedCount;
  } catch (err) {
    console.error('❌ Unexpected error in deleteSoldVehicles:', err);
    throw err;
  }
}

/**
 * Get unique list of vehicle brands
 */
export async function getUniqueBrands(): Promise<string[]> {
  try {
    const vehicles = await getPublishedVehicles();
    const brands = [...new Set(vehicles.map(v => v.brand).filter((b): b is string => Boolean(b)))];
    return brands.sort();
  } catch (err) {
    console.error('Error fetching unique brands:', err);
    return [];
  }
}

/**
 * Get unique list of vehicle models for a specific brand
 */
export async function getUniqueModels(brand?: string): Promise<string[]> {
  try {
    const vehicles = await getPublishedVehicles();
    const filteredVehicles = brand 
      ? vehicles.filter(v => v.brand === brand)
      : vehicles;
    const models = [...new Set(filteredVehicles.map(v => v.model).filter((m): m is string => Boolean(m)))];
    return models.sort();
  } catch (err) {
    console.error('Error fetching unique models:', err);
    return [];
  }
}

/**
 * Get unique list of vehicle categories
 */
export async function getUniqueCategories(): Promise<string[]> {
  try {
    const vehicles = await getPublishedVehicles();
    // Flatten all categories from all vehicles and get unique ones
    const allCategories = vehicles.flatMap(v => v.categories || []);
    const uniqueCategories = [...new Set(allCategories)];
    return uniqueCategories.sort();
  } catch (err) {
    console.error('Error fetching unique categories:', err);
    return [];
  }
}
