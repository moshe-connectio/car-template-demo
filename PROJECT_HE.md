# תבנית סוכנות רכב - סקירת פרויקט (PROJECT_HE)

## 📋 תיאור הפרויקט

תבנית אתר חוזרת לשימוש עבור סוכנויות רכב ועסקים אחרים בתחום כלי רכב, בנויה עם **Next.js**, **TypeScript**, ו-**Tailwind CSS**. התבנית מופצה ב-**Vercel** עם **Supabase** (PostgreSQL) כמסד הנתונים הראשי של היישום.

**אינטגרציות עתידיות:** התכנון לשלב עם Zoho CRM בשלבים מאוחרים יותר.

---

## 🏗️ Stack טכנולוגי

- **Front-end:** Next.js 16.0.7 (App Router, Turbopack), TypeScript, Tailwind CSS v4
- **Back-end:** Node.js (API routes של Next.js, webhooks)
- **מסד נתונים:** Supabase (PostgreSQL) עם אחסון
- **הפצה:** Vercel (ISR 60 שניות)
- **אינטגרציית CRM:** Zoho CRM (דרך webhooks)

---

## 📁 מבנה הפרויקט

```
src/
├── app/
│   ├── globals.css                    # עיצוב גלובלי + CSS variables של design system
│   ├── layout.tsx                     # Layout ראשי (עברית RTL)
│   ├── page.tsx                       # דף הבית
│   ├── api/
│   │   ├── vehicles/[id]/route.ts     # API - קבל רכב אחד לפי ID
│   │   └── webhooks/
│   │       └── vehicles/route.ts      # Webhook API ליצירה/עדכון רכב מ-Zoho
│   ├── demo/
│   │   └── vehicles/page.tsx          # דף דמו המציג רכבים מ-DB
│   └── vehicles/
│       ├── page.tsx                   # דף ראשי של רכבים (עם ISR וסינונים)
│       └── [slug]/page.tsx            # דף פרטי של רכב בודד
├── components/
│   ├── layout/
│   │   ├── Container.tsx              # Wrapper עם מרחקים אופטימליים RTL
│   │   ├── Header.tsx                 # כותרת האתר עם ניווט
│   │   └── Footer.tsx                 # footer עם קישורים ופרטי קשר
│   └── vehicles/
│       ├── FilterableVehicleGrid.tsx  # קומפוננטה עם לוגיקת סינון
│       ├── VehicleCard.tsx            # כרטיס רכב בודד (עם RTL)
│       ├── VehicleFilters.tsx         # UI של סינונים (מותג, קטגוריות, חיפוש)
│       ├── VehicleGrid.tsx            # רשת responsive של רכבים
│       └── VehicleImageGallery.tsx    # קרוסלת תמונות ממוזערות
├── config/
│   └── dealership.config.ts           # הגדרות סוכנות (שם, יצירת קשר, עיצוב, וכו')
├── lib/
│   ├── supabaseServerClient.ts        # Client Supabase לצד שרת בלבד
│   ├── vehiclesRepository.ts          # Data Access Layer - כל פעולות הרכבים
│   ├── constants.ts                   # קבועים וערכים קבועים
│   └── utils.ts                       # עזריות (formatting, URLs)
└── styles/
    └── theme.ts                       # Design tokens (צבעים, מרחקים, טיפוגרפיה)
```

---

## 🗄️ סכמת מסד הנתונים

### טבלה `public.vehicles`

| עמודה | סוג | הגבלות | תיאור |
|-------|-----|--------|-------|
| `id` | uuid | PK, default: gen_random_uuid() | זהות ייחודית |
| `created_at` | timestamptz | default: now() | חותמת יצירה |
| `updated_at` | timestamptz | default: now() | חותמת עדכון אחרון |
| `is_published` | boolean | default: true | האם פעיל/מוצג |
| `external_id` | text | nullable | ID מ-מערכת חיצונית |
| `crmid` | text | nullable, unique | ID מ-Zoho (לעדכון דרך webhook) |
| `slug` | text | unique | כתובת ידידותית ל-URL |
| `title` | text | not null | שם/כותרת הרכב |
| `brand` | text | not null | מותג (לדוגמה: טויוטה, BMW) |
| `model` | text | not null | דגם (לדוגמה: Camry, i4) |
| `year` | integer | not null | שנת ייצור |
| `price` | numeric(12,2) | not null | מחיר בש״ח |
| `km` | integer | nullable | קילומטראז' |
| `gear_type` | text | nullable | סוג תמסורת (אוטומט, ידני) |
| `fuel_type` | text | nullable | סוג דלק (בנזין, דיזל, חשמלי, היברידי) |
| `condition` | text | check constraint | מצב: 'חדש', '0 ק״מ', 'משומש' |
| `trim` | text | nullable | גימור (לדוגמה: Premium, Sport) |
| `hand` | integer | 1-10, nullable | יד (1 = ראשונה) |
| `categories` | text[] | default: '{}' | מערך קטגוריות |
| `main_image_url` | text | nullable | כתובת תמונה ראשית |
| `short_description` | text | nullable | תיאור קצר |
| `raw_data` | jsonb | nullable | נתונים נוספים בפורמט JSON |

