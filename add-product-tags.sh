#!/bin/bash

WEBHOOK_URL="http://localhost:3000/api/webhooks/products"

# Update products with tags
echo "Adding tags to products..."

curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wooden Dining Table",
    "slug": "wooden-dining-table",
    "category_slug": "furniture",
    "price": 2500,
    "description": "Premium oak wood dining table with smooth surface. Seats 6-8 people.",
    "short_description": "Premium oak dining table",
    "stock": 15,
    "tags": ["wood", "modern", "dining"],
    "images": [{"image_url": "https://images.unsplash.com/photo-1551632786-de41ec16a83d?w=800", "alt_text": "Dining Table", "position": 1}]
  }'
echo ""

curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Three Seater Sofa",
    "slug": "three-seater-sofa",
    "category_slug": "furniture",
    "price": 4200,
    "description": "Modern three-seater sofa with soft upholstered fabric and wooden legs. Deep gray color.",
    "short_description": "Modern three-seater sofa",
    "stock": 15,
    "tags": ["fabric", "comfortable", "modern"],
    "images": [{"image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", "alt_text": "Sofa", "position": 1}]
  }'
echo ""

curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "LED Ceiling Lamp",
    "slug": "led-ceiling-lamp",
    "category_slug": "lighting",
    "price": 450,
    "description": "Energy-efficient LED ceiling lamp with cool white light. 20W power.",
    "short_description": "Energy-saving LED lamp",
    "stock": 15,
    "tags": ["energy-efficient", "led", "modern"],
    "images": [{"image_url": "https://images.unsplash.com/photo-1565636192335-14975080b935?w=800", "alt_text": "Ceiling Lamp", "position": 1}]
  }'
echo ""

curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Modern Desk Lamp",
    "slug": "modern-desk-lamp",
    "category_slug": "lighting",
    "price": 320,
    "description": "Minimalist desk lamp with flexible arm. Matte black finish.",
    "short_description": "Modern desk lamp",
    "stock": 15,
    "tags": ["minimalist", "led", "flexible"],
    "images": [{"image_url": "https://images.unsplash.com/photo-1565636192335-14975080b935?w=800", "alt_text": "Desk Lamp", "position": 1}]
  }'
echo ""

curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Velvet Area Rug",
    "slug": "velvet-area-rug",
    "category_slug": "home-decor",
    "price": 1800,
    "description": "Thick velvet rug in ochre brown. 2x3 meters. Soft and comfortable.",
    "short_description": "Premium velvet rug",
    "stock": 15,
    "tags": ["velvet", "soft", "luxury"],
    "images": [{"image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "alt_text": "Area Rug", "position": 1}]
  }'
echo ""

curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gold Wall Mirror",
    "slug": "gold-wall-mirror",
    "category_slug": "home-decor",
    "price": 580,
    "description": "Round wall mirror with gold frame. 60cm diameter. Perfect for modern interiors.",
    "short_description": "Gold wall mirror",
    "stock": 15,
    "tags": ["gold", "luxury", "modern"],
    "images": [{"image_url": "https://images.unsplash.com/photo-1579541830387-4de6a5b0d1d3?w=800", "alt_text": "Wall Mirror", "position": 1}]
  }'
echo ""

curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Checkered Decorative Pillow",
    "slug": "decorative-pillow-checkered",
    "category_slug": "textiles",
    "price": 120,
    "description": "Black and white checkered decorative pillow. 45x45cm. 100% cotton fabric.",
    "short_description": "Checkered pillow",
    "stock": 15,
    "tags": ["cotton", "decorative", "pattern"],
    "images": [{"image_url": "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800", "alt_text": "Pillow", "position": 1}]
  }'
echo ""

curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Faux Fur Throw",
    "slug": "faux-fur-throw",
    "category_slug": "textiles",
    "price": 280,
    "description": "Soft faux fur throw blanket in white. 150x200cm. Warm and cozy.",
    "short_description": "Faux fur throw blanket",
    "stock": 15,
    "tags": ["soft", "warm", "luxury"],
    "images": [{"image_url": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800", "alt_text": "Throw Blanket", "position": 1}]
  }'
echo ""

curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Minimalist Wall Clock",
    "slug": "minimalist-wall-clock",
    "category_slug": "accessories",
    "price": 320,
    "description": "Simple minimalist wall clock. Black hands on white face. 30cm diameter.",
    "short_description": "Minimalist wall clock",
    "stock": 15,
    "tags": ["minimalist", "modern", "time"],
    "images": [{"image_url": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800", "alt_text": "Wall Clock", "position": 1}]
  }'
echo ""

echo "✓ Products updated with tags!"
