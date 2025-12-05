# מדריך למחיקת רכבים (Vehicle Deletion Guide)

## 🎯 סקירה כללית

קיימות **3 דרכים** למחוק רכבים מהמערכת:

1. **מחיקה רכה (Soft Delete)** - מסמן את הרכב כנמכר (מומלץ)
2. **מחיקה קשה (Hard Delete)** - מוחק את הרכב לצמיתות
3. **מחיקה אוטומטית** - מחיקה אוטומטית של רכבים ישנים

---

## 1. מחיקה רכה (Soft Delete) - המומלץ ביותר ✅

### למה מחיקה רכה?

- ✅ **שומר היסטוריה** - הרכב נשאר במערכת עם סטטוס "נמכר"
- ✅ **ניתן לשחזור** - אפשר לבטל את הפעולה בקלות
- ✅ **מחיקה אוטומטית** - הרכב יימחק אוטומטית אחרי יומיים
- ✅ **בטוח** - לא יוצר "חורים" בנתונים

### איך לבצע?

#### דרך 1: Webhook API (מומלץ לאינטגרציה עם Zoho CRM)

```bash
curl -X POST "https://your-site.com/api/webhooks/vehicles/mark-sold" \
  -H "Content-Type: application/json" \
  -d '{
    "crmid": "ZOHO-DEAL-12345"
  }'
```

**תגובה:**
```json
{
  "success": true,
  "message": "Vehicle marked as sold",
  "crmid": "ZOHO-DEAL-12345",
  "note": "Vehicle will be automatically deleted after 2 days"
}
```

#### דרך 2: קוד TypeScript

```typescript
import { markVehicleAsSold } from '@/lib/vehiclesRepository';

const wasMarked = await markVehicleAsSold('ZOHO-DEAL-12345');
if (wasMarked) {
  console.log('הרכב סומן כנמכר בהצלחה');
} else {
  console.log('הרכב לא נמצא');
}
```

### מה קורה אחרי מחיקה רכה?

1. השדה `is_published` משתנה ל-`false`
2. השדה `updated_at` מתעדכן לזמן הנוכחי
3. הרכב **נעלם מדפי הרישום** באופן מיידי
4. אחרי **48 שעות** (2 ימים), הרכב נמחק אוטומטית לצמיתות

---

## 2. מחיקה קשה (Hard Delete) - מחיקה מיידית ⚠️

### מתי להשתמש?

- ❌ רכב הוזן בטעות
- ❌ רכב כפול
- ❌ נתונים שגויים
- ❌ צריך למחוק **מיד** ללא אפשרות שחזור

### ⚠️ אזהרה!

מחיקה קשה היא **בלתי הפיכה**. כל התמונות והנתונים יימחקו לצמיתות!

### איך לבצע?

#### דרך 1: מחיקה לפי CRM ID (מומלץ)

```bash
curl -X POST "https://your-site.com/api/webhooks/vehicles/delete" \
  -H "Content-Type: application/json" \
  -d '{
    "crmid": "ZOHO-DEAL-12345"
  }'
```

או עם HTTP DELETE:

```bash
curl -X DELETE "https://your-site.com/api/webhooks/vehicles/delete" \
  -H "Content-Type: application/json" \
  -d '{
    "crmid": "ZOHO-DEAL-12345"
  }'
```

**תגובה:**
```json
{
  "success": true,
  "message": "Vehicle deleted successfully",
  "crmid": "ZOHO-DEAL-12345"
}
```

#### דרך 2: מחיקה לפי Vehicle ID

```bash
curl -X POST "https://your-site.com/api/webhooks/vehicles/delete" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

#### דרך 3: קוד TypeScript

```typescript
import { deleteVehicleByCrmId, deleteVehicleById } from '@/lib/vehiclesRepository';

// מחיקה לפי CRM ID
const wasDeleted = await deleteVehicleByCrmId('ZOHO-DEAL-12345');

// או מחיקה לפי Vehicle ID
await deleteVehicleById('550e8400-e29b-41d4-a716-446655440000');
```

### מה נמחק?

- ✅ הרכב עצמו מטבלת `vehicles`
- ✅ כל התמונות מטבלת `vehicle_images` (Cascade Delete)
- ⚠️ **לא ניתן לשחזר!**

---

## 3. מחיקה אוטומטית (Automatic Cleanup)

### איך זה עובד?

המערכת מריצה תהליך ניקוי אוטומטי שמוחק:
- רכבים עם `is_published = false`
- שעברו יותר מ-**48 שעות** (2 ימים) מאז `updated_at`

### מתי זה רץ?

התהליך יכול לרוץ:
1. **Cron Job** (מומלץ) - כל יום בחצות
2. **מנואלי** - קריאה ידנית לפונקציה

### הגדרת Cron Job ב-Vercel

ליצור קובץ: `src/app/api/cron/cleanup/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { deleteSoldVehicles } from '@/lib/vehiclesRepository';

