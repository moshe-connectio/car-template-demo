-- Supabase Migration: New Vehicles Module
-- Copy and paste this into the Supabase SQL editor to create the tables

-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DROP EXISTING TABLES (if needed for fresh start)
-- ============================================
-- Uncomment these if you want to completely reset:
-- DROP VIEW IF EXISTS trim_levels_full_info CASCADE;
-- DROP VIEW IF EXISTS models_with_manufacturer CASCADE;
-- DROP VIEW IF EXISTS manufacturers_with_counts CASCADE;
-- DROP TABLE IF EXISTS new_vehicles_specifications CASCADE;
-- DROP TABLE IF EXISTS new_vehicles_model_images CASCADE;
-- DROP TABLE IF EXISTS new_vehicles_trim_levels CASCADE;
-- DROP TABLE IF EXISTS new_vehicles_models CASCADE;
-- DROP TABLE IF EXISTS new_vehicles_manufacturers CASCADE;

-- ============================================
-- 1. טבלת יצרנים
-- ============================================
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

-- ============================================
-- 2. טבלת דגמים (Models)
-- ============================================
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
  UNIQUE(manufacturer_id, name)
);

-- ============================================
-- 3. טבלת רמות גימור (Trim Levels)
-- ============================================
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
  body_dimensions JSONB,
  weight INTEGER,
  seats INTEGER,
  doors INTEGER,
  trunk_volume INTEGER,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(model_id, name)
);

-- ============================================
-- 4. טבלת פרטי רכב מורחבים
-- ============================================
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

-- ============================================
-- 5. טבלת תמונות דגמים
-- ============================================
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
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_manufacturers_slug ON new_vehicles_manufacturers(slug);
CREATE INDEX IF NOT EXISTS idx_manufacturers_active ON new_vehicles_manufacturers(is_active);

