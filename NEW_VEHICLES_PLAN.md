# תוכנית פיתוח מודול רכבים חדשים (New Vehicles Module)

## תיאור כללי
מודול רכבים חדשים שמציג ~1250 רכבים חדשים שנמכרים בישראל, בהיררכיה של יצרן → דגם → רמת גימור.

## שלבי הפיתוח

### שלב 1: הגדרת מבנה התסריט וסוגים (Types & Schema)
**מטרה**: הגדרת המבנה של הנתונים בבסיס הנתונים וטיפוסים ב-TypeScript

**משימות**:
- [ ] יצירת תיקייה `src/modules/new-vehicles`
- [ ] יצירת קובץ `types/index.ts` עם:
  - `Manufacturer` - יצרן עם לוגו וקטגוריות לא ממוספרות
  - `ManufacturerModel` - דגם יצרן עם תמונה בסיסית
  - `TrimLevel` - רמת גימור בלי תמונה
  - `NewVehicle` - מכונית שלמה עם כל הנתונים
  - `VehicleSpecification` - פרטי הרכב (מידות, משקל, צריכת דלק, ביצועים וכו')
  
- [ ] יצירת קובץ `config/manufacturers.ts` עם:
  - הגדרות של כל יצרן
  - URL לוגו
  - תיאור

### שלב 2: אחסון נתונים
**מטרה**: החלטה האם להשתמש בבסיס נתונים, JSON, או קבצי נתונים סטטיים

**אפשרויות**:
- [ ] A: Supabase tables (דומה לתשתית הקיימת)
- [ ] B: JSON seed file + TypeScript
- [ ] C: Hybrid - בסיס נתונים עם seed

**בחירה מוצעת**: אפשרות A (Supabase) כדי לשמור על עיקביות עם יתר המערכת

**משימות**:
- [ ] יצירת migration ב-Supabase:
  - `new_vehicles_manufacturers` - יצרנים
  - `new_vehicles_models` - דגמים
  - `new_vehicles_trim_levels` - רמות גימור
  - `new_vehicles_specifications` - פרטי רכב
  
- [ ] seed script כדי להכניס את כל 1250 הרכבים

### שלב 3: ריפוזיטורי (Repository Layer)
**מטרה**: יצירת שכבת אחזור נתונים

**קובץ**: `lib/repository.ts`

**פונקציות**:
- [ ] `getAllManufacturers()` - רשימת כל היצרנים עם לוגו
- [ ] `getManufacturerModels(manufacturerId)` - דגמים של יצרן מסוים
- [ ] `getModelTrimLevels(modelId)` - רמות גימור של דגם
- [ ] `getTrimSpecifications(trimId)` - פרטי הרכב של רמת גימור
- [ ] `searchVehicles(query)` - חיפוש במערכת

### שלב 4: רכיבים (Components)
**מטרה**: רכיבי UI לתצוגה השונות

**תוכן**: `components/`

**רכיבים**:
- [ ] `ManufacturerGrid.tsx` - רשת יצרנים עם לוגו
  - כל רכיב מציג: לוגו + שם יצרן
  - כל קליק מעביר לעמוד של היצרן
  
- [ ] `ModelGrid.tsx` - רשת דגמים לתוך יצרן
  - כל רכיב מציג: תמונה דגם + שם דגם
  - כל קליק מעביר לעמוד של הדגם
  
- [ ] `TrimLevelSelector.tsx` - בחירת רמת גימור
  - tabs או buttons להחלפה בין רמות
  - ללא תמונות (כמו בMobile UI)
  
- [ ] `VehicleSpecifications.tsx` - תצוגת פרטי הרכב
  - טבלה או רשימה עם כל הפרטים
  - תמונה אופציונלית אם קיימת
  
- [ ] `ComparisonView.tsx` (אופציונלי) - השוואת רמות גימור

### שלב 5: עמודים (Pages)
**מטרה**: יצירת עמודים בתמונת הראות

**תוכן**: `src/app/new-vehicles/`

**עמודים**:
- [ ] `/new-vehicles` - עמוד ראשי עם רשת יצרנים
  - מציג את כל היצרנים
  - אפשרות חיפוש/סינון
  - navigation breadcrumbs
  
- [ ] `/new-vehicles/[manufacturer]` - עמוד יצרן
  - שם היצרן + לוגו
  - רשת דגמים של היצרן
  - sidebar עם יצרנים נוספים
  
- [ ] `/new-vehicles/[manufacturer]/[model]` - עמוד דגם
  - שם דגם + תמונה בסיסית
  - tabs/buttons לבחירת רמת גימור
  - פרטי הרכב המלאים
  - CTA buttons (קבל מחיר, בקש הצעה, etc.)

### שלב 6: שירותים ופונקציות עזר
**מטרה**: פונקציות עזר ללוגיקה עסקית

**קבצים**:
- [ ] `lib/utils.ts`
  - Format price
  - Format specifications
  - Search/filter logic
  
- [ ] `lib/constants.ts`
  - רשימת יצרנים
  - רשימת תכונות וקטגוריות

### שלב 7: עיצוב ותאימות (Styling & Responsiveness)
**מטרה**: עיצוב יפה לכל גדלי מסכים

**משימות**:
- [ ] טאבלט - מעבר בין רמות גימור בקלות
- [ ] סלולר - תצוגה מובילה עם פרטים מתחת
- [ ] דסקטופ - layout מלא עם sidebar ודטיילס

### שלב 8: בדיקות ובדיקות קצה (Testing & QA)
**משימות**:
- [ ] בדיקת navigation בין כל העמודים
- [ ] בדיקת חיפוש
- [ ] בדיקת תצוגה בכל גדלי מסכים
- [ ] בדיקת סטיות של נתונים

---

## ארכיטקטורה המודול

```
src/modules/new-vehicles/
├── api/                          # API routes אם צריך
│   └── search/
├── components/
│   ├── ManufacturerGrid.tsx
│   ├── ModelGrid.tsx
│   ├── TrimLevelSelector.tsx
│   ├── VehicleSpecifications.tsx
│   └── ComparisonView.tsx
├── config/
│   └── manufacturers.ts
├── lib/
│   ├── repository.ts
│   ├── utils.ts
│   └── constants.ts
└── types/
    └── index.ts

src/app/new-vehicles/
├── page.tsx                      # עמוד ראשי - יצרנים
├── [manufacturer]/
│   ├── page.tsx                  # עמוד יצרן - דגמים
│   └── [model]/
│       └── page.tsx              # עמוד דגם - רמות גימור + פרטים
└── layout.tsx                    # layout משותף
```

---

## טכנולוגיות

- **Frontend**: React, Next.js, TypeScript
- **Styling**: Tailwind CSS (כמו בפרויקט הקיים)
- **Database**: Supabase (PostgreSQL)
- **Data Management**: Server Components + ISR (Incremental Static Regeneration)

---

## משך הפיתוח המשוער

| שלב | הערכה |
|------|----------|
| 1 | 1-2 שעות |
| 2 | 2-3 שעות |
| 3 | 1-2 שעות |
| 4 | 4-6 שעות |
| 5 | 3-4 שעות |
| 6 | 1-2 שעות |
| 7 | 2-3 שעות |
| 8 | 2-3 שעות |
| **סה"כ** | **16-25 שעות** |

---

## הערות חשובות

1. **מידע ההתחלה**: צריך לאסוף את רשימת כל 1250 הרכבים עם:
   - שם יצרן
   - לוגו יצרן
   - שם דגם
   - תמונה דגם
   - רמות גימור
   - מפרט כל רמה (מחיר, מנוע, צריכה, וכו')

2. **ביצועים**: יש לשקול:
   - Caching עבור יצרנים ודגמים
   - ISR עבור עמודים סטטיים יותר
   - Pagination אם יש הרבה רמות גימור

3. **SEO**: כל דגם וכל יצרן צריך:
   - Meta description
   - Open Graph images
   - Structured data (Schema.org)

4. **CMS Integration**: אם תרצה לעדכן נתונים בהמשך - שקול עניין של יציאה לbuild process אוסינכרון live עם Supabase.
