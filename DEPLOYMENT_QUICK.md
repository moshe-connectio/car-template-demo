# 🚀 Vercel Deployment Quick Start

## ⚡ בדקה אחת - דפלוי מהיר

### 1️⃣ היכנס לVERCEL
→ https://vercel.com

### 2️⃣ לחץ **Add New** → **Project**

### 3️⃣ בחר **GitHub** ו**Import** את הrepo:
```
moshe-connectio/car-template-demo
```

### 4️⃣ הגדרות בפרויקט:
- **Framework Preset**: Next.js (אוטומטי)
- **Root Directory**: `./`

### 5️⃣ **Environment Variables** - הוסף את המשתנים:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 6️⃣ לחץ **Deploy** 🎉

---

## 📝 אחרי הדפלוי:

### ✅ בדוק שהכל עובד:
1. פתח את ה-URL שלך
2. נסה לנווט במוצרים
3. עשה בדיקת תשלום (Test Mode בStripe)

### ✅ הגדר Webhook:
1. Stripe Dashboard → Webhooks
2. Add endpoint
3. URL: `https://your-domain.vercel.app/api/payment/webhook`
4. Copy את ה-secret ל-Vercel Environment Variables

### ✅ בדוק Logs:
```bash
vercel logs
```

---

## 🎯 תוך 5 דקות:

- ✅ Vercel מדפלה את הפרויקט
- ✅ Site בחיים
- ✅ HTTPS + CDN אוטומטי
- ✅ אפשרות להוסיף Domain משלך

---

## 💡 טיפ: Auto-Deploy

כל push ל-GitHub = Vercel מדפלה אוטומטי!

```bash
git add .
git commit -m "update: add new feature"
git push origin main
# Vercel מתחילה דפלוי באופן אוטומטי ✨
```

---

**הכל מוכן! דפלוי עכשיו ב-Vercel!** 🚀
