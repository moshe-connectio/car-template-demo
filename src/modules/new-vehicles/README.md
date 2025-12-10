# מודול רכבים חדשים (New Vehicles Module)

## סקירה כללית

מודול זה מציג רכבים חדשים שנמכרים בישראל בהיררכיה של:
1. **יצרנים** - BMW, Mercedes, Tesla וכו'
2. **דגמים** - 3 Series, E-Class, Model S וכו'
3. **רמות גימור** - Sport, Premium, Luxury וכו'

## מבנה הקבצים

```
src/modules/new-vehicles/
├── components/
│   ├── ManufacturerGrid.tsx     # רשת יצרנים עם לוגו
│   ├── ModelGrid.tsx             # רשת דגמים עם תמונה
│   ├── TrimLevelSelector.tsx     # בחירת רמת גימור
│   └── VehicleSpecifications.tsx # תצוגת פרטי רכב
├── lib/
│   ├── repository.ts             # גישה לנתונים (Supabase)
│   └── seed.ts                   # סקריפט להוספת נתונים לדוגמה
├── types/
│   └── index.ts                  # TypeScript types
└── config/
    └── (יתווסף בהמשך)

src/app/new-vehicles/
├── page.tsx                       # עמוד ראשי - יצרנים
├── [manufacturer]/
│   ├── page.tsx                   # עמוד יצרן - דגמים
│   └── [model]/
│       └── page.tsx               # עמוד דגם - רמות גימור + פרטים
└── layout.tsx                     # layout משותף
```

## התקנה

### 1. יצירת טבלאות בSupabase

**אפשרות A: דרך Supabase Console (מומלץ)**

