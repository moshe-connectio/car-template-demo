-- ============================================
-- New Vehicles Module - Database Schema
-- יחסים: Manufacturer (1) <- (Many) Models <- (Many) TrimLevels <- (Many) Specifications
-- ============================================

-- 1. טבלת יצרנים
CREATE TABLE IF NOT EXISTS new_vehicles_manufacturers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  logo_url TEXT,
  banner_url TEXT,
  description TEXT,
  country VARCHAR(100),
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. טבלת דגמים (Models)
CREATE TABLE IF NOT EXISTS new_vehicles_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_id UUID NOT NULL REFERENCES new_vehicles_manufacturers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  body_type VARCHAR(100),
  segment VARCHAR(100),
  year_from INTEGER,
  year_to INTEGER,
  base_price DECIMAL(10, 2),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Unique constraint: יצרן + דגם שם תואם
  UNIQUE(manufacturer_id, name)
);

-- 3. טבלת רמות גימור (Trim Levels)
CREATE TABLE IF NOT EXISTS new_vehicles_trim_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES new_vehicles_models(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  transmission VARCHAR(100),
  engine_type VARCHAR(100),
  fuel_type VARCHAR(100),
  power_hp INTEGER,
  torque_nm INTEGER,
  acceleration_0_100 DECIMAL(4, 2),
  top_speed INTEGER,
  fuel_consumption DECIMAL(5, 2),
  co2_emissions DECIMAL(6, 2),
  body_dimensions JSON,
  weight INTEGER,
  seats INTEGER,
  doors INTEGER,
  trunk_volume INTEGER,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Unique constraint: דגם + רמת גימור שם תואם
  UNIQUE(model_id, name)
);

-- 4. טבלת פרטי רכב מורחבים (אופציונלי - אם צריך עוד מידע מתקדם)
CREATE TABLE IF NOT EXISTS new_vehicles_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trim_id UUID NOT NULL REFERENCES new_vehicles_trim_levels(id) ON DELETE CASCADE,
  spec_key VARCHAR(255) NOT NULL,
  spec_value TEXT,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(trim_id, spec_key)
);

-- 5. טבלת תמונות דגמים (אם רוצים תמונות מרובות לדגם)
CREATE TABLE IF NOT EXISTS new_vehicles_model_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES new_vehicles_models(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(model_id, position)
);

-- ============================================
-- INDEXES - לביצועים טובים
-- ============================================

-- Manufacturers
CREATE INDEX idx_manufacturers_slug ON new_vehicles_manufacturers(slug);
CREATE INDEX idx_manufacturers_active ON new_vehicles_manufacturers(is_active);

-- Models
CREATE INDEX idx_models_manufacturer_id ON new_vehicles_models(manufacturer_id);
CREATE INDEX idx_models_slug ON new_vehicles_models(slug);
CREATE INDEX idx_models_active ON new_vehicles_models(is_active);

-- Trim Levels
CREATE INDEX idx_trim_levels_model_id ON new_vehicles_trim_levels(model_id);
CREATE INDEX idx_trim_levels_slug ON new_vehicles_trim_levels(slug);
CREATE INDEX idx_trim_levels_price ON new_vehicles_trim_levels(price);
CREATE INDEX idx_trim_levels_active ON new_vehicles_trim_levels(is_active);

-- Specifications
CREATE INDEX idx_specifications_trim_id ON new_vehicles_specifications(trim_id);
CREATE INDEX idx_specifications_category ON new_vehicles_specifications(category);

-- Model Images
CREATE INDEX idx_model_images_model_id ON new_vehicles_model_images(model_id);

-- ============================================
-- VIEWS - לשאילתות נפוצות
-- ============================================

-- View: יצרנים עם ספירת דגמים
CREATE OR REPLACE VIEW manufacturers_with_counts AS
SELECT 
  m.id,
  m.name,
  m.slug,
  m.logo_url,
  m.description,
  COUNT(DISTINCT mo.id) as models_count,
  COUNT(DISTINCT tl.id) as total_trim_levels,
  m.is_active,
  m.display_order
