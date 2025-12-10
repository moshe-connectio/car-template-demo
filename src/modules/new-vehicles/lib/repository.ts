/**
 * New Vehicles Module - Repository
 * שכבת גישה לנתונים עם support ליחסים בין טבלאות
 */

import { createServerSupabaseClient } from '@core/lib/supabase';
import type {
  Manufacturer,
  ManufacturerWithCounts,
  ManufacturerWithModels,
  Model,
  ModelWithManufacturer,
  ModelWithTrimLevels,
  TrimLevel,
  TrimLevelWithSpecifications,
  TrimLevelFullInfo,
  Specification,
  SearchFilters,
  SearchResult,
} from '../types';

const client = createServerSupabaseClient();

// ============================================
// MANUFACTURERS (יצרנים)
// ============================================

/**
 * קבל את כל היצרנים הפעילים
 * שימוש ב-VIEW manufacturers_with_counts לביצועים טובים
 */
export async function getAllManufacturers(): Promise<ManufacturerWithCounts[]> {
  try {
    const { data, error } = await client
      .from('manufacturers_with_counts')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Error fetching manufacturers:', error);
    throw error;
  }
}

/**
 * קבל יצרן ספציפי לפי slug עם הדגמים שלו
 */
export async function getManufacturerBySlug(slug: string): Promise<ManufacturerWithModels | null> {
  try {
    // Get manufacturer
    const { data: manufacturerData, error: mError } = await client
      .from('new_vehicles_manufacturers')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (mError) throw mError;
    if (!manufacturerData) return null;

    // Get models for this manufacturer
    const { data: modelsData, error: moError } = await client
      .from('models_with_manufacturer')
      .select('*')
      .eq('manufacturer_id', manufacturerData.id)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (moError) throw moError;

    // Get counts
    const { data: countData } = await client
      .from('manufacturers_with_counts')
      .select('models_count, total_trim_levels')
      .eq('id', manufacturerData.id)
      .single();

    return {
      ...manufacturerData,
      models_count: countData?.models_count || 0,
      total_trim_levels: countData?.total_trim_levels || 0,
      models: modelsData || [],
    };
  } catch (error) {
    console.error(`❌ Error fetching manufacturer ${slug}:`, error);
    throw error;
  }
}

// ============================================
// MODELS (דגמים)
// ============================================

/**
 * קבל כל הדגמים של יצרן ספציפי
 */
export async function getManufacturerModels(
  manufacturerId: string
): Promise<ModelWithManufacturer[]> {
  try {
    const { data, error } = await client
      .from('models_with_manufacturer')
      .select('*')
      .eq('manufacturer_id', manufacturerId)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`❌ Error fetching models for manufacturer ${manufacturerId}:`, error);
    throw error;
  }
}

/**
 * קבל דגם ספציפי לפי slug עם רמות הגימור שלו
 */
