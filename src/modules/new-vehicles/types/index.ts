/**
 * New Vehicles Module - TypeScript Types
 * התאמה מדוקדקת ל-SQL schema עם יחסים
 */

// ============================================
// Manufacturer (יצרן)
// ============================================
export type Manufacturer = {
  id: string;
  name: string; // "BMW", "Mercedes-Benz"
  slug: string; // "bmw", "mercedes-benz"
  logo_url: string | null;
  banner_url: string | null;
  description: string | null;
  country: string | null;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ManufacturerWithCounts = Manufacturer & {
  models_count: number;
  total_trim_levels: number;
};

// ============================================
// Model (דגם של יצרן)
// ============================================
export type Model = {
  id: string;
  manufacturer_id: string;
  name: string; // "3 Series", "E-Class"
  slug: string; // "3-series", "e-class"
  description: string | null;
  image_url: string | null;
  body_type: string | null; // "Sedan", "SUV", "Coupe"
  segment: string | null; // "Premium", "Mid-size"
  year_from: number | null;
  year_to: number | null;
  base_price: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ModelWithManufacturer = Model & {
  manufacturer_name: string;
  manufacturer_slug: string;
  manufacturer_logo: string | null;
  trim_levels_count: number;
  min_price: number | null;
  max_price: number | null;
};

// ============================================
// Trim Level (רמת גימור)
// ============================================
export type TrimLevel = {
  id: string;
  model_id: string;
  name: string; // "Sport", "Premium", "Luxury"
  slug: string;
  description: string | null;
  price: number;
  transmission: string | null; // "Manual", "Automatic", "CVT"
  engine_type: string | null; // "Petrol", "Diesel", "Hybrid", "Electric"
  fuel_type: string | null; // Same as engine_type usually
  power_hp: number | null; // 150, 200, 300
  torque_nm: number | null; // Newton-meters
  acceleration_0_100: number | null; // Seconds
  top_speed: number | null; // km/h
  fuel_consumption: number | null; // L/100km
  co2_emissions: number | null; // g/km
  body_dimensions: BodyDimensions | null; // JSON stored as object
  weight: number | null; // kg
  seats: number | null;
  doors: number | null;
  trunk_volume: number | null; // Liters
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type BodyDimensions = {
  length?: number; // mm
  width?: number;
  height?: number;
  wheelbase?: number;
};

export type TrimLevelFullInfo = TrimLevel & {
  model_name: string;
  model_slug: string;
  model_image: string | null;
  manufacturer_id: string;
  manufacturer_name: string;
  manufacturer_slug: string;
  manufacturer_logo: string | null;
};

// ============================================
// Specification (פרט מורחב)
// ============================================
export type Specification = {
  id: string;
  trim_id: string;
  spec_key: string;
  spec_value: string | null;
  category: string | null; // "Safety", "Comfort", "Technology"
  display_order: number;
  created_at: string;
};

// ============================================
// Model Image (תמונה נוספת של דגם)
// ============================================
export type ModelImage = {
  id: string;
  model_id: string;
  image_url: string;
  alt_text: string | null;
  position: number;
  created_at: string;
};

// ============================================
// Composite Types (לתצוגה משולבת)
// ============================================

/** מידע יצרן עם הדגמים שלו */
export type ManufacturerWithModels = ManufacturerWithCounts & {
  models: ModelWithManufacturer[];
};

/** מידע דגם עם רמות הגימור שלו */
export type ModelWithTrimLevels = ModelWithManufacturer & {
  trim_levels: TrimLevel[];
};

/** מידע רמת גימור עם הפרטים המורחבים שלה */
export type TrimLevelWithSpecifications = TrimLevelFullInfo & {
  specifications: Specification[];
};

// ============================================
// Search & Filter Types
// ============================================

export type SearchFilters = {
  manufacturer_id?: string;
  model_id?: string;
  body_type?: string;
  min_price?: number;
  max_price?: number;
  fuel_type?: string;
  transmission?: string;
  min_power?: number;
  max_power?: number;
  seats?: number;
};

export type SearchResult = {
  manufacturers: ManufacturerWithCounts[];
  models: ModelWithManufacturer[];
  trim_levels: TrimLevelFullInfo[];
  total_count: number;
};
