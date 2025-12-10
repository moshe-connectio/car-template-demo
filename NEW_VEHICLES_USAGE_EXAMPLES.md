# דוגמאות שימוש - מודול רכבים חדשים

## 1. קריאת יצרנים בעמוד

```typescript
// src/app/new-vehicles/page.tsx
import { getAllManufacturers } from '@modules/new-vehicles/lib/repository';
import { ManufacturerGrid } from '@modules/new-vehicles/components/ManufacturerGrid';

export default async function NewVehiclesPage() {
  const manufacturers = await getAllManufacturers();

  return (
    <div>
      <h1>רכבים חדשים</h1>
      <ManufacturerGrid manufacturers={manufacturers} />
    </div>
  );
}
```

## 2. קריאת דגמים של יצרן

```typescript
// src/app/new-vehicles/[manufacturer]/page.tsx
import { getManufacturerBySlug } from '@modules/new-vehicles/lib/repository';
import { ModelGrid } from '@modules/new-vehicles/components/ModelGrid';

export default async function ManufacturerPage({
  params,
}: {
  params: Promise<{ manufacturer: string }>;
}) {
  const { manufacturer } = await params;
  const manufacturerData = await getManufacturerBySlug(manufacturer);

  if (!manufacturerData) {
    return <div>לא נמצא</div>;
  }

  return (
    <div>
      <h1>{manufacturerData.name}</h1>
      <ModelGrid
        models={manufacturerData.models}
        manufacturerSlug={manufacturerData.slug}
      />
    </div>
  );
}
```

## 3. קריאת רמות גימור של דגם

```typescript
// src/app/new-vehicles/[manufacturer]/[model]/page.tsx
import { getModelBySlug } from '@modules/new-vehicles/lib/repository';

export default async function ModelPage({
  params,
}: {
  params: Promise<{ manufacturer: string; model: string }>;
}) {
  const { manufacturer, model } = await params;
  const modelData = await getModelBySlug(manufacturer, model);

  if (!modelData) {
    return <div>דגם לא נמצא</div>;
  }

  return (
    <div>
      <h1>{modelData.name}</h1>
      <p>רמות גימור זמינות: {modelData.trim_levels.length}</p>
      {modelData.trim_levels.map((trim) => (
        <div key={trim.id}>
          <h3>{trim.name}</h3>
          <p>מחיר: ₪{trim.price.toLocaleString('he-IL')}</p>
        </div>
      ))}
    </div>
  );
}
```

## 4. קריאת פרטי רכב מלאים

```typescript
// לקבל פרטי רמה מסוימת עם כל המפרטים
import { getTrimLevelWithSpecs } from '@modules/new-vehicles/lib/repository';

const trimWithDetails = await getTrimLevelWithSpecs('trim-id-here');

console.log(trimWithDetails.name); // "Sport"
console.log(trimWithDetails.price); // 165000
console.log(trimWithDetails.power_hp); // 330
console.log(trimWithDetails.specifications); // Array of specs
```

## 5. חיפוש רכבים לפי קריטריונים

```typescript
import { searchVehicles } from '@modules/new-vehicles/lib/repository';

// חיפוש רכבים חשמליים בטווח מחירים
const results = await searchVehicles({
  fuel_type: 'Electric',
  min_price: 150000,
  max_price: 500000,
});

console.log(results.manufacturers); // יצרנים תואמים
console.log(results.models); // דגמים תואמים
console.log(results.trim_levels); // רמות גימור תואמות
console.log(results.total_count); // סה"כ
```

## 6. חיפוש טקסטי

```typescript
import { searchVehiclesByText } from '@modules/new-vehicles/lib/repository';

const results = await searchVehiclesByText('Tesla Model 3');

results.manufacturers; // יצרנים שתואמים לחיפוש
results.models; // דגמים שתואמים
results.trim_levels; // רמות גימור שתואמות
```

## 7. יצירת API route לחיפוש

```typescript
// src/app/api/new-vehicles/search/route.ts
import { searchVehiclesByText } from '@modules/new-vehicles/lib/repository';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return Response.json(
      { error: 'Query too short' },
      { status: 400 }
    );
  }

  const results = await searchVehiclesByText(query);
  return Response.json(results);
}

// שימוש:
// GET /api/new-vehicles/search?q=Tesla
```

## 8. דוגמה: Component עם חיפוש

```typescript
// src/modules/new-vehicles/components/SearchVehicles.tsx
'use client';

import { useState } from 'react';
import type { SearchResult } from '../types';

export function SearchVehicles() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q: string) => {
    if (q.length < 2) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/new-vehicles/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="חפש רכבים..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
      />

      {loading && <p>טוען...</p>}

      {results && (
        <>
          <div>
            <h3>יצרנים ({results.manufacturers.length})</h3>
            {results.manufacturers.map((m) => (
              <div key={m.id}>{m.name}</div>
            ))}
          </div>

          <div>
            <h3>דגמים ({results.models.length})</h3>
            {results.models.map((m) => (
              <div key={m.id}>{m.name}</div>
            ))}
          </div>

          <div>
            <h3>רמות גימור ({results.trim_levels.length})</h3>
            {results.trim_levels.map((t) => (
              <div key={t.id}>{t.name} - ₪{t.price}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

## 9. דוגמה: עמוד השוואה (Comparison)

```typescript
// src/modules/new-vehicles/components/ComparisonView.tsx
'use client';

