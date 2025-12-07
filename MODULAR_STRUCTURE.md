# מבנה מודולרי - Modular Architecture

## 📋 סקירה כללית

הפרויקט עבר ארכיטקטורה מודולרית המאפשרת הרחבה קלה והוספת מודולים חדשים.

---

## 🏗️ מבנה התיקיות

```
src/
├── core/                           # ליבה משותפת - שימוש על ידי כל המודולים
│   ├── config/
│   │   ├── site.config.ts          # הגדרות כלליות (שם אתר, יצירת קשר, SEO)
│   │   └── theme.config.ts         # עיצוב (צבעים, פונטים, מרחקים)
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client configuration
│   │   └── constants.ts            # קבועים גלובליים (ROUTES, APP_CONFIG)
│   └── types/
│       └── common.ts               # Types משותפים לכל הפרויקט
│
├── shared/                         # קומפוננטות וקוד משותף
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # כותרת האתר (ניווט)
│   │   │   ├── Footer.tsx          # Footer עם קישורים ויצירת קשר
│   │   │   └── Container.tsx       # Wrapper עם padding מותאם
│   │   └── ui/                     # UI components בסיסיים (עתידי)
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Card.tsx
│   ├── hooks/                      # Custom React hooks משותפים
│   └── utils/
│       ├── formatting.ts           # עזריות format (מחיר, תאריכים, וכו')
│       └── theme.ts                # עזריות theme (getColor, getSpacing)
│
├── modules/                        # מודולים עצמאיים
│   ├── vehicles/                   # 🚗 מודול רכבים
│   │   ├── components/
│   │   │   ├── VehicleCard.tsx
│   │   │   ├── VehicleGrid.tsx
│   │   │   ├── VehicleFilters.tsx
│   │   │   ├── FilterableVehicleGrid.tsx
│   │   │   └── VehicleImageGallery.tsx
│   │   ├── api/                    # (עתידי) API utilities specific to vehicles
│   │   ├── lib/
│   │   │   └── repository.ts       # Data access layer לרכבים
│   │   ├── types/                  # (עתידי) Vehicle-specific types
│   │   └── config/                 # (עתידי) Vehicle module config
│   │
│   ├── products/                   # 🛍️ מודול מוצרים (עתידי)
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductFilters.tsx
│   │   ├── api/
│   │   ├── lib/
│   │   │   └── repository.ts
│   │   └── types/
│   │
│   └── cart/                       # 🛒 מודול עגלת קניות (עתידי)
│       ├── components/
│       │   ├── CartSummary.tsx
│       │   ├── CartItem.tsx
│       │   └── CheckoutForm.tsx
│       ├── lib/
│       │   └── cartLogic.ts
│       └── types/
│
└── app/                            # Next.js App Router
    ├── layout.tsx                  # Root layout (משתמש ב-shared + core)
    ├── page.tsx                    # דף הבית
    ├── globals.css                 # Global styles
    │
    ├── vehicles/                   # Routes לרכבים
    │   ├── page.tsx                # רשימת רכבים
    │   └── [slug]/page.tsx         # פרטי רכב
    │
    ├── products/                   # Routes למוצרים (עתידי)
    │   ├── page.tsx
    │   └── [slug]/page.tsx
    │
    └── api/
        ├── vehicles/               # API endpoints לרכבים
        │   └── [id]/route.ts
        ├── products/               # API למוצרים (עתידי)
        └── webhooks/
            └── vehicles/
                └── route.ts        # Webhook מ-Zoho
```

---

## 🎯 עקרונות המבנה

### 1. **Separation of Concerns**
כל מודול עצמאי ומכיל את הכל שהוא צריך:
- Components
- API logic
- Data access (repository)
- Types
- Config

### 2. **Reusability**
קוד משותף (Header, Footer, utils) נמצא ב-`shared/` ונגיש לכל המודולים.

### 3. **Scalability**
הוספת מודול חדש פשוטה:
```bash
mkdir -p src/modules/new-module/{components,api,lib,types,config}
```

### 4. **Type Safety**
TypeScript paths מוגדרים ב-`tsconfig.json`:
```json
{
  "@core/*": ["./src/core/*"],
  "@shared/*": ["./src/shared/*"],
  "@modules/*": ["./src/modules/*"]
}
```

