# רכבים חדשים - Checklist ובדיקות

## ✅ בדיקות שיש לעשות לפני הלייב

### 1. Database Setup ✓
- [ ] יצור טבלאות בSupabase
  - [ ] `new_vehicles_manufacturers`
  - [ ] `new_vehicles_models`
  - [ ] `new_vehicles_trim_levels`
  - [ ] `new_vehicles_specifications`
  - [ ] `new_vehicles_model_images`

- [ ] בדוק שה-Views נוצרו:
  - [ ] `manufacturers_with_counts`
  - [ ] `models_with_manufacturer`
  - [ ] `trim_levels_full_info`

- [ ] הוסף sample data
  - [ ] לפחות 5 יצרנים
  - [ ] לפחות 10 דגמים
  - [ ] לפחות 20 רמות גימור

### 2. Routes & Navigation ✓
- [ ] `/new-vehicles` משתמש וניתן לגישה
- [ ] `/new-vehicles/[manufacturer]` עובד עם דוגמה
- [ ] `/new-vehicles/[manufacturer]/[model]` עובד עם דוגמה
- [ ] Breadcrumb navigation עובד בכל עמוד
- [ ] Back buttons עובדים

### 3. Components ✓
- [ ] ManufacturerGrid מציג את היצרנים
- [ ] ModelGrid מציג את הדגמים
- [ ] TrimLevelSelector מציג את רמות הגימור
- [ ] VehicleSpecifications מציג את הפרטים
- [ ] Loading states מופיעים

### 4. Design & Responsiveness ✓
- [ ] Mobile (< 640px) עובד
  - [ ] ManufacturerGrid 2 columns
  - [ ] ModelGrid 1 column
  - [ ] Text קריא
  - [ ] ללא scroll אופקי

- [ ] Tablet (640-1024px) עובד
  - [ ] ManufacturerGrid 3 columns
  - [ ] ModelGrid 2 columns
  - [ ] Layout balanced

- [ ] Desktop (> 1024px) עובד
  - [ ] ManufacturerGrid 5 columns
  - [ ] ModelGrid 3 columns
  - [ ] Sidebar layout

### 5. SEO & Metadata ✓
- [ ] Meta title יש לכל עמוד
- [ ] Meta description יש לכל עמוד
- [ ] Open Graph images מוגדרות
- [ ] Slugs בפורמט נכון (lowercase, hyphens)
- [ ] Schema.org markup (אופציונלי)

### 6. Performance ✓
- [ ] Pages לוקחים < 2 seconds להטעין
- [ ] Images אופטימיזציה (next/image)
- [ ] No console errors
- [ ] No broken images
- [ ] Database queries מהירות

### 7. User Experience ✓
- [ ] Clicking on manufacturer → goes to /new-vehicles/[slug]
- [ ] Clicking on model → goes to /new-vehicles/[mfg]/[model]
- [ ] Links לא broken
- [ ] Error screens יפים
- [ ] No 404s (or proper 404 page)

### 8. Data Validation ✓
- [ ] No NULL values בשדות חשובים
- [ ] Prices תצוגה נכונה
- [ ] Images טוען
- [ ] Slugs unique (אין duplicates)

### 9. Navigation Integration ✓
- [ ] Add link to main header
- [ ] Link in footer
- [ ] Update sitemap (אם יש)
- [ ] Update robots.txt (אם צריך)

### 10. Testing Scenarios ✓

**Scenario 1: Browse All Manufacturers**
```
1. Go to /new-vehicles
2. See grid of manufacturers
3. Click on one → see models
4. Click on model → see trim levels
5. Click back → return to previous
```

**Scenario 2: Deep Link**
```
1. Direct link: /new-vehicles/bmw/3-series
2. Page loads without error
3. Can see all trim levels
4. Can click specs
```

**Scenario 3: Search (if implemented)**
```
1. Use search to find "Tesla"
2. Results show Tesla manufacturer
3. Can click to view models
```

**Scenario 4: Mobile Navigation**
```
1. On mobile, navigate with breadcrumbs
2. Touch targets are large (> 48px)
3. Text is readable
4. No horizontal scroll
```

