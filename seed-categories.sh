#!/bin/bash

WEBHOOK_URL="http://localhost:3000/api/webhooks/products"

# Add categories via webhook or direct DB
# For now, let's create them in a simpler way via curl

# We'll use the Supabase API directly
SUPABASE_URL="https://jfzkzcxslwzfwqzlkecv.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmemt6Y3hzbHd6ZndxemxrZWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMjYzNzAsImV4cCI6MTg5MDk5NDM3MH0.4bnv_pHG3OY0cGLATrPVBwK-rC5fPKF8kRuEMVKxSAQ"

echo "Creating categories..."

curl -s -X POST "$SUPABASE_URL/rest/v1/categories" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '[
    {"name": "Furniture", "slug": "furniture", "parent_id": null},
    {"name": "Lighting", "slug": "lighting", "parent_id": null},
    {"name": "Home Decor", "slug": "home-decor", "parent_id": null},
    {"name": "Textiles", "slug": "textiles", "parent_id": null},
    {"name": "Accessories", "slug": "accessories", "parent_id": null}
  ]'

echo "Categories created!"