FROM new_vehicles_manufacturers m
LEFT JOIN new_vehicles_models mo ON m.id = mo.manufacturer_id AND mo.is_active = true
LEFT JOIN new_vehicles_trim_levels tl ON mo.id = tl.model_id AND tl.is_active = true
WHERE m.is_active = true
GROUP BY m.id, m.name, m.slug, m.logo_url, m.description, m.is_active, m.display_order
ORDER BY m.display_order, m.name;

-- View: דגמים עם יצרן וספירת רמות גימור
CREATE OR REPLACE VIEW models_with_manufacturer AS
SELECT 
  mo.id,
  mo.name,
  mo.slug,
  mo.image_url,
  mo.body_type,
  mo.base_price,
  m.id as manufacturer_id,
  m.name as manufacturer_name,
  m.slug as manufacturer_slug,
  m.logo_url as manufacturer_logo,
  COUNT(DISTINCT tl.id) as trim_levels_count,
  MIN(tl.price) as min_price,
  MAX(tl.price) as max_price,
  mo.is_active
FROM new_vehicles_models mo
JOIN new_vehicles_manufacturers m ON mo.manufacturer_id = m.id
LEFT JOIN new_vehicles_trim_levels tl ON mo.id = tl.model_id AND tl.is_active = true
WHERE mo.is_active = true AND m.is_active = true
GROUP BY mo.id, mo.name, mo.slug, mo.image_url, mo.body_type, mo.base_price,
         m.id, m.name, m.slug, m.logo_url, mo.is_active
ORDER BY mo.display_order, mo.name;

-- View: רמות גימור עם מודל ויצרן
CREATE OR REPLACE VIEW trim_levels_full_info AS
SELECT 
  tl.id,
  tl.name as trim_name,
  tl.slug as trim_slug,
  tl.price,
  tl.engine_type,
  tl.fuel_type,
  tl.power_hp,
  tl.transmission,
  tl.fuel_consumption,
  mo.id as model_id,
  mo.name as model_name,
  mo.slug as model_slug,
  mo.image_url as model_image,
  m.id as manufacturer_id,
  m.name as manufacturer_name,
  m.slug as manufacturer_slug,
  m.logo_url as manufacturer_logo,
  tl.is_active
FROM new_vehicles_trim_levels tl
JOIN new_vehicles_models mo ON tl.model_id = mo.id
JOIN new_vehicles_manufacturers m ON mo.manufacturer_id = m.id
WHERE tl.is_active = true AND mo.is_active = true AND m.is_active = true
ORDER BY m.display_order, mo.display_order, tl.display_order;

-- ============================================
-- COMMENTS - תיעוד
-- ============================================

COMMENT ON TABLE new_vehicles_manufacturers IS 'יצרנים (BMW, Mercedes, Audi, וכו)';
COMMENT ON TABLE new_vehicles_models IS 'דגמים של כל יצרן (3 Series, E-Class, A4 וכו)';
COMMENT ON TABLE new_vehicles_trim_levels IS 'רמות גימור של כל דגם (Sport, Premium, Luxury וכו)';
COMMENT ON TABLE new_vehicles_specifications IS 'פרטי רכב מורחבים לכל רמת גימור';
COMMENT ON TABLE new_vehicles_model_images IS 'תמונות דגמים נוספות';

COMMENT ON COLUMN new_vehicles_manufacturers.slug IS 'URL-friendly identifier (e.g., "bmw", "mercedes-benz")';
COMMENT ON COLUMN new_vehicles_models.body_type IS 'סוג הגוף (Sedan, SUV, Coupe וכו)';
COMMENT ON COLUMN new_vehicles_trim_levels.body_dimensions IS 'JSON עם ממדים: {"length": 4700, "width": 1800, "height": 1450}';
