git clone https://github.com/moshe-connectio/car-template-demo.git
# Car Template Demo – E‑Commerce (Next.js + Supabase + Stripe)

Template חנות מלאה בעברית (RTL) עם קטלוג מוצרים, חיפוש חכם, ותשלומים מאובטחים (Stripe: כרטיס אשראי, PayPal, Apple/Google Pay). פרוס ב‑Vercel, עם Supabase כ‑DB ו‑Storage.

## 🎯 מה יש כאן
- 🛍️ קטלוג מוצרים עם סינון: קטגוריות, תגיות, מחיר, מיון
- 🔍 חיפוש חכם בעברית (כסא/כיסא, אותיות סופיות) + שדה `search_keywords`
- 🛒 עגלת קניות + Checkout מלא
- 💳 תשלומים מאובטחים (Stripe) + Webhooks
- 🖼️ גלריות תמונות למוצרים
- ⚡ Next.js 16 (App Router) עם ISR
- 🎨 RTL מלא + Tailwind v4

## 🛠 טכנולוגיות
- Next.js 16, TypeScript, Tailwind v4
- Supabase (PostgreSQL + Storage)
- Stripe Payments (Card / PayPal / Apple Pay / Google Pay)
- Vercel Deployments (ISR)

## 🧭 מבנה הפרויקט (רלוונטי)
```
src/
  app/                # דפים ו-API Routes
    products/         # קטלוג ודף מוצר
    cart/             # עגלה
    checkout/         # תשלום + success
    api/payment/      # Stripe create-intent + webhook
    api/webhooks/     # Products webhook
  core/               # קונפיג גלובלי, Supabase client
  modules/products/   # לוגיקת מוצרים, רכיבים ו-types
  shared/             # קומפוננטות משותפות, utils, חנות Zustand
public/vehicles/      # תמונות
```

## 🚀 הפעלה מהירה
```bash
git clone https://github.com/moshe-connectio/car-template-demo.git
cd car-template-demo
npm install
cp .env.local.example .env.local   # מלא מפתחות Supabase + Stripe
npm run dev
# http://localhost:3000
```

### .env.local (חובה)
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🧱 בסיס נתונים (Supabase)
- טבלאות: `products`, `categories`, `product_images`
- שדות מפתח במוצרים: `name`, `slug`, `price`, `compare_at_price`, `category_id`, `tags[]`, `search_keywords`, `is_published`
- Webhooks למוצרים: `/api/webhooks/products`

## 💳 תשלומים (Stripe)
- יצירת Intent: `/api/payment/create-intent`
- Webhook אישורים: `/api/payment/webhook`
- UI: `shared/components/payment/*`, `checkout/page.tsx`
- קונפיג: `src/core/config/site.config.ts` → `payment.availableMethods = ['card','paypal','apple_pay','google_pay']`

## 🔍 חיפוש חכם
- Normalization בעברית (`shared/utils/search.ts`): אותיות סופיות, י' כפולה, כסא/כיסא
- שדה `search_keywords` לתמיכה בווריאציות איות
- מדריך: `SMART_SEARCH_GUIDE.md`, `SEARCH_KEYWORDS_GUIDE.md`

## 📦 דיפלוי
- מהיר: `DEPLOYMENT_QUICK.md`
- מלא: `DEPLOYMENT_GUIDE.md`
- משתני סביבה ב‑Vercel זהים ל`.env.local`
- Webhook Stripe: `https://your-domain.com/api/payment/webhook`

## 📚 מפת מסמכים (canonical)
- `PROJECT_SUMMARY.md` – תמונת מצב מלאה של מה שנבנה (מוצר + תשלום + חיפוש)
- `DEPLOYMENT_QUICK.md` / `DEPLOYMENT_GUIDE.md` – דפלוי ל‑Vercel
- `STRIPE_SETUP_GUIDE.md` / `MULTIPLE_PAYMENT_METHODS.md` / `PAYMENT_INTEGRATION_GUIDE.md` – תשלומים
- `SMART_SEARCH_GUIDE.md` / `SEARCH_KEYWORDS_GUIDE.md` – חיפוש ו‑SEO
- `MODULAR_STRUCTURE.md` – ארכיטקטורה מודולרית
- `DATABASE_SCHEMA.md` – סכימת DB (Supabase)
- `WEBHOOK_DOCS.md` / `PRODUCTS_WEBHOOK.md` – Webhooks
- `IMAGES_IMPLEMENTATION_GUIDE.md` / `LOCAL_IMAGES_GUIDE.md` / `VEHICLE_IMAGES_SUMMARY.md` – תמונות
- Legacy/Old overviews: `PROJECT.md`, `PROJECT_HE.md`, `README_HE.md`, `REVIEW_SUMMARY.md`, `CODE_REVIEW.md` (השאירו לעיון, אך הסיכום העדכני הוא `PROJECT_SUMMARY.md`).

## 🧪 בדיקות מהירות
1) `npm run build` – צריך לעבור נקי
2) בדיקת תשלום ב‑Stripe test: כרטיס `4242 4242 4242 4242`
3) חיפוש "כסא" צריך להחזיר מוצרים עם "כיסא"

## 🆘 תקלות נפוצות
- Build נופל ב‑Vercel → ודא כל ה‑env של Stripe/Supabase קיימים
- תשלום נכשל → בדוק מפתחות Live/Test ו‑Webhook Secret
- חיפוש לא מחזיר תוצאות → מלא `search_keywords` או בדוק tags/קטגוריות

## 📞 צוות
- Repo: https://github.com/moshe-connectio/car-template-demo
- Deploy: Vercel (main branch auto-deploy)

**Last Updated:** December 7, 2025 – מצב עדכני: Production Ready
