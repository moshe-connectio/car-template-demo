#!/bin/bash

# Example: Create a test category in Supabase
# Run this via Supabase SQL Editor or replace with your category data

echo "📝 Creating test category..."

curl -X POST http://localhost:3000/api/webhooks/products \
  -H "Content-Type: application/json" \
  -d '{
    "crmid": "TEST-PROD-001",
    "data": {
      "name": "כיסא אוכל מעוצב",
      "slug": "dining-chair-modern",
      "description": "כיסא אוכל מודרני ונוח, עשוי מעץ מלא ובד איכותי. עיצוב מינימליסטי שמתאים לכל סגנון בית. קל לתחזוקה ונוח לישיבה ממושכת.",
      "short_description": "כיסא אוכל מודרני ונוח",
      "price": 449.00,
      "compare_at_price": 599.00,
      "sku": "DC-MOD-001",
      "stock": 25,
      "weight": 6.2,
      "dimensions": "45x55x85",
      "brand": "HomeDesign",
      "tags": ["ריהוט", "פינת אוכל", "עיצוב מודרני"],
      "is_published": true,
      "is_featured": true
    },
    "images": [
      {
        "image_url": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800",
        "alt_text": "כיסא אוכל מודרני - מבט קדמי",
        "position": 1,
        "is_primary": true
      },
      {
        "image_url": "https://images.unsplash.com/photo-1503602642458-232111445657?w=800",
        "alt_text": "כיסא אוכל מודרני - מבט צד",
        "position": 2,
        "is_primary": false
      },
      {
        "image_url": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
        "alt_text": "כיסא אוכל מודרני - פרטים",
        "position": 3,
        "is_primary": false
      }
    ]
  }'

echo ""
echo "✅ Test product sent!"