CREATE INDEX IF NOT EXISTS idx_models_manufacturer_id ON new_vehicles_models(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_models_slug ON new_vehicles_models(slug);
CREATE INDEX IF NOT EXISTS idx_models_active ON new_vehicles_models(is_active);

CREATE INDEX IF NOT EXISTS idx_trim_levels_model_id ON new_vehicles_trim_levels(model_id);
CREATE INDEX IF NOT EXISTS idx_trim_levels_slug ON new_vehicles_trim_levels(slug);
CREATE INDEX IF NOT EXISTS idx_trim_levels_price ON new_vehicles_trim_levels(price);
CREATE INDEX IF NOT EXISTS idx_trim_levels_active ON new_vehicles_trim_levels(is_active);

CREATE INDEX IF NOT EXISTS idx_specifications_trim_id ON new_vehicles_specifications(trim_id);
CREATE INDEX IF NOT EXISTS idx_specifications_category ON new_vehicles_specifications(category);

CREATE INDEX IF NOT EXISTS idx_model_images_model_id ON new_vehicles_model_images(model_id);

-- ============================================
-- VIEWS
-- ============================================

-- View: יצרנים עם ספירת דגמים
DROP VIEW IF EXISTS manufacturers_with_counts CASCADE;
CREATE VIEW manufacturers_with_counts AS
SELECT 
  m.id,
  m.name,
  m.slug,
  m.logo_url,
  m.banner_url,
  m.description,
  m.country,
  m.website_url,
  COUNT(DISTINCT mo.id) as models_count,
  COUNT(DISTINCT tl.id) as total_trim_levels,
  m.is_active,
  m.display_order,
  m.created_at,
  m.updated_at
FROM new_vehicles_manufacturers m
LEFT JOIN new_vehicles_models mo ON m.id = mo.manufacturer_id AND mo.is_active = true
LEFT JOIN new_vehicles_trim_levels tl ON mo.id = tl.model_id AND tl.is_active = true
WHERE m.is_active = true
GROUP BY m.id, m.name, m.slug, m.logo_url, m.banner_url, m.description, m.country, m.website_url, m.is_active, m.display_order, m.created_at, m.updated_at
ORDER BY m.display_order, m.name;

-- View: דגמים עם יצרן וספירת רמות גימור
DROP VIEW IF EXISTS models_with_manufacturer CASCADE;
CREATE VIEW models_with_manufacturer AS
SELECT 
  mo.id,
  mo.name,
  mo.slug,
  mo.image_url,
  mo.description,
  mo.body_type,
  mo.segment,
  mo.base_price,
  m.id as manufacturer_id,
  m.name as manufacturer_name,
  m.slug as manufacturer_slug,
  m.logo_url as manufacturer_logo,
  COUNT(DISTINCT tl.id) as trim_levels_count,
  MIN(tl.price) as min_price,
  MAX(tl.price) as max_price,
  mo.is_active,
  mo.display_order,
  mo.created_at,
  mo.updated_at
FROM new_vehicles_models mo
JOIN new_vehicles_manufacturers m ON mo.manufacturer_id = m.id
LEFT JOIN new_vehicles_trim_levels tl ON mo.id = tl.model_id AND tl.is_active = true
WHERE mo.is_active = true AND m.is_active = true
GROUP BY mo.id, mo.name, mo.slug, mo.image_url, mo.description, mo.body_type, mo.segment, mo.base_price,
         m.id, m.name, m.slug, m.logo_url, mo.is_active, mo.display_order, mo.created_at, mo.updated_at
ORDER BY m.display_order, mo.display_order, mo.name;

-- View: רמות גימור עם מודל ויצרן
DROP VIEW IF EXISTS trim_levels_full_info CASCADE;
CREATE VIEW trim_levels_full_info AS
SELECT 
  tl.id,
  tl.name,
  tl.slug,
  tl.description,
  tl.price,
  tl.transmission,
  tl.engine_type,
  tl.fuel_type,
  tl.power_hp,
  tl.torque_nm,
  tl.acceleration_0_100,
  tl.top_speed,
  tl.fuel_consumption,
  tl.co2_emissions,
  tl.body_dimensions,
  tl.weight,
  tl.seats,
  tl.doors,
  tl.trunk_volume,
  mo.id as model_id,
  mo.name as model_name,
  mo.slug as model_slug,
  mo.image_url as model_image,
  m.id as manufacturer_id,
  m.name as manufacturer_name,
  m.slug as manufacturer_slug,
  m.logo_url as manufacturer_logo,
  tl.is_active,
  tl.display_order,
  tl.created_at,
  tl.updated_at
FROM new_vehicles_trim_levels tl
JOIN new_vehicles_models mo ON tl.model_id = mo.id
JOIN new_vehicles_manufacturers m ON mo.manufacturer_id = m.id
WHERE tl.is_active = true AND mo.is_active = true AND m.is_active = true
ORDER BY m.display_order, mo.display_order, tl.display_order;

-- ============================================
-- Row Level Security (RLS) - אם צריך
-- ============================================
-- Uncomment if you want to enable RLS

-- ALTER TABLE new_vehicles_manufacturers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE new_vehicles_models ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE new_vehicles_trim_levels ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE new_vehicles_specifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE new_vehicles_model_images ENABLE ROW LEVEL SECURITY;

-- Create policies (public read access, admin write access)
-- This assumes you have an 'is_admin' claim in your JWT
-- Adjust as needed for your authentication setup

-- CREATE POLICY "Public read access" ON new_vehicles_manufacturers
--   FOR SELECT USING (true);
--
-- CREATE POLICY "Admin write access" ON new_vehicles_manufacturers
--   USING (auth.jwt() ->> 'is_admin' = 'true');

-- ============================================
-- SAMPLE DATA (optional - uncomment to test)
-- ============================================

-- BMW
-- INSERT INTO new_vehicles_manufacturers (name, slug, logo_url, description, country, display_order)
-- VALUES (
--   'BMW',
--   'bmw',
--   'https://example.com/logos/bmw.png',
--   'יצרנית הרכב הגרמנית המפורסמת BMW מייצרת כלי רכב פחות וביצועים גבוהים',
--   'Germany',
--   1
-- ) ON CONFLICT (slug) DO NOTHING;

-- For production, you'll want to seed this data from a script or CSV
