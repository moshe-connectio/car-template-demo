-- New Vehicles Module - Sample Data Seed
-- Use this to add sample data to test the module
-- 
-- Instructions:
-- 1. Open Supabase Console → SQL Editor
-- 2. Copy-paste this entire file
-- 3. Click "Run"
-- 4. Check the new-vehicles pages

-- ============================================
-- SAMPLE DATA
-- ============================================

-- 1. Add Manufacturers
INSERT INTO new_vehicles_manufacturers (
  name, 
  slug, 
  logo_url, 
  description, 
  country, 
  website_url,
  display_order,
  is_active
) VALUES
  (
    'BMW',
    'bmw',
    'https://www.bmw.com/content/dam/bmwcom/marketing/global/logo/logo.svg',
    'יצרנית הרכב הגרמנית המפורסמת BMW מייצרת כלי רכב בעלי ביצועים וקוואליטי גבוהים',
    'Germany',
    'https://www.bmw.com',
    1,
    true
  ),
  (
    'Mercedes-Benz',
    'mercedes-benz',
    'https://www.mercedes-benz.com/content/dam/hq/logo.svg',
    'מרצדס בנץ היא יצרנית הרכב היוקרתית הגרמנית עם מסורת עשירה של ביצוע',
    'Germany',
    'https://www.mercedes-benz.com',
    2,
    true
  ),
  (
    'Audi',
    'audi',
    'https://www.audi.com/content/dam/audi-com/logo.svg',
    'אאודי היא יצרנית רכבי יוקרה גרמנית בעלת טכנולוגיה מתקדמת',
    'Germany',
    'https://www.audi.com',
    3,
    true
  ),
  (
    'Tesla',
    'tesla',
    'https://www.tesla.com/images/logo.svg',
    'טסלה היא חברת כלי רכב חשמליים אמריקאית עם טכנולוגיה מובילה',
    'United States',
    'https://www.tesla.com',
    4,
    true
  ),
  (
    'Volkswagen',
    'volkswagen',
    'https://www.volkswagen.com/static/media/logo-dark.svg',
    'פולקסווגן היא יצרנית הרכב הגרמנית הגדולה ביותר',
    'Germany',
    'https://www.volkswagen.com',
    5,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- 2. Get IDs of manufacturers for models
WITH mfg AS (
  SELECT id, slug FROM new_vehicles_manufacturers 
  WHERE slug IN ('bmw', 'mercedes-benz', 'audi', 'tesla', 'volkswagen')
)

-- 3. Add Models
INSERT INTO new_vehicles_models (
  manufacturer_id,
  name,
  slug,
  description,
  image_url,
  body_type,
  segment,
  year_from,
  year_to,
  base_price,
  display_order,
  is_active
) 
SELECT
  (SELECT id FROM mfg WHERE slug = 'bmw'),
  '3 Series',
  '3-series',
  'סדרה קומפקטית של רכבי יוקרה עם ביצועים מעולים',
  'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400',
  'Sedan',
  'Compact Executive',
  2024,
  2025,
  150000,
  1,
  true

UNION ALL

SELECT
  (SELECT id FROM mfg WHERE slug = 'bmw'),
  '5 Series',
  '5-series',
  'סדרה בינונית של רכבי יוקרה עם יותר מקום ופעמים',
  'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400',
  'Sedan',
  'Mid-Size Executive',
  2024,
  2025,
  250000,
  2,
  true

UNION ALL

SELECT
  (SELECT id FROM mfg WHERE slug = 'mercedes-benz'),
  'C-Class',
  'c-class',
  'סדרה קומפקטית של מרצדס בנץ עם יוקרה וביצוע',
  'https://images.unsplash.com/photo-1553882900-d5160ca84f61?w=400',
  'Sedan',
  'Compact Executive',
  2024,
  2025,
  160000,
  1,
  true

UNION ALL

SELECT
  (SELECT id FROM mfg WHERE slug = 'mercedes-benz'),
  'E-Class',
  'e-class',
  'סדרה בינונית של מרצדס בנץ',
  'https://images.unsplash.com/photo-1553882900-d5160ca84f61?w=400',
  'Sedan',
  'Mid-Size Executive',
  2024,
  2025,
  270000,
  2,
  true

UNION ALL

SELECT
  (SELECT id FROM mfg WHERE slug = 'audi'),
  'A4',
  'a4',
  'סדרה קומפקטית של אאודי',
  'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400',
  'Sedan',
  'Compact Executive',
  2024,
  2025,
  155000,
  1,
  true

UNION ALL

SELECT
  (SELECT id FROM mfg WHERE slug = 'tesla'),
  'Model 3',
  'model-3',
  'רכב חשמלי קומפקטי יוקרתי',
  'https://images.unsplash.com/photo-1560958089-b8a63c62c347?w=400',
  'Sedan',
  'Compact Executive',
  2024,
  2025,
  200000,
  1,
  true

UNION ALL

SELECT
  (SELECT id FROM mfg WHERE slug = 'tesla'),
  'Model S',
  'model-s',
  'רכב חשמלי גדול וחזק',
  'https://images.unsplash.com/photo-1560958089-b8a63c62c347?w=400',
  'Sedan',
  'Mid-Size Executive',
  2024,
  2025,
  350000,
  2,
  true

UNION ALL

SELECT
  (SELECT id FROM mfg WHERE slug = 'volkswagen'),
  'Golf',
  'golf',
  'הצפן הקומפקטי הפופולרי בעולם',
  'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400',
  'Hatchback',
  'Compact',
  2024,
  2025,
  120000,
  1,
  true

ON CONFLICT DO NOTHING;

-- 4. Get all models to add trim levels
WITH models_data AS (
  SELECT id, name FROM new_vehicles_models 
  WHERE slug IN ('3-series', '5-series', 'c-class', 'e-class', 'a4', 'model-3', 'model-s', 'golf')
)

-- 5. Add Trim Levels
INSERT INTO new_vehicles_trim_levels (
  model_id,
  name,
  slug,
  description,
  price,
  transmission,
  engine_type,
  fuel_type,
  power_hp,
  torque_nm,
  acceleration_0_100,
  top_speed,
  fuel_consumption,
  co2_emissions,
  body_dimensions,
  weight,
  seats,
  doors,
  trunk_volume,
  display_order,
  is_active
)
SELECT
  (SELECT id FROM models_data WHERE slug = '3-series'),
  'Sport',
  'sport',
  'רמת גימור Sport עם מראים ספורטיים',
  165000,
  'Automatic',
  'Petrol',
  'Petrol',
  330,
  450,
  5.8,
  250,
  7.5,
  185,
  '{"length": 4700, "width": 1800, "height": 1440, "wheelbase": 2850}'::jsonb,
  1500,
  5,
  4,
  480,
  1,
  true

UNION ALL

SELECT
  (SELECT id FROM models_data WHERE slug = '3-series'),
  'Premium',
  'premium',
  'רמת גימור Premium עם תכונות יוקרה',
  185000,
  'Automatic',
  'Petrol',
  'Petrol',
  340,
  480,
  5.6,
  250,
  7.8,
  190,
  '{"length": 4700, "width": 1800, "height": 1440, "wheelbase": 2850}'::jsonb,
  1550,
  5,
  4,
  480,
  2,
  true

UNION ALL

SELECT
  (SELECT id FROM models_data WHERE slug = '5-series'),
  'Sport',
  'sport',
  'ספורט 5 סדרה',
  270000,
  'Automatic',
  'Petrol',
  'Petrol',
  340,
  500,
  5.4,
  250,
  8.2,
  200,
  '{"length": 4960, "width": 1860, "height": 1480, "wheelbase": 2975}'::jsonb,
  1700,
  5,
  4,
  530,
  1,
  true

UNION ALL

SELECT
  (SELECT id FROM models_data WHERE slug = 'c-class'),
  'Sport',
  'sport',
  'רמת גימור Sport',
  175000,
  'Automatic',
  'Petrol',
  'Petrol',
  340,
  480,
  5.8,
  250,
  7.8,
  190,
  '{"length": 4750, "width": 1820, "height": 1435, "wheelbase": 2865}'::jsonb,
  1560,
  5,
  4,
  455,
  1,
  true

UNION ALL

SELECT
  (SELECT id FROM models_data WHERE slug = 'e-class'),
  'Diesel',
  'diesel',
  'רמת גימור עם דיזל חזק',
  290000,
  'Automatic',
  'Diesel',
  'Diesel',
  340,
  700,
  6.2,
  245,
  6.2,
  160,
  '{"length": 4975, "width": 1890, "height": 1485, "wheelbase": 2995}'::jsonb,
  1800,
  5,
  4,
  540,
  1,
  true

UNION ALL

SELECT
  (SELECT id FROM models_data WHERE slug = 'model-3'),
  'Standard',
  'standard',
  'גרסה סטנדרטית',
  200000,
  'Automatic',
  'Electric',
  'Electric',
  283,
  660,
  6.1,
  225,
  0,
  0,
  '{"length": 4694, "width": 1849, "height": 1435, "wheelbase": 2875}'::jsonb,
  1611,
  5,
  4,
  580,
  1,
  true

UNION ALL

SELECT
  (SELECT id FROM models_data WHERE slug = 'model-3'),
  'Performance',
  'performance',
  'גרסת ביצוע',
  260000,
  'Automatic',
  'Electric',
  'Electric',
  507,
  660,
  3.2,
  250,
  0,
  0,
  '{"length": 4694, "width": 1849, "height": 1435, "wheelbase": 2875}'::jsonb,
  1680,
  5,
  4,
  580,
  2,
  true

UNION ALL

SELECT
  (SELECT id FROM models_data WHERE slug = 'golf'),
  'Base',
  'base',
  'גרסה בסיסית',
  120000,
  'Manual',
  'Petrol',
  'Petrol',
  110,
  200,
  10.9,
  190,
  6.2,
  150,
  '{"length": 4300, "width": 1800, "height": 1450, "wheelbase": 2630}'::jsonb,
  1250,
  5,
  4,
  380,
  1,
  true

UNION ALL

SELECT
  (SELECT id FROM models_data WHERE slug = 'golf'),
  'TSI',
  'tsi',
  'מנוע טורבו חזק',
  145000,
  'Automatic',
  'Petrol',
  'Petrol',
  150,
  250,
  8.9,
  200,
  6.8,
  165,
  '{"length": 4300, "width": 1800, "height": 1450, "wheelbase": 2630}'::jsonb,
  1300,
  5,
  4,
  380,
  2,
  true

ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY DATA
-- ============================================

-- Check manufacturers
SELECT COUNT(*) as manufacturer_count FROM new_vehicles_manufacturers WHERE is_active = true;

-- Check models
SELECT COUNT(*) as model_count FROM new_vehicles_models WHERE is_active = true;

-- Check trim levels
SELECT COUNT(*) as trim_level_count FROM new_vehicles_trim_levels WHERE is_active = true;

-- Check with views
SELECT * FROM manufacturers_with_counts LIMIT 5;
SELECT * FROM models_with_manufacturer LIMIT 5;
SELECT * FROM trim_levels_full_info LIMIT 5;

-- ============================================
-- SAMPLE QUERIES TO TEST
-- ============================================

-- Get all manufacturers with counts
-- SELECT * FROM manufacturers_with_counts;

-- Get BMW with all its models
-- SELECT * FROM models_with_manufacturer WHERE manufacturer_slug = 'bmw';

-- Get 3 Series trim levels with details
-- SELECT * FROM trim_levels_full_info WHERE model_slug = '3-series';

-- Get all cars that are sedans
-- SELECT * FROM models_with_manufacturer WHERE body_type = 'Sedan';

-- Get cars in a price range
-- SELECT * FROM trim_levels_full_info WHERE price BETWEEN 150000 AND 300000;

-- Get electric vehicles
-- SELECT DISTINCT manufacturer_name, model_name FROM trim_levels_full_info WHERE fuel_type = 'Electric';

-- Get most expensive cars
-- SELECT * FROM trim_levels_full_info ORDER BY price DESC LIMIT 10;

-- Get cars with most power
-- SELECT * FROM trim_levels_full_info WHERE power_hp > 300 ORDER BY power_hp DESC;