---

## 📋 Files Checklist

### Module Files ✓
- [x] `src/modules/new-vehicles/types/index.ts` - Types
- [x] `src/modules/new-vehicles/lib/repository.ts` - Database queries
- [x] `src/modules/new-vehicles/lib/constants.ts` - Constants
- [x] `src/modules/new-vehicles/lib/seed.ts` - Seed script
- [x] `src/modules/new-vehicles/components/ManufacturerGrid.tsx`
- [x] `src/modules/new-vehicles/components/ModelGrid.tsx`
- [x] `src/modules/new-vehicles/components/TrimLevelSelector.tsx`
- [x] `src/modules/new-vehicles/components/VehicleSpecifications.tsx`
- [x] `src/modules/new-vehicles/README.md` - Module docs

### Pages ✓
- [x] `src/app/new-vehicles/page.tsx` - Main page
- [x] `src/app/new-vehicles/layout.tsx` - Layout
- [x] `src/app/new-vehicles/[manufacturer]/page.tsx` - Manufacturer page
- [x] `src/app/new-vehicles/[manufacturer]/[model]/page.tsx` - Model page

### Documentation ✓
- [x] `NEW_VEHICLES_PLAN.md` - Planning document
- [x] `NEW_VEHICLES_IMPLEMENTATION_SUMMARY.md` - What was built
- [x] `NEW_VEHICLES_FINAL_SUMMARY.md` - Final summary
- [x] `NEW_VEHICLES_DATABASE_SCHEMA.sql` - Schema docs
- [x] `NEW_VEHICLES_MIGRATION.sql` - Migration file
- [x] `NEW_VEHICLES_SEED_DATA.sql` - Sample data
- [x] `SUPABASE_SETUP_GUIDE.md` - Setup guide
- [x] `NEW_VEHICLES_USAGE_EXAMPLES.md` - Code examples

---

## 🔧 Troubleshooting

### Problem: "טבלאות לא נמצאות"
**Solution:**
1. בדוק שהבצעת את ALL commands מ-NEW_VEHICLES_MIGRATION.sql
2. בדוק שלא היו שגיאות בSupabase Console
3. רענן את הדף

### Problem: "עמוד ריק / טוען עד הנצח"
**Solution:**
1. בדוק שדיג database עוד לא הוסף
2. בדוק console for errors
3. בדוק שSupabase connection עובדת

### Problem: "תמונות לא טוענות"
**Solution:**
1. בדוק URL של תמונה
2. בדוק שהIP/domain not blocked
3. בדוק CORS settings בSupabase

### Problem: "Design לא responsive"
**Solution:**
1. בדוק browser width
2. בדוק Tailwind CSS טוען
3. בדוק שnext.config.ts עדכון

---

## 🚀 Before Going Live Checklist

- [ ] All tests pass
- [ ] No console errors
- [ ] No broken links
- [ ] Performance acceptable
- [ ] SEO meta tags
- [ ] Error handling
- [ ] Mobile responsive
- [ ] Accessibility (a11y)
- [ ] Security (no SQL injection, XSS)
- [ ] Analytics tracking (optional)
- [ ] Backup created
- [ ] Rollback plan ready

---

## 📊 Data Requirements

To fully populate the module with 1250 vehicles:

**Format needed:**
```csv
manufacturer_name, slug, model_name, model_slug, trim_name, trim_slug, price, engine_type, power_hp, ...
BMW, bmw, 3 Series, 3-series, Sport, sport, 165000, Petrol, 330, ...
```

**Sources:**
- [ ] Car manufacturer websites
- [ ] Automotive databases (e.g., edmunds.com, cars.com)
- [ ] Local Israeli dealers
- [ ] CSV export from existing system

---

## 🎓 Learning Resources

- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs

---

## 📞 Support

If you encounter issues:

1. Check the documentation files first
2. Look at code examples
3. Review Supabase logs
4. Check Next.js console
5. Google the error message

---

**Status: READY FOR TESTING** ✅
