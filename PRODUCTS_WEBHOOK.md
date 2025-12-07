# Product Webhook Example

## Endpoint
```
POST https://your-domain.vercel.app/api/webhooks/products
```

## Example Request

```bash
curl -X POST http://localhost:3000/api/webhooks/products \
  -H "Content-Type: application/json" \
  -d '{
    "crmid": "PROD-001",
    "data": {
      "name": "כיסא גינה מעוצב",
      "slug": "garden-chair-deluxe",
      "description": "כיסא נוח וחזק לגינה, עשוי מחומרים איכותיים ועמידים בפני מזג אויר. מושלם לישיבה נוחה בחוץ.",
      "short_description": "כיסא גינה איכותי ונוח",
      "price": 299.99,
      "compare_at_price": 399.99,
      "category_slug": "garden",
      "sku": "GC-001",
      "stock": 50,
      "weight": 5.5,
      "dimensions": "60x60x90",
      "brand": "OutdoorPro",
      "tags": ["גינה", "ריהוט", "חוץ"],
      "is_published": true,
      "is_featured": true
    },
    "images": [
      {
        "image_url": "https://example.com/images/chair-front.jpg",
        "alt_text": "כיסא גינה - מבט קדמי",
        "position": 1,
        "is_primary": true
      },
      {
        "image_url": "https://example.com/images/chair-side.jpg",
        "alt_text": "כיסא גינה - מבט צד",
        "position": 2,
        "is_primary": false
      },
      {
        "image_url": "https://example.com/images/chair-back.jpg",
        "alt_text": "כיסא גינה - מבט אחורי",
        "position": 3,
        "is_primary": false
      }
    ]
  }'
```

## Response Success (201)

```json
{
  "success": true,
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "message": "Product created"
}
```

## Response Error (400)

```json
{
  "error": "Missing required fields: name, slug"
}
```

## Field Descriptions

### Required Fields
- `data.name` - שם המוצר
- `data.slug` - URL slug (ייחודי)
- `data.price` - מחיר

### Optional Fields
- `crmid` - מזהה מCRM (ייחודי, לעדכונים)
- `data.description` - תיאור מלא
- `data.short_description` - תיאור קצר
- `data.compare_at_price` - מחיר לפני הנחה
- `data.category_slug` - slug של הקטגוריה
- `data.sku` - מק"ט
- `data.stock` - מלאי (default: 0)
- `data.weight` - משקל בק"ג
- `data.dimensions` - מידות (format: "רוחב x גובה x עומק")
- `data.brand` - מותג
- `data.tags` - מערך תגיות
- `data.is_published` - פורסם (default: false)
- `data.is_featured` - מוצר מומלץ (default: false)

### Images
- `images` - מערך תמונות
  - `image_url` - כתובת התמונה (required)
  - `alt_text` - טקסט חלופי
  - `position` - מיקום בגלריה (1, 2, 3...)
  - `is_primary` - תמונה ראשית (ברירת מחדל: התמונה הראשונה)

## Notes

- אם `crmid` קיים, המוצר יתעדכן
- אם `slug` קיים (וcrmid לא), המוצר יתעדכן
- אחרת, מוצר חדש ייווצר
- תמונות קודמות נמחקות בעדכון
- `category_slug` ממיר אוטומטית ל-category_id
