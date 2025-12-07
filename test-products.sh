#!/bin/bash

WEBHOOK_URL="http://localhost:3000/api/webhooks/products"

# Function to create product
create_product() {
  local name=$1
  local slug=$2
  local category_slug=$3
  local price=$4
  local description=$5
  local short_description=$6
  local images=$7

  echo "Creating product: $name"
  
  curl -s -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d @- << PAYLOAD
{
  "name": "$name",
  "slug": "$slug",
  "category_slug": "$category_slug",
  "price": $price,
  "compare_at_price": null,
  "description": "$description",
  "short_description": "$short_description",
  "stock": 15,
  "brand": "Premium",
  "images": $images
}
PAYLOAD
  
  echo "✓ Product created"
  sleep 1
}

# Furniture
create_product \
  "Wooden Dining Table" \
  "wooden-dining-table" \
  "furniture" \
  2500 \
  "Premium oak wood dining table with smooth surface. Seats 6-8 people." \
  "Premium oak dining table" \
  '[{"image_url": "https://images.unsplash.com/photo-1551632786-de41ec16a83d?w=800", "alt_text": "Dining Table", "position": 1}]'

create_product \
  "Three Seater Sofa" \
  "three-seater-sofa" \
  "furniture" \
  4200 \
  "Modern three-seater sofa with soft upholstered fabric and wooden legs. Deep gray color." \
  "Modern three-seater sofa" \
  '[{"image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", "alt_text": "Sofa", "position": 1}]'

# Lighting
create_product \
  "LED Ceiling Lamp" \
  "led-ceiling-lamp" \
  "lighting" \
  450 \
  "Energy-efficient LED ceiling lamp with cool white light. 20W power." \
  "Energy-saving LED lamp" \
  '[{"image_url": "https://images.unsplash.com/photo-1565636192335-14975080b935?w=800", "alt_text": "Ceiling Lamp", "position": 1}]'

create_product \
  "Modern Desk Lamp" \
  "modern-desk-lamp" \
  "lighting" \
  320 \
  "Minimalist desk lamp with flexible arm. Matte black finish." \
  "Modern desk lamp" \
  '[{"image_url": "https://images.unsplash.com/photo-1565636192335-14975080b935?w=800", "alt_text": "Desk Lamp", "position": 1}]'

# Home Decor
create_product \
  "Velvet Area Rug" \
  "velvet-area-rug" \
  "home-decor" \
  1800 \
  "Thick velvet rug in ochre brown. 2x3 meters. Soft and comfortable." \
  "Premium velvet rug" \
  '[{"image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "alt_text": "Area Rug", "position": 1}]'

create_product \
  "Gold Wall Mirror" \
  "gold-wall-mirror" \
  "home-decor" \
  580 \
  "Round wall mirror with gold frame. 60cm diameter. Perfect for modern interiors." \
  "Gold wall mirror" \
  '[{"image_url": "https://images.unsplash.com/photo-1579541830387-4de6a5b0d1d3?w=800", "alt_text": "Wall Mirror", "position": 1}]'

# Textiles
create_product \
  "Checkered Decorative Pillow" \
  "decorative-pillow-checkered" \
  "textiles" \
  120 \
  "Black and white checkered decorative pillow. 45x45cm. 100% cotton fabric." \
  "Checkered pillow" \
  '[{"image_url": "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800", "alt_text": "Pillow", "position": 1}]'

create_product \
  "Faux Fur Throw" \
  "faux-fur-throw" \
  "textiles" \
  280 \
  "Soft faux fur throw blanket in white. 150x200cm. Warm and cozy." \
  "Faux fur throw blanket" \
  '[{"image_url": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800", "alt_text": "Throw Blanket", "position": 1}]'

# Accessories
create_product \
  "Minimalist Wall Clock" \
  "minimalist-wall-clock" \
  "accessories" \
  320 \
  "Simple minimalist wall clock. Black hands on white face. 30cm diameter." \
  "Minimalist wall clock" \
  '[{"image_url": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800", "alt_text": "Wall Clock", "position": 1}]'

echo "✓ All products created!"