---

## 📦 דוגמאות שימוש

### Import מ-Core
```typescript
import { APP_CONFIG } from '@core/lib/constants';
import { dealershipConfig } from '@core/config/site.config';
```

### Import מ-Shared
```typescript
import { Header } from '@shared/components/layout/Header';
import { formatPrice } from '@shared/utils/formatting';
```

### Import ממודול ספציפי
```typescript
import { Vehicle } from '@modules/vehicles/lib/repository';
import { VehicleCard } from '@modules/vehicles/components/VehicleCard';
```

---

## 🚀 הוספת מודול חדש

### שלב 1: צור מבנה תיקיות
```bash
mkdir -p src/modules/products/{components,api,lib,types,config}
```

### שלב 2: צור repository
```typescript
// src/modules/products/lib/repository.ts
import { createServerSupabaseClient } from '@core/lib/supabase';

export type Product = {
  id: string;
  name: string;
  price: number;
  // ...
};

export async function getProducts(): Promise<Product[]> {
  const client = createServerSupabaseClient();
  const { data } = await client.from('products').select('*');
  return data ?? [];
}
```

### שלב 3: צור components
```typescript
// src/modules/products/components/ProductCard.tsx
import { Product } from '@modules/products/lib/repository';
import { formatPrice } from '@shared/utils/formatting';

export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{formatPrice(product.price)}</p>
    </div>
  );
}
```

### שלב 4: צור pages
```typescript
// src/app/products/page.tsx
import { getProducts } from '@modules/products/lib/repository';
import { ProductCard } from '@modules/products/components/ProductCard';
import { Header } from '@shared/components/layout/Header';

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <>
      <Header />
      <div>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
```

---

## 🔄 מיגרציה מהמבנה הישן

המבנה הישן:
```
src/
├── components/layout/
├── components/vehicles/
├── lib/
└── config/
```

המבנה החדש:
```
src/
├── core/                   # lib + config
├── shared/                 # components/layout + utils
└── modules/vehicles/       # components/vehicles + repository
```

---

## ✅ יתרונות

### עבור Developer
- **ארגון ברור** - קל למצוא קוד
- **Type Safety** - Imports עם autocomplete
- **Isolation** - שינוי במודול אחד לא משפיע על אחר

### עבור הפרויקט
- **קל להוסיף תכונות** - מודול חדש = תיקייה חדשה
- **קל לתחזק** - כל מודול עצמאי
- **קל להסיר** - מחק תיקייה = מחק מודול

### עבור Team
- **עבודה מקבילית** - כל אחד על מודול אחר
- **Code Review קל** - שינויים ממוקדים
- **Onboarding מהיר** - מבנה ברור

---

## 📝 Best Practices

### 1. **אל תיצור dependencies בין מודולים**
❌ **לא טוב:**
```typescript
// modules/products/lib/repository.ts
import { Vehicle } from '@modules/vehicles/lib/repository';
```

✅ **טוב:**
```typescript
// shared/types/common.ts
export type BaseEntity = {
  id: string;
  created_at: string;
};

// modules/products/lib/repository.ts
import { BaseEntity } from '@shared/types/common';
```

### 2. **שתף קוד דרך shared/**
❌ **לא טוב:**
```typescript
// Duplicate formatting logic in each module
```

✅ **טוב:**
```typescript
// shared/utils/formatting.ts
export function formatPrice(price: number) { /*...*/ }
```

### 3. **השתמש ב-core/ לקונפיגורציה גלובלית**
```typescript
// core/config/site.config.ts
export const siteConfig = {
  name: 'My Site',
  email: 'info@example.com',
};
```

---

## 🎓 סיכום

המבנה המודולרי מאפשר:
- ✅ הוספת מודולים חדשים בקלות (products, cart, blog, וכו')
- ✅ עבודה מקבילית של מספר developers
- ✅ תחזוקה קלה וארגון ברור
- ✅ Scalability לפרויקטים גדולים

**הפרויקט כעת מוכן להרחבה עם מודולים נוספים!** 🚀

