/**
 * New Vehicles Module - Data Seed Script
 * ניתן להשתמש בזה כדי להוסיף נתוני דוגמה או טעינה בעיתוי של נתונים
 * 
 * השתמש בקובץ זה:
 * 1. מקומי: ts-node src/modules/new-vehicles/lib/seed.ts
 * 2. או הוסף קובץ SQL דומה ישירות ל-Supabase
 */

import { createServerSupabaseClient } from '@core/lib/supabase';
import type {
  Manufacturer,
  Model,
  TrimLevel,
  Specification,
} from '../types';

const client = createServerSupabaseClient();

/**
 * דוגמה של יצרנים להוספה
 */
const SAMPLE_MANUFACTURERS: Omit<Manufacturer, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'BMW',
    slug: 'bmw',
    logo_url: 'https://www.bmw.com/content/dam/bmwcom/marketing/global/logo/logo.svg',
    banner_url: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891',
    description: 'יצרנית הרכב הגרמנית BMW מייצרת כלי רכב בעלי ביצועים וקוואליטי גבוהים',
    country: 'Germany',
    website_url: 'https://www.bmw.com',
    display_order: 1,
    is_active: true,
  },
  {
    name: 'Mercedes-Benz',
    slug: 'mercedes-benz',
    logo_url: 'https://www.mercedes-benz.com/content/dam/hq/logo.svg',
    banner_url: 'https://images.unsplash.com/photo-1553882900-d5160ca84f61',
    description: 'מרצדס בנץ - יצרנית הרכב היוקרתית הגרמנית עם מסורת עשירה',
    country: 'Germany',
    website_url: 'https://www.mercedes-benz.com',
    display_order: 2,
    is_active: true,
  },
  {
    name: 'Audi',
    slug: 'audi',
    logo_url: 'https://www.audi.com/content/dam/audi-com/logo.svg',
    banner_url: 'https://images.unsplash.com/photo-1553882900-d5160ca84f61',
    description: 'אאודי - יצרנית רכבי יוקרה ופחות גרמנית',
    country: 'Germany',
    website_url: 'https://www.audi.com',
    display_order: 3,
    is_active: true,
  },
  {
    name: 'Tesla',
    slug: 'tesla',
    logo_url: 'https://www.tesla.com/images/logo.svg',
    banner_url: 'https://images.unsplash.com/photo-1560958089-b8a63c62c347',
    description: 'טסלה - חברת כלי רכב חשמליים עם טכנולוגיה מתקדמת',
    country: 'United States',
    website_url: 'https://www.tesla.com',
    display_order: 4,
    is_active: true,
  },
];

/**
 * דוגמה של דגמים (תלויים ביצרן)
 */
const SAMPLE_MODELS_BY_MANUFACTURER: Record<string, Omit<Model, 'id' | 'manufacturer_id' | 'created_at' | 'updated_at'>[]> = {
  'bmw': [
    {
      name: '3 Series',
      slug: '3-series',
      description: 'סדרה קומפקטית של רכבי יוקרה עם ביצועים מעולים',
      image_url: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891',
      body_type: 'Sedan',
      segment: 'Compact Executive',
      year_from: 2024,
      year_to: 2025,
      base_price: 150000,
      display_order: 1,
      is_active: true,
    },
    {
      name: '5 Series',
      slug: '5-series',
      description: 'סדרה בינונית של רכבי יוקרה',
      image_url: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891',
      body_type: 'Sedan',
      segment: 'Mid-Size Executive',
      year_from: 2024,
      year_to: 2025,
      base_price: 250000,
      display_order: 2,
      is_active: true,
    },
  ],
  'mercedes-benz': [
    {
      name: 'C-Class',
      slug: 'c-class',
      description: 'סדרה קומפקטית של מרצדס בנץ',
      image_url: 'https://images.unsplash.com/photo-1553882900-d5160ca84f61',
      body_type: 'Sedan',
      segment: 'Compact Executive',
      year_from: 2024,
      year_to: 2025,
      base_price: 160000,
      display_order: 1,
      is_active: true,
    },
    {
      name: 'E-Class',
      slug: 'e-class',
      description: 'סדרה בינונית של מרצדס בנץ',
      image_url: 'https://images.unsplash.com/photo-1553882900-d5160ca84f61',
      body_type: 'Sedan',
      segment: 'Mid-Size Executive',
      year_from: 2024,
      year_to: 2025,
      base_price: 270000,
      display_order: 2,
      is_active: true,
    },
  ],
};