import type { TrimLevel } from '../types';

interface ComparisonViewProps {
  trims: TrimLevel[];
}

export function ComparisonView({ trims }: ComparisonViewProps) {
  return (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>תכונה</th>
            {trims.map((t) => (
              <th key={t.id}>{t.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>מחיר</td>
            {trims.map((t) => (
              <td key={t.id}>₪{t.price.toLocaleString('he-IL')}</td>
            ))}
          </tr>
          <tr>
            <td>כוח</td>
            {trims.map((t) => (
              <td key={t.id}>{t.power_hp} hp</td>
            ))}
          </tr>
          <tr>
            <td>צריכה</td>
            {trims.map((t) => (
              <td key={t.id}>{t.fuel_consumption} L/100km</td>
            ))}
          </tr>
          <tr>
            <td>מושבים</td>
            {trims.map((t) => (
              <td key={t.id}>{t.seats}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

## 10. דוגמה: Sidebar עם סינון

```typescript
// src/modules/new-vehicles/components/FilterSidebar.tsx
'use client';

import { useState } from 'react';
import { searchVehicles } from '../lib/repository';
import type { SearchFilters } from '../types';

export function FilterSidebar() {
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleFilterChange = async (key: keyof SearchFilters, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // חפש עם הפילטרים החדשים
    const results = await searchVehicles(newFilters);
    // עדכן את התוצאות ב-UI
  };

  return (
    <aside className="w-64 border-l border-gray-200 p-4">
      <h3 className="mb-4 text-lg font-bold">סנן</h3>

      <div className="space-y-4">
        <div>
          <label>סוג דלק</label>
          <select
            onChange={(e) =>
              handleFilterChange('fuel_type', e.target.value)
            }
          >
            <option value="">כל הסוגים</option>
            <option value="Petrol">בנזין</option>
            <option value="Diesel">דיזל</option>
            <option value="Hybrid">היברידי</option>
            <option value="Electric">חשמלי</option>
          </select>
        </div>

        <div>
          <label>טווח מחיר</label>
          <input
            type="number"
            placeholder="מחיר מינימום"
            onChange={(e) =>
              handleFilterChange('min_price', Number(e.target.value))
            }
          />
          <input
            type="number"
            placeholder="מחיר מקסימום"
            onChange={(e) =>
              handleFilterChange('max_price', Number(e.target.value))
            }
          />
        </div>

        <div>
          <label>תיבת הילוכים</label>
          <select
            onChange={(e) =>
              handleFilterChange('transmission', e.target.value)
            }
          >
            <option value="">כל הסוגים</option>
            <option value="Manual">ידני</option>
            <option value="Automatic">אוטומטי</option>
            <option value="CVT">CVT</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
```

## 11. קבלת סטטיסטיקות

```typescript
import { getStatistics } from '@modules/new-vehicles/lib/repository';

const stats = await getStatistics();

console.log(stats.manufacturers); // 45
console.log(stats.models); // 250
console.log(stats.trim_levels); // 1250
```

## 12. Meta Tags עבור SEO

```typescript
// src/app/new-vehicles/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'רכבים חדשים | חנותנו',
  description: 'גלה את רכבים חדשים שנמכרים בישראל',
  keywords: ['רכבים חדשים', 'דגמים', 'מחירים'],
  openGraph: {
    title: 'רכבים חדשים',
    description: 'גלה רכבים חדשים',
    url: 'https://example.com/new-vehicles',
    type: 'website',
  },
};
```

---

## טיפים חשובים

1. **תמיד אשתמש ב-Server Components** לקריאת נתונים מבודד
2. **Use Client Components** רק לinteractivity (filters, search)
3. **Memoize את המנות** כדי למנוע renders לא צריכים
4. **Optimize images** עם `next/image`
5. **Add loading states** כדי משהו בזמן טעינה
6. **Error handling** - תמיד תתמודד עם שגיאות

---

## Common Patterns

### Server + Client Hybrid

```typescript
// Server Component
async function ParentPage() {
  const data = await fetchData();
  return <ClientChild data={data} />;
}

// Client Component
function ClientChild({ data }) {
  const [filtered, setFiltered] = useState(data);
  return <div>{/* interactive UI */}</div>;
}
```

### Dynamic Routes עם Slugs

```typescript
// כל slug מוביל לעמוד ייחודי
/new-vehicles/bmw           → ManufacturerPage
/new-vehicles/bmw/3-series  → ModelPage
```