### טבלה `public.vehicle_images`

| עמודה | סוג | הגבלות | תיאור |
|-------|-----|--------|-------|
| `id` | uuid | PK | זהות ייחודית |
| `vehicle_id` | uuid | FK → vehicles(id) | קישור לרכב |
| `image_url` | text | not null | כתובת התמונה (מ-Supabase Storage) |
| `position` | integer | 1-10 | מיקום בגלריה (1 = ראשית) |
| `alt_text` | text | nullable | טקסט חלופי של התמונה |
| `uploaded_at` | timestamptz | default: now() | חותמת העלאה |

### Bucket אחסון `vehicle-images` ב-Supabase Storage

- **סוג:** Bucket ציבורי
- **מבנה נתיב:** `vehicles/{id-suffix}/{position}-{timestamp}.{ext}`
- **דוגמה:** `vehicles/2fa4c18e/1-1764867249536.jpg`

---

## 🔌 אינטגרציית Webhook

### Endpoint
```
POST /api/webhooks/vehicles
```

### Pattern: UPSERT by CRMID

- **אם `crmid` לא קיים** → יוצרים רכב חדש
- **אם `crmid` קיים** → עדכון הרכב הקיים
- **לא ניתן לשכפל** אם `crmid` כבר קיים

### Payload דוגמה

```json
{
  "crmid": "ZOHO-DEAL-12345",
  "data": {
    "slug": "tesla-model-3-2024",
    "title": "טסלה Model 3 2024",
    "brand": "Tesla",
    "model": "Model 3",
    "year": 2024,
    "price": 85000,
    "is_published": true,
    "condition": "0 ק״מ",
    "hand": 1,
    "km": 0,
    "gear_type": "תמסורת ישירה",
    "fuel_type": "חשמלי",
    "categories": ["חשמלי", "ספורט"],
    "short_description": "טסלה Model 3 חדשה במחיר תחרותי"
  },
  "images": [
    {
      "image_url": "https://workdrive.zohoexternal.com/external/...",
      "position": 1,
      "alt_text": "תמונה קדמית"
    }
  ]
}
```

---

## 🖼️ טיפול בתמונות

### מקורות תמונות נתמכים

1. **Zoho WorkDrive** - HTML parsing לחילוץ download URL
2. **Google Drive** - המרה למודל download ישיר
3. **Supabase Storage** - העלאה ישירה (להעלאה ישירה)

### זרימת עיבוד

1. הורדה מהמקור
2. חילוץ שם קובץ מ-Content-Disposition header
3. העלאה ל-Supabase Storage בנתיב: `vehicles/{id-suffix}/`
4. שמירת URL בטבלת `vehicle_images`

### אופטימיזציות

- עיבוד תמונות **במקביל** (Promise.all) להאצת זמן עיבוד
- מחיקה של תמונות ישנות בעת עדכון רכב
- תמיכה ב-8-17 תמונות לכל רכב

---

## 📊 מדדי ביצוע

### ISR (Incremental Static Regeneration)

- **דף בית:** 3600 שניות (1 שעה)
- **רשימת רכבים:** 60 שניות (1 דקה)
- **פרטי רכב:** 300 שניות (5 דקות)

### Webhook

- **Timeout:** 60 שניות (Vercel)
- **עיבוד תמונות:** מקבילי
- **תמיכה:** עד 17 תמונות לרכב

---

## 🔒 אבטחה

### Webhook
- אימות CRM ID ייחודות
- סניטיזציה של input
- Validation של שדות חוקיים

### מסד נתונים
- Row Level Security (RLS)
- Foreign keys
- Check constraints

### Storage
- Supabase Storage public bucket
- URLs חתומים למשך מגביל

---

## 🎯 Features עיקריים

✅ Upsert by CRMID (אין דוברים)  
✅ RTL full support (עברית ממיושרת)  
✅ Zoho WorkDrive integration  
✅ Parallel image processing  
✅ Hebrew condition + hand normalization  
✅ SEO-friendly slugs  
✅ Advanced filtering (brand, categories, search)  
✅ Responsive design  
✅ ISR for performance  

---

## 📅 עדכונים אחרונים

**7 בדצמבר 2025:**
- ✅ תיקון lang="he" ו-dir="rtl" ב-layout
- ✅ הוספת Rubik font לעברית
- ✅ תיקון RTL styling בקומפוננטות
- ✅ תיעוד בעברית מלא

**5 בדצמבר 2025:**
- ✅ עיבוד תמונות במקביל
- ✅ Normalization של condition ו-hand fields
- ✅ Timeout handling (60 שניות)

**November 2025:**
- ✅ Zoho WorkDrive HTML parsing
- ✅ Image upload optimization

---

**נוצר על ידי:** Moshe (moshe@connectio.dev)  
**גרסה:** 1.0.0  
**ליצנס:** פרטי

