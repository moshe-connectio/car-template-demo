# חיפוש חכם עם תמיכה בעברית

## מה עשינו

הוספנו מערכת חיפוש חכמה שמטפלת בטעויות איות נפוצות בעברית:

### תכונות
- **כסא / כיסא** - שני הכתיבים יחזירו את אותן תוצאות
- **נורמליזציה של אותיות סופיות** (כ/ך, מ/ם, נ/ן, פ/ף, צ/ץ)
- **חיפוש מבוסס רלוונטיות** - תוצאות ממוינות לפי מידת התאמה
- **חיפוש רך (fuzzy)** - מוצא גם התאמות חלקיות

## איך זה עובד

### 1. Client-Side (מיושם עכשיו)
```typescript
// /src/shared/utils/search.ts
smartSearch(products, 'כסא', ['name', 'description'])
```

היתרונות:
- ✅ עובד מיד ללא שינויים בבסיס הנתונים
- ✅ תומך בטעויות איות נפוצות
- ✅ מיון אוטומטי לפי רלוונטיות

החסרונות:
- ⚠️ כל המוצרים נטענים לדפדפן
- ⚠️ לא אופטימלי למעלה מ-500 מוצרים

### 2. Server-Side Full-Text Search (מומלץ לעתיד)

כשיהיו לכם יותר מוצרים, צריך להוסיף ב-Supabase:

```sql
-- הוסף טקסט וקטור לחיפוש מלא
ALTER TABLE products 
ADD COLUMN search_vector tsvector;

-- צור אינדקס לחיפוש מהיר
CREATE INDEX products_search_idx 
ON products USING GIN(search_vector);

-- עדכן וקטור אוטומטית
CREATE TRIGGER products_search_vector_update
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(
  search_vector, 'pg_catalog.hebrew', 
  name, description, short_description
);
```

ואז בקוד:
```typescript
const { data } = await supabase
  .from('products')
  .select('*')
  .textSearch('search_vector', query, {
    type: 'websearch',
    config: 'hebrew'
  });
```

## דוגמאות שימוש

```typescript
// חיפוש "כסא" ימצא גם "כיסא"
smartSearch(products, 'כסא', ['name', 'description'])

// חיפוש "נורה" ימצא "נורות", "נורת לד"
smartSearch(products, 'נורה', ['name'])

// חיפוש עם טעויות קלות
smartSearch(products, 'שולחן כתיבה', ['name', 'description'])
```

## ביצועים

| מספר מוצרים | Client-Side | Server-Side |
|-------------|-------------|-------------|
| 0-100       | ⚡ מצוין      | ⚡ מצוין     |
| 100-500     | ✅ טוב       | ⚡ מצוין     |
| 500-2000    | ⚠️ איטי      | ✅ טוב      |
| 2000+       | ❌ לא מומלץ   | ⚡ מצוין     |

## המלצות

1. **עכשיו** - השתמש בפתרון ה-Client-Side שהוספנו
2. **עד 500 מוצרים** - הפתרון הנוכחי מספיק
3. **מעל 500 מוצרים** - עבור ל-Server-Side Full-Text Search
4. **אופציונלי** - הוסף autocomplete/suggestions עם Algolia או Meilisearch