/**
 * דוגמה של רמות גימור
 */
const SAMPLE_TRIM_LEVELS: Omit<TrimLevel, 'id' | 'model_id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Sport',
    slug: 'sport',
    description: 'רמת גימור Sport עם מראים ספורטיים',
    price: 165000,
    transmission: 'Automatic',
    engine_type: 'Petrol',
    fuel_type: 'Petrol',
    power_hp: 330,
    torque_nm: 450,
    acceleration_0_100: 5.8,
    top_speed: 250,
    fuel_consumption: 7.5,
    co2_emissions: 185,
    body_dimensions: {
      length: 4700,
      width: 1800,
      height: 1440,
      wheelbase: 2850,
    },
    weight: 1500,
    seats: 5,
    doors: 4,
    trunk_volume: 480,
    display_order: 1,
    is_active: true,
  },
  {
    name: 'Premium',
    slug: 'premium',
    description: 'רמת גימור Premium עם תכונות יוקרה',
    price: 185000,
    transmission: 'Automatic',
    engine_type: 'Petrol',
    fuel_type: 'Petrol',
    power_hp: 340,
    torque_nm: 480,
    acceleration_0_100: 5.6,
    top_speed: 250,
    fuel_consumption: 7.8,
    co2_emissions: 190,
    body_dimensions: {
      length: 4700,
      width: 1800,
      height: 1440,
      wheelbase: 2850,
    },
    weight: 1550,
    seats: 5,
    doors: 4,
    trunk_volume: 480,
    display_order: 2,
    is_active: true,
  },
];

/**
 * פונקציה לעוזרה בהוספת נתונים
 */
export async function seedManufacturers() {
  console.log('🌱 Adding manufacturers...');

  for (const manufacturer of SAMPLE_MANUFACTURERS) {
    const { data, error } = await client
      .from('new_vehicles_manufacturers')
      .upsert([manufacturer], { onConflict: 'slug' })
      .select();

    if (error) {
      console.error(`❌ Error adding ${manufacturer.name}:`, error);
    } else {
      console.log(`✅ Added ${manufacturer.name}`);
    }
  }
}

export async function seedModels() {
  console.log('🌱 Adding models...');

  for (const [manufacturerSlug, models] of Object.entries(
    SAMPLE_MODELS_BY_MANUFACTURER
  )) {
    // Get manufacturer ID
    const { data: manufacturerData, error: mError } = await client
      .from('new_vehicles_manufacturers')
      .select('id')
      .eq('slug', manufacturerSlug)
      .single();

    if (mError || !manufacturerData) {
      console.error(`❌ Could not find manufacturer ${manufacturerSlug}`);
      continue;
    }

    for (const model of models) {
      const { data, error } = await client
        .from('new_vehicles_models')
        .upsert(
          [{ ...model, manufacturer_id: manufacturerData.id }],
          { onConflict: 'manufacturer_id,name' }
        )
        .select();

      if (error) {
        console.error(`❌ Error adding ${model.name}:`, error);
      } else {
        console.log(`✅ Added ${model.name}`);
      }
    }
  }
}

export async function seedTrimLevels() {
  console.log('🌱 Adding trim levels...');

  // This is simplified - in reality you'd match trim levels to specific models
  // For now, we'll show the structure

  console.log('ℹ️ Trim levels should be added to specific models');
  console.log('   Use the model ID to link them');
}

/**
 * Main seed function
 */
export async function runSeed() {
  try {
    console.log('🚀 Starting seed process...\n');

    await seedManufacturers();
    console.log('');

    await seedModels();
    console.log('');

    await seedTrimLevels();
    console.log('');

    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

// If running as standalone script
if (require.main === module) {
  runSeed().then(() => process.exit(0));
}
