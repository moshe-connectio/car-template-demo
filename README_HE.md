# תבנית אתר סוכנות רכב - Car Dealership Template

פלטפורמה מודרנית וחזקה לאתרי סוכנויות רכב בנויה עם **Next.js 16**, **Tailwind CSS**, ו-**Supabase**.

🌍 **[English Version →](./README.md)**

---

## 🎯 תכונות עיקריות

✅ **רשימות רכבים דינמיות** עם סינון מתקדם (מותג, קטגוריות, חיפוש טקסט)  
✅ **כתובות ידידותיות ל-SEO** בפורמט slug: `{שם}-{שנה}-{id}`  
✅ **גלריית תמונות** עם הורדה אוטומטית מ-Zoho WorkDrive והעלאה ל-Supabase  
✅ **תמיכה בקטגוריות מרובות** (15 קטגוריות כולל יוקרה, 4x4, ספורט, וכו')  
✅ **ניהול רכבים שנמכרו** עם הסתרה אוטומטית של רכבים לא פעילים  
✅ **אינטגרציה עם Zoho CRM** דרך Webhook עם שדה `crmid` ייחודי  
✅ **עיצוב רספונסיבי** מותאם לנייד ושולחן עבודה  
✅ **Incremental Static Regeneration (ISR)** לטעינה מהירה  
✅ **תמיכה RTL מלאה** עברית ממיושרת כמו שצריך  

---

## 🛠 Stack טכנולוגי

| תחום | טכנולוגיה |
|------|----------|
| **פרונט-אנד** | Next.js 16.0.7 (עם Turbopack) |
| **שפה** | TypeScript |
| **עיצוב** | Tailwind CSS v4 + CSS Variables |
| **מסד נתונים** | Supabase (PostgreSQL) |
| **אחסון תמונות** | Supabase Storage |
| **הפצה** | Vercel |
| **CRM** | Zoho CRM (דרך Webhooks) |

---

## 📋 מבנה הפרויקט

```
src/
├── app/
│   ├── api/
│   │   ├── vehicles/[id]/route.ts           # API - קבל רכב אחד
│   │   └── webhooks/
│   │       └── vehicles/route.ts            # Webhook - יצור/עדכן רכב
│   ├── vehicles/
│   │   ├── page.tsx                         # דף רשימת הרכבים (עם סינונים)
│   │   └── [slug]/page.tsx                  # דף פרטי הרכב
│   ├── layout.tsx                           # Layout ראשי
│   ├── page.tsx                             # דף הבית
│   └── globals.css                          # עיצוב גלובלי + design tokens
├── components/
│   ├── layout/
│   │   ├── Container.tsx                    # Wrapper למרחק אופטימלי
│   │   ├── Header.tsx                       # כותרת האתר
│   │   └── Footer.tsx                       # footer עם קישורים וקשר
│   └── vehicles/
│       ├── FilterableVehicleGrid.tsx        # לוגיקת סינון
│       ├── VehicleCard.tsx                  # כרטיס רכב בודד
│       ├── VehicleFilters.tsx               # ממשק סינון (מותג, קטגוריות, חיפוש)
│       ├── VehicleGrid.tsx                  # רשת מרובעת של רכבים
│       └── VehicleImageGallery.tsx          # קרוסלת תמונות
├── config/
│   └── dealership.config.ts                 # הגדרות סוכנות ותצורה כללית
├── lib/
│   ├── constants.ts                         # קבועים וערכים קבועים
│   ├── supabaseServerClient.ts              # לקוח Supabase לצד שרת
│   ├── utils.ts                             # עזריות formatting ו-URLs
│   └── vehiclesRepository.ts                # Data Access Layer
└── styles/
    └── theme.ts                             # Tailwind design tokens

public/
├── vehicles/
│   ├── images/                              # תמונות מקומיות (אופציונלי)
│   └── thumbnails/                          # תמונות ממוזערות (אופציונלי)
```

---

## 🚀 התחלה מהירה

### דרישות מוקדמות
- **Node.js 18+** ו-npm/yarn
- **Supabase** - פרויקט עם טבלאות `vehicles` ו-`vehicle_images`
- **משתנים סביבה** מוגדרים כמתואר בהמשך

### התקנה

1. **שכפל את המאגר:**
```bash
git clone https://github.com/moshe-connectio/car-template-demo.git
cd car-template-demo
```

2. **התקן תלויות:**
```bash
npm install
```

3. **צור קובץ `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
WEBHOOK_SECRET=your-secret-key
```

4. **הרץ את שרת הפיתוח:**
```bash
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000) בדפדפן.

---

## 📚 תיעוד

- **[PROJECT.md](./PROJECT.md)** - סקירת פרויקט וטכנולוגיות
- **[WEBHOOK_DOCS.md](./WEBHOOK_DOCS.md)** - דוקומנטציה API Webhook מלאה
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - מבנה מסד הנתונים
- **[DATABASE_MIGRATION_CATEGORY.md](./DATABASE_MIGRATION_CATEGORY.md)** - הגדרת מערכת קטגוריות
- **[IMAGES_IMPLEMENTATION_GUIDE.md](./IMAGES_IMPLEMENTATION_GUIDE.md)** - טיפול בתמונות
- **[CODE_REVIEW.md](./CODE_REVIEW.md)** - ביקורת קוד וסיכום האיכות

---

## 🔌 אינטגרציה Webhook

שלח נתוני רכב דרך webhook ליצירה או עדכון רכב:

### דוגמה בסיסית:
```bash
curl -X POST "https://your-site.com/api/webhooks/vehicles" \
  -H "Content-Type: application/json" \
  -d '{
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
      "categories": ["חשמלי", "ספורט"]
    },
    "images": [
      {
        "image_url": "https://workdrive.zohoexternal.com/external/...",
        "position": 1,
        "alt_text": "תמונה קדמית"
      }
    ]
  }'