1. פתח את [Supabase Console](https://app.supabase.com)
2. בחר את הפרויקט שלך
3. לחץ על "SQL Editor"
4. לחץ על "+ New Query"
5. העתק את כל הקוד מ- `NEW_VEHICLES_MIGRATION.sql`
6. הדבק ויפעיל (Run)

**אפשרות B: דרך Migration Files**

אם אתה רוצה להשתמש ב-Supabase Migrations officially:

```bash
# Copy the migration file
cp NEW_VEHICLES_MIGRATION.sql supabase/migrations/$(date +%s)_new_vehicles.sql

# Deploy
supabase db push
```

### 2. הוסף נתונים לדוגמה

אתה יכול להשתמש בקובץ `NEW_VEHICLES_SEED.sql` או להריץ את seed.ts script.

## כיצד להשתמש בנתונים

### קריאת יצרנים

```typescript
import { getAllManufacturers } from '@modules/new-vehicles/lib/repository';

const manufacturers = await getAllManufacturers();
// => Array of ManufacturerWithCounts
```

### קריאת דגמים של יצרן

```typescript
import { getManufacturerBySlug } from '@modules/new-vehicles/lib/repository';

const manufacturer = await getManufacturerBySlug('bmw');
// => ManufacturerWithModels with nested models array
```

### קריאת פרטי רכב (Trim Level)

```typescript
import { getTrimLevelWithSpecs } from '@modules/new-vehicles/lib/repository';

const trimWithSpecs = await getTrimLevelWithSpecs(trimId);
// => TrimLevelWithSpecifications with specifications array
```

### חיפוש רכבים

```typescript
import { searchVehicles, searchVehiclesByText } from '@modules/new-vehicles/lib/repository';

// חיפוש לפי קריטריונים
const results = await searchVehicles({
  fuel_type: 'Electric',
  min_price: 100000,
  max_price: 500000,
});

// חיפוש טקסטי
const results = await searchVehiclesByText('Tesla');
```

## עמודים

### `/new-vehicles`
עמוד ראשי עם רשת יצרנים. מציג:
- לוגו יצרן
- שם יצרן
- מספר דגמים
- מספר רמות גימור

### `/new-vehicles/[manufacturer]`
עמוד יצרן ספציפי עם:
- לוגו ושם יצרן
- תיאור היצרן
- רשת דגמים
- קישורים לעמודי דגמים

### `/new-vehicles/[manufacturer]/[model]`
עמוד דגם עם:
- תמונה דגם
- בחירת רמת גימור (tabs)
- פרטי רכב מלאים
- צפיית מפרטים וטבלה של מונחים טכניים

## API Routes

כרגע אין API routes ייעודיות - הכל נעשה דרך Server Components וSupabase queries.

אם אתה רוצה להוסיף API routes בעתיד:

```typescript
// src/app/api/new-vehicles/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  const results = await searchVehiclesByText(query);
  return Response.json(results);
}
```

## סוגים (Types)

### Manufacturer
```typescript
type Manufacturer = {
  id: string;
  name: string;
  slug: string;
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
```

### Model
```typescript
type Model = {
  id: string;
  manufacturer_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  body_type: string | null;
  segment: string | null;
  year_from: number | null;
  year_to: number | null;
  base_price: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
```

### TrimLevel
```typescript
type TrimLevel = {
  id: string;
  model_id: string;
  name: string;
  slug: string;
  price: number;
  transmission: string | null;
  engine_type: string | null;
  fuel_type: string | null;
  power_hp: number | null;
  torque_nm: number | null;
  acceleration_0_100: number | null;
  top_speed: number | null;
  fuel_consumption: number | null;
  co2_emissions: number | null;
  body_dimensions: {
    length?: number;
    width?: number;
    height?: number;
    wheelbase?: number;
  } | null;
  weight: number | null;
  seats: number | null;
  doors: number | null;
  trunk_volume: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
```

## דוגמה: הוספת רכב חדש

### 1. הוסף יצרן

```sql
INSERT INTO new_vehicles_manufacturers (
  name, slug, logo_url, description, country, display_order
) VALUES (
  'Tesla',
  'tesla',
  'https://www.tesla.com/logo.svg',
  'חברת כלי רכב חשמליים',
  'United States',
  4
);
```

### 2. קבל את ה-ID של היצרן

```sql
SELECT id FROM new_vehicles_manufacturers WHERE slug = 'tesla';
```

### 3. הוסף דגם

```sql
INSERT INTO new_vehicles_models (
  manufacturer_id, name, slug, image_url, body_type, base_price, display_order
) VALUES (
  '{MANUFACTURER_ID}',
  'Model 3',
  'model-3',
  'https://example.com/model-3.jpg',
  'Sedan',
  200000,
  1
);
```

### 4. קבל את ה-ID של הדגם

```sql
SELECT id FROM new_vehicles_models WHERE slug = 'model-3';
```

### 5. הוסף רמת גימור

```sql
INSERT INTO new_vehicles_trim_levels (
  model_id, name, slug, price, engine_type, transmission, 
  power_hp, acceleration_0_100, fuel_consumption, seats, doors
) VALUES (
  '{MODEL_ID}',
  'RWD',
  'rwd',
  200000,
  'Electric',
  'Automatic',
  350,
  5.8,
  0,
  5,
  4
);
```

## דוקומנטציה נוספת

ראה גם:
- `NEW_VEHICLES_PLAN.md` - תוכנית הפיתוח המלאה
- `NEW_VEHICLES_DATABASE_SCHEMA.md` - דוקומנטציה של ה-schema
- `SUPABASE_SETUP_GUIDE.md` - הוראות התקנה בSupabase

## הערות חשובות

### Slugs
- יצרנים: lowercase, עם מינוסים (e.g., "mercedes-benz")
- דגמים: lowercase, עם מינוסים (e.g., "3-series")
- רמות גימור: lowercase, עם מינוסים (e.g., "m-sport")

### Performance
- כל העמודים משתמשים בServer Components לביצועים אופטימליים
- Views בSQL משמשים לשאילתות מורכבות
- יש indexes על כל ה-foreign keys

### SEO
- כל עמוד משתמש ב-metadata לSEO
- slugs נוצרים להיות ידידותיים ל-URLs

### אבטחה
- כל הנתונים קראים על ידי הציבור (RLS אינו מוגבל)
- כדי לאפשר כתיבה, תוסיף RLS policies בSupabase