export async function getModelBySlug(
  manufacturerSlug: string,
  modelSlug: string
): Promise<ModelWithTrimLevels | null> {
  try {
    // Get manufacturer first
    const { data: manufacturerData, error: mError } = await client
      .from('new_vehicles_manufacturers')
      .select('id')
      .eq('slug', manufacturerSlug)
      .eq('is_active', true)
      .single();

    if (mError || !manufacturerData) return null;

    // Get model
    const { data: modelData, error: moError } = await client
      .from('models_with_manufacturer')
      .select('*')
      .eq('manufacturer_id', manufacturerData.id)
      .eq('slug', modelSlug)
      .single();

    if (moError || !modelData) return null;

    // Get trim levels for this model
    const { data: trimData, error: tError } = await client
      .from('new_vehicles_trim_levels')
      .select('*')
      .eq('model_id', modelData.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('price', { ascending: true });

    if (tError) throw tError;

    return {
      ...modelData,
      trim_levels: trimData || [],
    };
  } catch (error) {
    console.error(
      `❌ Error fetching model ${manufacturerSlug}/${modelSlug}:`,
      error
    );
    throw error;
  }
}

// ============================================
// TRIM LEVELS (רמות גימור)
// ============================================

/**
 * קבל כל רמות הגימור של דגם ספציפי
 */
export async function getModelTrimLevels(modelId: string): Promise<TrimLevel[]> {
  try {
    const { data, error } = await client
      .from('new_vehicles_trim_levels')
      .select('*')
      .eq('model_id', modelId)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('price', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`❌ Error fetching trim levels for model ${modelId}:`, error);
    throw error;
  }
}

/**
 * קבל רמת גימור ספציפית עם כל הפרטים שלה
 */
export async function getTrimLevelWithSpecs(
  trimId: string
): Promise<TrimLevelWithSpecifications | null> {
  try {
    // Get trim level with full info
    const { data: trimData, error: tError } = await client
      .from('trim_levels_full_info')
      .select('*')
      .eq('id', trimId)
      .single();

    if (tError || !trimData) return null;

    // Get specifications
    const { data: specsData, error: sError } = await client
      .from('new_vehicles_specifications')
      .select('*')
      .eq('trim_id', trimId)
      .order('category', { ascending: true })
      .order('display_order', { ascending: true });

    if (sError) throw sError;

    return {
      ...trimData,
      specifications: specsData || [],
    };
  } catch (error) {
    console.error(`❌ Error fetching trim level ${trimId}:`, error);
    throw error;
  }
}

// ============================================
// SEARCH & FILTER
// ============================================

/**
 * חיפוש וסינון רכבים לפי קריטריונים שונים
 */
export async function searchVehicles(
  filters: SearchFilters,
  limit: number = 50,
  offset: number = 0
): Promise<SearchResult> {
  try {
    let manufacturersQuery = client.from('manufacturers_with_counts').select('*');
    let modelsQuery = client.from('models_with_manufacturer').select('*');
    let trimsQuery = client.from('trim_levels_full_info').select('*');

    // Apply filters
    if (filters.manufacturer_id) {
      manufacturersQuery = manufacturersQuery.eq('id', filters.manufacturer_id);
      modelsQuery = modelsQuery.eq('manufacturer_id', filters.manufacturer_id);
      trimsQuery = trimsQuery.eq('manufacturer_id', filters.manufacturer_id);
    }

    if (filters.model_id) {
      modelsQuery = modelsQuery.eq('id', filters.model_id);
      trimsQuery = trimsQuery.eq('model_id', filters.model_id);
    }

    if (filters.body_type) {
      modelsQuery = modelsQuery.ilike('body_type', `%${filters.body_type}%`);
      trimsQuery = trimsQuery.ilike('model_name', `%${filters.body_type}%`);
    }

    if (filters.fuel_type) {
      trimsQuery = trimsQuery.ilike('fuel_type', `%${filters.fuel_type}%`);
    }

    if (filters.transmission) {
      trimsQuery = trimsQuery.ilike('transmission', `%${filters.transmission}%`);
    }

    if (filters.min_price !== undefined || filters.max_price !== undefined) {
      if (filters.min_price !== undefined) {
        trimsQuery = trimsQuery.gte('price', filters.min_price);
      }
      if (filters.max_price !== undefined) {
        trimsQuery = trimsQuery.lte('price', filters.max_price);
      }
    }

    if (filters.min_power !== undefined) {
      trimsQuery = trimsQuery.gte('power_hp', filters.min_power);
    }

    if (filters.max_power !== undefined) {
      trimsQuery = trimsQuery.lte('power_hp', filters.max_power);
    }

    if (filters.seats !== undefined) {
      trimsQuery = trimsQuery.eq('seats', filters.seats);
    }

    const [
      { data: manufacturers, error: mError, count: mCount },
      { data: models, error: moError, count: moCount },
      { data: trims, error: tError, count: tCount },
    ] = await Promise.all([
      manufacturersQuery.order('display_order', { ascending: true }),
      modelsQuery.order('display_order', { ascending: true }),
      trimsQuery
        .order('manufacturer_name', { ascending: true })
        .order('model_name', { ascending: true })
        .order('display_order', { ascending: true })
        .range(offset, offset + limit - 1),
    ]);

    if (mError) throw mError;
    if (moError) throw moError;
    if (tError) throw tError;

    return {
      manufacturers: manufacturers || [],
      models: models || [],
      trim_levels: trims || [],
      total_count: tCount || 0,
    };
  } catch (error) {
    console.error('❌ Error searching vehicles:', error);
    throw error;
  }
}

/**
 * חיפוש טקסט חופשי ברכבים
 */
export async function searchVehiclesByText(
  query: string,
  limit: number = 50
): Promise<SearchResult> {
  try {
    const searchTerm = `%${query}%`;

    const { data: manufacturers, error: mError } = await client
      .from('manufacturers_with_counts')
      .select('*')
      .ilike('name', searchTerm)
      .order('display_order', { ascending: true })
      .limit(limit);

    const { data: models, error: moError } = await client
      .from('models_with_manufacturer')
      .select('*')
      .or(`name.ilike.${searchTerm},model_name.ilike.${searchTerm}`)
      .order('display_order', { ascending: true })
      .limit(limit);

    const { data: trims, error: tError } = await client
      .from('trim_levels_full_info')
      .select('*')
      .ilike('trim_name', searchTerm)
      .order('manufacturer_name', { ascending: true })
      .order('model_name', { ascending: true })
      .limit(limit);

    if (mError) throw mError;
    if (moError) throw moError;
    if (tError) throw tError;

    const total = (manufacturers?.length || 0) + (models?.length || 0) + (trims?.length || 0);

    return {
      manufacturers: manufacturers || [],
      models: models || [],
      trim_levels: trims || [],
      total_count: total,
    };
  } catch (error) {
    console.error('❌ Error searching by text:', error);
    throw error;
  }
}

// ============================================
// UTILITIES
// ============================================

/**
 * קבל סטטיסטיקות על הנתונים
 */
export async function getStatistics() {
  try {
    const [
      { count: manufacturerCount },
      { count: modelCount },
      { count: trimCount },
    ] = await Promise.all([
      client
        .from('new_vehicles_manufacturers')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),
      client
        .from('new_vehicles_models')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),
      client
        .from('new_vehicles_trim_levels')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),
    ]);

    return {
      manufacturers: manufacturerCount || 0,
      models: modelCount || 0,
      trim_levels: trimCount || 0,
    };
  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    throw error;
  }
}