```

### שדות חוקיים:

#### שדות חובה:
- `slug` - כתובת SEO (לדוגמה: `tesla-model-3`)
- `title` - שם הרכב
- `brand` - מותג (לדוגמה: Tesla, BMW)
- `model` - דגם (לדוגמה: Model 3, i4)
- `year` - שנת ייצור
- `price` - מחיר בשקל
- `is_published` - האם פעיל (`true`/`false`)

#### שדות אופציונליים:
- `condition` - מצב הרכב: `'חדש'` | `'0 ק״מ'` | `'משומש'`
- `trim` - גימור (לדוגמה: Premium, Sport)
- `hand` - יד (1-10, כאשר 1 = ראשונה)
- `km` - קילומטראז'
- `gear_type` - תמסורת (אוטומט, ידני, וכו')
- `fuel_type` - סוג דלק (בנזין, דיזל, חשמלי, היברידי)
- `categories` - מערך קטגוריות
- `short_description` - תיאור קצר
- `raw_data` - נתונים נוספים כ-JSON

ראה [WEBHOOK_DOCS.md](./WEBHOOK_DOCS.md) לדוקומנטציה מלאה.

---

## 🎨 התאמה אישית

### שינוי צבעי עיצוב

עדכן `src/config/dealership.config.ts`:

```typescript
export const dealershipConfig = {
  business: {
    name: 'סוכנות הרכבים שלי',
    description: 'תיאור קצר',
    // ... שדות נוספים
  },
  contact: {
    phone: '+972-50-XXX-XXXX',
    email: 'info@example.com',
    // ... תלונים נוספים
  },
};
```

### שינוי קטגוריות

עדכן את הקטגוריות בקובץ `WEBHOOK_DOCS.md` וב-`vehiclesRepository.ts`:

```typescript
export const VEHICLE_CATEGORIES = [
  'סדאן', 'SUV', 'קופה', 'ספורט', '4x4',
  // הוסף קטגוריות נוספות כמו שצריך
];
```

---

## 🌐 הפצה ל-Production

### Vercel (מומלץ)

1. חבר את מאגר GitHub ל-Vercel
2. הוסף משתנים סביבה בדאשבורד Vercel
3. הפצה אוטומטית בעת דחיפה ל-main

**קונפיגורציה חשובה:**
```json
{
  "functions": {
    "api/webhooks/**": {
      "maxDuration": 60
    }
  }
}
```

### הפצה ידנית

```bash
npm run build
npm start
```

---

## 📊 תכונות מפורטות

### כתובות ידידותיות ל-SEO
- פורמט: `{שם}-{שנה}-{id-suffix}`
- דוגמה: `tesla-model-3-2024-a1b2c3d4`
- עזריות: `generateVehicleSlug()`, `extractIdFromSlug()`

### ניהול תמונות
- הורדה אוטומטית מ-Zoho WorkDrive
- העלאה ל-Supabase Storage
- מבנה תיקייה: `vehicles/{id-suffix}/`
- כתובות ציבוריות מאוחסנות בבסיס הנתונים

### סינון מתקדם
- סינון לפי מותג (dropdown)
- בחירה רב-ערכית של קטגוריות (עם חיפוש)
- חיפוש טקסט בשדות שונים
- הצגת "מציג X מתוך Y רכבים"

### קטגוריות
- 15 קטגוריות נתמכות
- כל רכב יכול להיות בקטגוריות מרובות
- מאוחסן כ-array של strings בבסיס הנתונים

---

## 🔐 אבטחה

### Webhook Security
- מאמת את `crmid` ייחודות
- בדוק `WEBHOOK_SECRET` בבקשות
- סניטיזציה של input
- HTTPS בלבד ב-production

### מסד נתונים
- טבלאות עם RLS (Row Level Security)
- מפתחות זרים לאימות רלציות
- Constraints לבדיקת אינטגריטי

---

## 🐛 פתרון בעיות

### תמונות לא מופיעות
- וודא credentials Supabase ב-`.env.local`
- בדוק שהרשאות של Zoho URLs נכונות
- וודא שהגדרות `remotePatterns` בـ `next.config.ts`

### Webhook לא עובד
- וודא שה-`crmid` ייחודי
- בדוק שהנקודה זמינה
- בדוק הודעות שגיאה בתגובה

### סינון לא עובד
- וודא שיש עמודת `categories` בטבלה
- בדוק שערכי הקטגוריות תואמים בבסיס הנתונים

---

## 📊 משתנים סביבה

| משתנה | תיאור |
|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | כתובת פרויקט Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | מפתח אנונימי של Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | מפתח service role (צד שרת) |
| `NEXT_PUBLIC_SITE_URL` | כתובת אתר (לISR) |
| `WEBHOOK_SECRET` | סוד לאימות webhook |

---

## 📧 הנושא ותמיכה

לשאלות ובעיות, בדוק את קבצי התיעוד או צור קשר עם הצוות.

---

## 📄 רישיון

פרויקט פרטי. כל הזכויות שמורות.

---

**עדכון אחרון:** 7 בדצמבר 2025  
**גרסה:** 1.0.0  
**מטפל:** Moshe (moshe@connectio.dev)