export async function GET() {
  try {
    console.log('🧹 Running automatic vehicle cleanup...');
    const deletedCount = await deleteSoldVehicles();
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} sold vehicles`,
      deletedCount,
    });
  } catch (error) {
    console.error('❌ Error in cleanup:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
```

בקובץ `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### הרצה ידנית

```typescript
import { deleteSoldVehicles } from '@/lib/vehiclesRepository';

const deletedCount = await deleteSoldVehicles();
console.log(`נמחקו ${deletedCount} רכבים`);
```

---

## 📊 טבלת השוואה

| קריטריון | מחיקה רכה | מחיקה קשה | מחיקה אוטומטית |
|----------|-----------|-----------|-----------------|
| **מהירות** | מיידי | מיידי | 48 שעות |
| **ניתן לשחזור** | ✅ כן (עד 48 שעות) | ❌ לא | ❌ לא |
| **שומר היסטוריה** | ✅ כן | ❌ לא | ❌ לא |
| **מומלץ ל-** | רכבים נמכרו | טעויות | תחזוקה אוטומטית |
| **API Endpoint** | `/api/webhooks/vehicles/mark-sold` | `/api/webhooks/vehicles/delete` | `/api/cron/cleanup` |
| **Zoho Integration** | ✅ כן | ✅ כן | ❌ לא |

---

## 🔄 תהליך העבודה המומלץ

### תרחיש 1: רכב נמכר

```
1. Zoho CRM שולח webhook ל-/api/webhooks/vehicles/mark-sold
2. הרכב מסומן כ-is_published = false
3. הרכב נעלם מהאתר באופן מיידי
4. אחרי 48 שעות - מחיקה אוטומטית
```

### תרחיש 2: רכב הוזן בטעות

```
1. מזהים את הטעות מיד
2. שולחים webhook ל-/api/webhooks/vehicles/delete
3. הרכב נמחק מיד וללא אפשרות שחזור
```

### תרחיש 3: שחזור רכב שנמכר בטעות

```
1. תוך 48 שעות מהמחיקה הרכה
2. שולחים webhook חדש ל-/api/webhooks/vehicles
3. עם אותו crmid ועם is_published = true
4. הרכב חוזר לאתר
```

---

## 🛡️ בטיחות ואבטחה

### מחיקה רכה (Soft Delete)

- ✅ **בטוח לחלוטין** - ניתן לשחזור
- ✅ **שומר נתונים** - לצורכי דיווח וניתוח
- ✅ **מונע טעויות** - יש זמן לתקן

### מחיקה קשה (Hard Delete)

- ⚠️ **סכנה גבוהה** - אין אפשרות שחזור
- ⚠️ **צריך הרשאות** - רק למשתמשים מורשים
- ⚠️ **לוג מלא** - כל מחיקה מתועדת בקונסול

---

## 📝 דוגמאות קוד מלאות

### דוגמה 1: פונקציה למחיקת רכב (עם ולידציה)

```typescript
import { markVehicleAsSold, deleteVehicleByCrmId } from '@/lib/vehiclesRepository';

async function deleteVehicle(crmid: string, hardDelete: boolean = false) {
  try {
    if (hardDelete) {
      // אזהרה - מחיקה קשה!
      console.warn(`⚠️ HARD DELETE: ${crmid}`);
      const wasDeleted = await deleteVehicleByCrmId(crmid);
      
      if (!wasDeleted) {
        throw new Error(`Vehicle not found: ${crmid}`);
      }
      
      console.log(`✅ Vehicle permanently deleted: ${crmid}`);
      return { success: true, type: 'hard' };
    } else {
      // מחיקה רכה - מומלץ
      console.log(`🏷️ Soft delete (marking as sold): ${crmid}`);
      const wasMarked = await markVehicleAsSold(crmid);
      
      if (!wasMarked) {
        throw new Error(`Vehicle not found: ${crmid}`);
      }
      
      console.log(`✅ Vehicle marked as sold: ${crmid}`);
      return { success: true, type: 'soft' };
    }
  } catch (error) {
    console.error('❌ Error deleting vehicle:', error);
    return { success: false, error: String(error) };
  }
}

// שימוש:
await deleteVehicle('ZOHO-DEAL-12345'); // מחיקה רכה
await deleteVehicle('ZOHO-DEAL-12345', true); // מחיקה קשה
```

### דוגמה 2: Zoho CRM Workflow

**Workflow: כשהרכב נמכר ב-Zoho**

```javascript
// Zoho Deluge Script
dealId = input.dealId;
apiUrl = "https://your-site.com/api/webhooks/vehicles/mark-sold";

payload = {
  "crmid": dealId
};

response = invokeurl [
  url: apiUrl
  type: POST
  parameters: payload.toString()
  content-type: "application/json"
];

info response;
```

---

## 🚨 טיפול בשגיאות

### שגיאה: "No vehicle found with crmid"

```json
{
  "success": false,
  "error": "No vehicle found with crmid: ZOHO-DEAL-12345"
}
```

**פתרון:**
- בדוק שה-`crmid` נכון
- בדוק שהרכב קיים במערכת

### שגיאה: "Missing required field: crmid"

```json
{
  "success": false,
  "error": "Missing required field: crmid"
}
```

**פתרון:**
- ודא ש-`crmid` מופיע ב-payload
- בדוק את פורמט ה-JSON

---

## 📚 סיכום

| כשתרצה... | השתמש ב... |
|-----------|-----------|
| למחוק רכב שנמכר | `mark-sold` (מחיקה רכה) |
| למחוק רכב בטעות | `delete` (מחיקה קשה) |
| לנקות רכבים ישנים | `deleteSoldVehicles()` (אוטומטי) |
| לשחזר רכב | שלח webhook חדש עם `is_published: true` |

**המלצה:** תמיד השתמש במחיקה רכה (`mark-sold`) אלא אם יש סיבה טובה מאוד לעשות מחיקה קשה!
