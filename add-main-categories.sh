#!/bin/bash

# Seed main categories (בית, רכב, חצר) + product subcategories
# Uses Supabase REST API with service role key if available

set -euo pipefail

# Load env (no output if missing)
if [ -f .env.local ]; then
  set -a
  source .env.local
  set +a
fi

SUPABASE_URL="${SUPABASE_URL:-${NEXT_PUBLIC_SUPABASE_URL:-}}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-${SERVICE_ROLE_KEY:-${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}}}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SERVICE_KEY" ]; then
  echo "Missing SUPABASE_URL or service key in env. Aborting."
  exit 1
fi

PAYLOAD='[
  {"name": "בית", "slug": "home", "parent_id": null, "is_active": true, "display_order": 1},
  {"name": "רכב", "slug": "car", "parent_id": null, "is_active": true, "display_order": 2},
  {"name": "חצר", "slug": "garden", "parent_id": null, "is_active": true, "display_order": 3},
  {"name": "נשים", "slug": "women", "parent_id": null, "is_active": true, "display_order": 4},
  {"name": "Furniture", "slug": "furniture", "parent_id": null, "is_active": true, "display_order": 10},
  {"name": "Lighting", "slug": "lighting", "parent_id": null, "is_active": true, "display_order": 11},
  {"name": "Home Decor", "slug": "home-decor", "parent_id": null, "is_active": true, "display_order": 12},
  {"name": "Textiles", "slug": "textiles", "parent_id": null, "is_active": true, "display_order": 13},
  {"name": "Accessories", "slug": "accessories", "parent_id": null, "is_active": true, "display_order": 14}
]'

echo "Seeding categories to $SUPABASE_URL ..."

curl -s "$SUPABASE_URL/rest/v1/categories" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d "$PAYLOAD"

echo ""
echo "Done."
