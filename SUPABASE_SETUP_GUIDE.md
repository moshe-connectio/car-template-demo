# הוראות ליצירת טבלאות בSupabase

## שלב 1: פתח את Supabase Console

1. בקר ב- https://app.supabase.com
2. בחר את הפרויקט שלך
3. לחץ על "SQL Editor" בתפריט הצדדי

## שלב 2: הוסף את SQL Migration

1. לחץ על "+ New Query"
2. העתק את כל הקוד מהקובץ `NEW_VEHICLES_MIGRATION.sql`
3. הדבק אותו לעורך SQL
4. לחץ על "Run" או Cmd+Enter

## שלב 3: בדוק שהטבלאות נוצרו

הרץ שאילתה זו כדי לבדוק:

```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'new_vehicles%'
ORDER BY tablename;
```

אתה אמור לראות:
- `new_vehicles_manufacturers`
- `new_vehicles_models`
- `new_vehicles_trim_levels`
- `new_vehicles_specifications`
- `new_vehicles_model_images`

## שלב 4: הוסף RLS Policies (אופציונלי)

אם אתה רוצה Row Level Security:

```sql
-- מאפשר לכול אחד לקרוא
CREATE POLICY "Public read" ON new_vehicles_manufacturers
  FOR SELECT USING (true);

CREATE POLICY "Public read" ON new_vehicles_models
  FOR SELECT USING (true);

CREATE POLICY "Public read" ON new_vehicles_trim_levels
  FOR SELECT USING (true);

CREATE POLICY "Public read" ON new_vehicles_specifications
  FOR SELECT USING (true);

CREATE POLICY "Public read" ON new_vehicles_model_images
  FOR SELECT USING (true);
```

## שלב 5: הוסף נתונים ראשוניים (Seeding)

אתה יכול להשתמש בקובץ `NEW_VEHICLES_SEED.sql` כדי להוסיף נתונים לבדיקה.

## חשוב: Slug Format

בחר slogs בתבנית זו:
- **יצרנים**: "bmw", "mercedes-benz", "audi", וכו'
- **דגמים**: "3-series", "5-series", "7-series", וכו'
- **רמות גימור**: "sport", "premium", "luxury", "m-sport", וכו'

Slugs חייבים להיות:
- lowercase
- עם מינוסים במקום רווחים
- בלי תווים מיוחדים

## דוגמה: הוספת יצרן ודגם

```sql
-- 1. הוסף יצרן
INSERT INTO new_vehicles_manufacturers (name, slug, description, country, display_order)
VALUES (
  'BMW',
  'bmw',
  'יצרנית הרכב הגרמנית המפורסמת BMW',
  'Germany',
  1
);

-- 2. קבל את ה-ID של היצרן שזה עתה נוצר
SELECT id FROM new_vehicles_manufacturers WHERE slug = 'bmw';

-- 3. הוסף דגם (החלף את ה-ID בתוצאה של השאילתה הקודמת)
INSERT INTO new_vehicles_models (manufacturer_id, name, slug, body_type, base_price, display_order, is_active)
VALUES (
  '{MANUFACTURER_ID}',
  '3 Series',
  '3-series',
  'Sedan',
  150000,
  1,
  true
);

-- 4. קבל את ה-ID של הדגם
SELECT id FROM new_vehicles_models WHERE slug = '3-series';

-- 5. הוסף רמת גימור (החלף את ה-ID בתוצאה של השאילתה הקודמת)
INSERT INTO new_vehicles_trim_levels (
  model_id,
  name,
  slug,
  price,
  engine_type,
  transmission,
  fuel_type,
  power_hp,
  acceleration_0_100,
  fuel_consumption,
  seats,
  doors,
  display_order
)
VALUES (
  '{MODEL_ID}',
  'Sport',
  'sport',
  165000,
  'Petrol',
  'Automatic',
  'Petrol',
  330,
  5.8,
  7.5,
  5,
  4,
  1
);
```

## צפייה בנתונים דרך Views

```sql
-- ראה את כל היצרנים עם ספירת דגמים
SELECT * FROM manufacturers_with_counts;

-- ראה את כל הדגמים עם טווח מחירים
SELECT * FROM models_with_manufacturer;

-- ראה את כל רמות הגימור עם יצרן ודגם
SELECT * FROM trim_levels_full_info;
```

## בדיקה - שאילתה בסיסית

```sql
-- בדוק שהנתונים נכנסו בעמודה
SELECT 
  m.name as manufacturer,
  mo.name as model,
  tl.name as trim,
  tl.price
FROM new_vehicles_trim_levels tl
JOIN new_vehicles_models mo ON tl.model_id = mo.id
JOIN new_vehicles_manufacturers m ON mo.manufacturer_id = m.id
ORDER BY m.name, mo.name, tl.price;
```
