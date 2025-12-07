# מדריך שילוב תשלומים מאובטחים

## אפשרות 1: Stripe (בינלאומי, הכי קל)

### יתרונות Stripe:
- ✅ אבטחה מלאה מובנית
- ✅ API פשוט וברור
- ✅ דף תשלום מוכן (Checkout)
- ✅ תמיכה בכל כרטיסי האשראי
- ✅ תמיכה ב-Apple Pay, Google Pay
- ✅ ניהול מנויים
- ✅ לא צריך להתעסק עם אבטחה

### התקנה:

```bash
npm install stripe @stripe/stripe-js
```

### 1. צור חשבון Stripe
1. הירשם ב-https://stripe.com
2. קבל את ה-API Keys (test mode)
3. הוסף ל-.env.local:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 2. צור Checkout Session (API Route)

```typescript
// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    // צור session של תשלום
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'ils', // שקלים
          product_data: {
            name: item.name,
            description: item.description,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // אגורות
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      shipping_address_collection: {
        allowed_countries: ['IL'], // ישראל בלבד
      },
      locale: 'he', // עברית
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 3. דף התשלום (Cart Page)

```typescript
// src/app/cart/page.tsx
'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@shared/store/cart';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
  const { items } = useCart();

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    
    // קרא ל-API שלך
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    const { sessionId } = await response.json();

    // העבר ל-Stripe Checkout
    const result = await stripe!.redirectToCheckout({ sessionId });

    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <div>
      {/* רשימת מוצרים בעגלה */}
      <button onClick={handleCheckout}>
        מעבר לתשלום מאובטח 🔒
      </button>
    </div>
  );
}
```

### 4. דף הצלחה

```typescript
// src/app/success/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // נקה עגלה
    localStorage.removeItem('cart');
    
    // שלח מייל אישור (webhook)
    // שמור הזמנה במסד נתונים
  }, []);

  return (
    <div className="text-center py-20">
      <h1>התשלום בוצע בהצלחה! ✅</h1>
      <p>מספר הזמנה: {sessionId}</p>
    </div>
  );
}
```

---

## אפשרות 2: Tranzila (ישראלי)

### יתרונות Tranzila:
- ✅ ישראלי, תמיכה בעברית
- ✅ מכיר כל הבנקים בישראל
- ✅ תשלומים, קרדיט
- ✅ אפשר להטמיע בעמוד

### התקנה בסיסית:

```typescript
// src/app/api/tranzila/route.ts
export async function POST(req: Request) {
  const { amount, items } = await req.json();
  
  const params = new URLSearchParams({
    supplier: process.env.TRANZILA_TERMINAL!,
    sum: amount.toString(),
    currency: '1', // שקלים
    cred_type: '1', // רגיל
    tranmode: 'VK', // אימות בלבד
    success_url_address: `${process.env.NEXT_PUBLIC_URL}/success`,
    fail_url_address: `${process.env.NEXT_PUBLIC_URL}/cart`,
  });

  const tranzillaUrl = `https://direct.tranzila.com/${process.env.TRANZILA_TERMINAL}/iframe.php?${params}`;
  
  return Response.json({ url: tranzillaUrl });
}
```

```tsx
// הטמעה בעמוד
<iframe 
  src={tranzillaUrl} 
  width="100%" 
  height="600"
  className="border-0"
/>
```

---

## אפשרות 3: PayPlus (ישראלי חדש)

```bash
npm install payplus-api
```

```typescript
import { PayPlus } from 'payplus-api';

const payplus = new PayPlus({
  apiKey: process.env.PAYPLUS_API_KEY!,
  secretKey: process.env.PAYPLUS_SECRET_KEY!,
});

const payment = await payplus.charge({
  amount: total,
  currency: 'ILS',
  description: 'הזמנה מהחנות',
});
```

---

## השוואה מהירה:

| שירות | עמלה | קלות שימוש | תמיכה בעברית |
|-------|------|------------|--------------|
| **Stripe** | ~2.9% + ₪1.2 | ⭐⭐⭐⭐⭐ | חלקית |
| **Tranzila** | ~2.5% + עמלות | ⭐⭐⭐⭐ | מלאה |
| **PayPlus** | ~2.5% | ⭐⭐⭐⭐ | מלאה |
| **CardCom** | ~2.5% | ⭐⭐⭐ | מלאה |

---

## ⚠️ חשוב לדעת:

### אסור לך:
- ❌ לשמור מספרי כרטיס אשראי
- ❌ לטפל בפרטי כרטיס בשרת שלך
- ❌ לבנות טופס תשלום משלך

### מה כן מותר:
- ✅ להשתמש ב-iframe/widget מהשירות
- ✅ לקבל אישור תשלום (token)
- ✅ לשמור פרטי הזמנה (לא כרטיס!)

---

## המלצה שלי:

1. **למתחילים**: Stripe - הכי קל וברור
2. **לשוק ישראלי**: Tranzila או PayPlus
3. **למסחר גדול**: Stripe + PayPlus (שניהם)

---

## עלויות (בערך):

- **פתיחת חשבון**: חינם
- **עמלה לעסקה**: 2.5-2.9% + ₪1-1.5
- **אין עמלת מנוי** (רוב החברות)
- **PCI DSS**: לא צריך אם משתמש בשירות

---

## מה תרצה להטמיע?
בוא נבנה את זה ביחד! 🚀
