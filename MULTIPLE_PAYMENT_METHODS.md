# 💳 מדריך אמצעי תשלום מרובים

## 🎯 סקירה כללית

המערכת תומכת באמצעי תשלום מרובים:

| אמצעי תשלום | זמינות | הגדרה נדרשת | עמלה |
|------------|---------|-------------|------|
| **💳 כרטיס אשראי** | ✅ מובנה | לא | ~2.9% + ₪1.2 |
| **💙 PayPal** | ✅ דרך Stripe | כן | ~3.4% + ₪1.2 |
| **🍎 Apple Pay** | ✅ אוטומטי | לא | כמו כרטיס |
| **📱 Google Pay** | ✅ אוטומטי | לא | כמו כרטיס |
| **🟠 Bit** | 🚧 בפיתוח | - | - |

---

## 1️⃣ כרטיס אשראי (Card)

### ✅ פעיל כברירת מחדל

אין צורך בהגדרה נוספת. תומך ב:
- Visa
- Mastercard
- American Express
- ישראכרט
- כרטיסי חיוב ישראליים

### כרטיסי בדיקה:
```
מספר: 4242 4242 4242 4242
תוקף: כל תאריך עתידי
CVV: כל 3 ספרות
```

---

## 2️⃣ PayPal

### הפעלה ב-Stripe:

#### שלב 1: הפעל PayPal ב-Stripe Dashboard
1. היכנס ל-[Stripe Dashboard](https://dashboard.stripe.com)
2. **Settings** → **Payment methods**
3. חפש **PayPal** ולחץ **Enable**
4. עבור את תהליך האימות עם PayPal
5. אשר את החיבור

#### שלב 2: וודא שהוא מופעל בקוד

ב-`src/core/config/site.config.ts`:

```typescript
payment: {
  availableMethods: [
    'card',
    'paypal',  // ✅ וודא שזה כאן
    // ...
  ],
  stripe: {
    enablePayPal: true,  // ✅ וודא שזה true
  },
}
```

### איך זה עובד:
1. לקוח בוחר PayPal
2. לוחץ "שלם"
3. מועבר לדף PayPal
4. מאשר תשלום
5. חוזר לאתר עם אישור

### בדיקה:
- צור חשבון PayPal Sandbox: https://developer.paypal.com
- השתמש בחשבון הבדיקה בתהליך התשלום

---

## 3️⃣ Apple Pay

### הפעלה אוטומטית! 🎉

Apple Pay **פועל אוטומטית** במכשירי Apple:
- iPhone עם Touch ID / Face ID
- iPad עם Touch ID / Face ID
- Mac עם Touch ID
- Safari בלבד

### דרישות:
✅ HTTPS (חובה - לא עובד ב-HTTP)
✅ כרטיס שמור ב-Wallet
✅ דפדפן Safari או In-App Browser של iOS

### אין צורך בהגדרה נוספת!

הכפתור מופיע אוטומטית רק במכשירים תומכים.

---

## 4️⃣ Google Pay

### הפעלה אוטומטית! 🎉

Google Pay **פועל אוטומטית** במכשירי Android:
- Android עם Google Pay מותקן
- Chrome בכל מכשיר
- כרטיס שמור ב-Google Pay

### דרישות:
✅ HTTPS (חובה)
✅ כרטיס שמור ב-Google Pay
✅ Chrome או In-App Browser של Android

### אין צורך בהגדרה נוספת!

הכפתור מופיע אוטומטית רק במכשירים תומכים.

---

## 5️⃣ Bit (בפיתוח)

### אופציה 1: דרך Stripe (לא זמין עדיין)
Stripe עדיין לא תומך בביט באופן מובנה.

### אופציה 2: API ישיר של Bit

#### הצטרף לשירות Bit Business:
1. צור קשר עם Bit: https://www.bit.co.il/business
2. פתח חשבון עסקי
3. קבל API credentials

#### התקנה:
```bash
npm install bit-payment-sdk
```

#### הטמעה (דוגמה):
```typescript
import { BitPayment } from 'bit-payment-sdk';

const bitClient = new BitPayment({
  apiKey: process.env.BIT_API_KEY,
  merchantId: process.env.BIT_MERCHANT_ID,
});

// Create payment
const payment = await bitClient.createPayment({
  amount: 100.00,
  currency: 'ILS',
  description: 'הזמנה #12345',
  callback_url: 'https://yoursite.com/api/bit/callback',
});

// Redirect to Bit
window.location.href = payment.payment_url;
```

**סטטוס**: 🚧 בפיתוח - ממתין ל-API של Bit

---

## 🎛️ התאמה אישית לכל לקוח

### הפעלה/כיבוי של אמצעי תשלום

ערוך `src/core/config/site.config.ts`:

```typescript
// דוגמה: רק כרטיס אשראי
payment: {
  availableMethods: ['card'],
}

// דוגמה: הכל מלבד PayPal
payment: {
  availableMethods: ['card', 'apple_pay', 'google_pay'],
}

// דוגמה: כל האפשרויות
payment: {
  availableMethods: ['card', 'paypal', 'apple_pay', 'google_pay'],
}
```

---

## 🧪 בדיקת אמצעי תשלום

### כרטיס אשראי:
```
מספר: 4242 4242 4242 4242 ✅ הצלחה
מספר: 4000 0000 0000 0002 ❌ נדחה
```

### PayPal:
- בtest mode: השתמש בחשבון sandbox
- בlive mode: חשבון PayPal אמיתי

### Apple Pay / Google Pay:
- בtest mode: כרטיס test שמור בWallet
- בlive mode: כרטיס אמיתי

---

## 💰 השוואת עמלות

| אמצעי תשלום | עמלת Stripe | עמלה נוספת | סה"כ |
|------------|-------------|-----------|------|
| כרטיס אשראי | 2.9% + ₪1.2 | - | 2.9% + ₪1.2 |
| PayPal | 2.9% + ₪1.2 | ~0.5% | ~3.4% + ₪1.2 |
| Apple Pay | 2.9% + ₪1.2 | - | 2.9% + ₪1.2 |
| Google Pay | 2.9% + ₪1.2 | - | 2.9% + ₪1.2 |

**💡 טיפ**: Apple Pay ו-Google Pay אין להם עמלה נוספת!

---

## 🔒 אבטחה

כל אמצעי התשלום:
- ✅ מוצפנים ב-SSL/TLS
- ✅ PCI DSS Compliant
- ✅ לא שומרים פרטי כרטיס בשרת
- ✅ Tokenization מובנה
- ✅ 3D Secure (כשנדרש)

---

## 📱 תמיכה במכשירים

| אמצעי תשלום | Desktop | iOS | Android |
|------------|---------|-----|---------|
| כרטיס אשראי | ✅ | ✅ | ✅ |
| PayPal | ✅ | ✅ | ✅ |
| Apple Pay | ⚠️ Safari + Mac | ✅ | ❌ |
| Google Pay | ✅ Chrome | ❌ | ✅ |

---

## 🌍 תמיכה בינלאומית

### מטבעות נתמכים:
- ✅ ILS (שקלים)
- ✅ USD (דולר)
- ✅ EUR (יורו)
- ✅ GBP (ליש"ט)
- ✅ 135+ מטבעות נוספים

### שינוי מטבע:

ב-`src/core/config/site.config.ts`:
```typescript
payment: {
  currency: 'USD',        // שנה ל-USD
  currencySymbol: '$',    // שנה ל-$
}
```

---

## 🆘 פתרון בעיות

### Apple Pay לא מופיע:
- ✅ HTTPS חייב להיות מופעל
- ✅ בדוק שיש כרטיס שמור ב-Wallet
- ✅ נסה רק ב-Safari
- ✅ וודא שהמכשיר תומך (Touch ID/Face ID)

### Google Pay לא מופיע:
- ✅ HTTPS חייב להיות מופעל
- ✅ בדוק שיש כרטיס שמור ב-Google Pay
- ✅ נסה ב-Chrome
- ✅ Android 5.0+ נדרש

### PayPal לא עובד:
- ✅ וודא שהפעלת PayPal ב-Stripe Dashboard
- ✅ בדוק שהשלמת את תהליך ה-onboarding
- ✅ במצב test - השתמש בחשבון sandbox

---

## 📊 דוחות ומעקב

כל התשלומים מתועדים ב-Stripe Dashboard:

1. **Payments** → רשימת כל התשלומים
2. **Customers** → לקוחות ותשלומים שלהם
3. **Reports** → דוחות פיננסיים
4. **Balances** → יתרות והעברות

סינון לפי אמצעי תשלום:
- Dashboard → Payments → Filter → Payment method

---

## 🎨 התאמת עיצוב

### שינוי סדר האפשרויות:

ב-`MultiPaymentForm.tsx` או ב-`checkout/page.tsx`:

```typescript
<MultiPaymentForm
  availableMethods={[
    'card',      // ראשון - ברירת מחדל
    'paypal',    // שני
    'apple_pay', // שלישי
    'google_pay' // רביעי
  ]}
/>
```

### שינוי צבעים של כפתורים:

ב-`PaymentMethodSelector.tsx` ערוך את ה-colors.

---

## ✅ Checklist להשקה

לפני שמפעילים את המערכת ב-production:

- [ ] הפעלת כל אמצעי התשלום הרצויים ב-Stripe
- [ ] בדיקת תשלום מלא בכל אמצעי תשלום
- [ ] החלפת Test keys ב-Live keys
- [ ] הגדרת webhooks ב-production
- [ ] בדיקה במכשירים שונים (iOS, Android, Desktop)
- [ ] אימות SSL/HTTPS
- [ ] בדיקת תהליך החזרות (refunds)
- [ ] הגדרת התראות במייל ב-Stripe

---

## 📚 מקורות נוספים

- [Stripe Payment Methods](https://stripe.com/docs/payments/payment-methods)
- [Apple Pay Integration](https://stripe.com/docs/apple-pay)
- [Google Pay Integration](https://stripe.com/docs/google-pay)
- [PayPal Integration](https://stripe.com/docs/payments/paypal)
- [Bit Business](https://www.bit.co.il/business)

---

## 🎉 סיכום

✅ **מערכת תשלום מלאה עם:**
- 💳 כרטיסי אשראי
- 💙 PayPal
- 🍎 Apple Pay
- 📱 Google Pay
- 🎛️ התאמה אישית מלאה
- 🔒 אבטחה מקסימלית

**זמן הטמעה**: 30-60 דקות (תלוי באמצעי התשלום)
