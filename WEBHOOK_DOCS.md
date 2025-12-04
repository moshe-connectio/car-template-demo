# Vehicle Webhook API Documentation

## Overview

The webhook endpoint allows third-party services (Zoho CRM, inventory systems, etc.) to create and update vehicles using a simple upsert pattern driven by **`crmid`** (CRM ID).

**Base URL:** `https://car-template-demo.vercel.app`  
**Endpoint:** `POST /api/webhooks/vehicles`

---

## Key Concept: UPSERT by CRM ID

Instead of separate "create" and "update" actions, the webhook uses a single **upsert** pattern:

- **If `crmid` doesn't exist** → Creates a new vehicle
- **If `crmid` exists** → Updates the existing vehicle
- **Multiple vehicles can have the same name/slug** (e.g., multiple "Tesla Model 3" in different colors)
- **`crmid` must be unique** (it's your unique identifier from your CRM system)

This means you can send the same webhook call multiple times with the same `crmid`, and it will always update the existing vehicle instead of creating duplicates!

---

## Request Format

### Headers
```
Content-Type: application/json
```

### Body Structure

```json
{
  "crmid": "ZOHO-DEAL-67890",
  "data": {
    "slug": "toyota-camry-black-2024",
    "title": "Toyota Camry 2024 - Black",
    "brand": "Toyota",
    "model": "Camry",
    "year": 2024,
    "price": 125000,
    "is_published": true,
    "km": 0,
    "gear_type": "Automatic",
    "fuel_type": "Petrol",
    "main_image_url": "https://example.com/toyota-camry.jpg",
    "short_description": "Beautiful Toyota Camry with low mileage",
    "external_id": "INV-2024-001",
    "raw_data": {
      "color": "Black",
      "interior": "Leather",
      "transmission": "CVT"
    }
  },
  "images": [
    {
      "image_url": "https://images.example.com/car-1.jpg",
      "position": 1,
      "alt_text": "Front view"
    },
    {
      "image_url": "https://images.example.com/car-2.jpg",
      "position": 2,
      "alt_text": "Side view"
    }
  ]
}
```

### Field Descriptions

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `crmid` | string | Unique CRM identifier. **MUST be unique** - used as the primary key for upsert operations |
| `data.slug` | string | URL-friendly identifier (e.g., "toyota-camry-2024"). **Does NOT need to be unique** |
| `data.title` | string | Display name of the vehicle (e.g., "Toyota Camry 2024") |
| `data.brand` | string | Brand/manufacturer name (e.g., "Toyota") |
| `data.model` | string | Model name (e.g., "Camry") |
| `data.year` | number | Manufacturing year |
| `data.price` | number | Price in currency units |
| `data.is_published` | boolean | Whether the vehicle should be visible on the website |

#### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `data.km` | number | Kilometers/mileage |
| `data.gear_type` | string | Transmission type (e.g., "Automatic", "Manual") |
| `data.fuel_type` | string | Fuel type (e.g., "Petrol", "Diesel", "Electric") |
| `data.main_image_url` | string | URL of the main/primary image |
| `data.short_description` | string | Brief description of the vehicle |
| `data.external_id` | string | External identifier from your system |
| `data.raw_data` | object | Any additional JSON data |
| `images` | array | Array of image objects (max 10 images, positions 1-10) |

#### Image Objects

Each image in the `images` array:

```json
{
  "image_url": "https://images.example.com/photo.jpg",
  "position": 1,
  "alt_text": "Car front view"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `image_url` | string | **HTTPS URL only** (no base64 supported in serverless environment) |
| `position` | number | Position 1-10 (1 = primary image, rest are secondary) |
| `alt_text` | string | Optional: Alternative text for accessibility |

---

## Response Formats

### Success Response (Created)

```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "vehicleId": "550e8400-e29b-41d4-a716-446655440000",
  "action": "created",
  "imagesAdded": 2
}
```

Status Code: `201 Created`

### Success Response (Updated)

```json
{
  "success": true,
  "message": "Vehicle updated successfully",
  "vehicleId": "550e8400-e29b-41d4-a716-446655440000",
  "action": "updated",
  "imagesAdded": 1
}
```

Status Code: `200 OK`

### Error Response

```json
{
  "success": false,
  "error": "Missing required fields: slug, title"
}
```

Common error messages:
- `"Missing required field: crmid"` - crmid is required
- `"Missing required field: data"` - data object is required
- `"Missing required fields: slug, title, ..."` - One or more required fields missing
- Various validation errors

---

## Complete Examples

### Example 1: Create New Vehicle with Images

```bash
curl -X POST "https://car-template-demo.vercel.app/api/webhooks/vehicles" \
  -H "Content-Type: application/json" \
  -d '{
    "crmid": "ZOHO-DEAL-98765",
    "data": {
      "slug": "bmw-x5-white-2024",
      "title": "BMW X5 2024 - White",
      "brand": "BMW",
      "model": "X5",
      "year": 2024,
      "price": 95000,
      "is_published": true,
      "km": 500,
      "gear_type": "Automatic",
      "fuel_type": "Hybrid",
      "main_image_url": "https://images.example.com/bmw-x5-main.jpg",
      "short_description": "Premium BMW X5 SUV with hybrid engine"
    },
    "images": [
      {
        "image_url": "https://images.example.com/bmw-x5-front.jpg",
        "position": 1,
        "alt_text": "Front view"
      },
      {
        "image_url": "https://images.example.com/bmw-x5-side.jpg",
        "position": 2,
        "alt_text": "Side view"
      },
      {
        "image_url": "https://images.example.com/bmw-x5-interior.jpg",
        "position": 3,
        "alt_text": "Interior"
      }
    ]
  }'
```

### Example 2: Update Existing Vehicle (Same CRMID)

Send the exact same call with updated values:

```bash
curl -X POST "https://car-template-demo.vercel.app/api/webhooks/vehicles" \
  -H "Content-Type: application/json" \
  -d '{
    "crmid": "ZOHO-DEAL-98765",
    "data": {
      "slug": "bmw-x5-white-2024",
      "title": "BMW X5 2024 - White",
      "brand": "BMW",
      "model": "X5",
      "year": 2024,
      "price": 92000,
      "is_published": true,
      "km": 1500,
      "gear_type": "Automatic",
      "fuel_type": "Hybrid",
      "main_image_url": "https://images.example.com/bmw-x5-main.jpg",
      "short_description": "Premium BMW X5 SUV with hybrid engine - Updated price"
    }
  }'
```

The webhook will automatically update the vehicle because the `crmid` already exists. No need to track vehicle IDs!

### Example 3: Add More Images to Existing Vehicle

```bash
curl -X POST "https://car-template-demo.vercel.app/api/webhooks/vehicles" \
  -H "Content-Type: application/json" \
  -d '{
    "crmid": "ZOHO-DEAL-98765",
    "data": {
      "slug": "bmw-x5-white-2024",
      "title": "BMW X5 2024 - White",
      "brand": "BMW",
      "model": "X5",
      "year": 2024,
      "price": 92000,
      "is_published": true
    },
    "images": [
      {
        "image_url": "https://images.example.com/bmw-x5-rear.jpg",
        "position": 4,
        "alt_text": "Rear view"
      },
      {
        "image_url": "https://images.example.com/bmw-x5-dashboard.jpg",
        "position": 5,
        "alt_text": "Dashboard"
      }
    ]
  }'
```

---

## Important Notes

### ⚠️ Slug is NOT Unique

The `slug` field does NOT need to be unique. You can have multiple vehicles with the same slug:
- Multiple "Tesla Model 3" (different colors, years, etc.)
- Multiple "Honda Civic" (different trims, body colors, etc.)

The **`crmid` is what makes each vehicle unique**.

### ⚠️ Image URLs Must Be HTTPS

- ✅ Supported: `https://images.example.com/car.jpg`
- ❌ Not supported: `data:image/jpeg;base64,...` (base64 images)
- ❌ Not supported: `http://...` (non-HTTPS)

### ✅ Safe to Resend

You can safely resend the same webhook call multiple times with the same `crmid`:
- First call → Creates vehicle
- Second call → Updates vehicle (not duplicate!)
- Third call → Updates vehicle again
- etc.

This is perfect for automated sync processes where you might call the webhook periodically.

### Image Positions

- Position 1: Primary/main image (displayed prominently)
- Positions 2-10: Secondary images (shown in gallery/thumbnails)

---

## Database Setup

Before using the webhook, ensure you have:

1. **Remove UNIQUE constraint from slug**:
```sql
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_slug_key;
```

2. **Ensure crmid is UNIQUE**:
```sql
ALTER TABLE vehicles ADD CONSTRAINT vehicles_crmid_unique UNIQUE (crmid);
```

3. **Create the vehicle_images table**:
```sql
CREATE TABLE IF NOT EXISTS vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 10),
  alt_text TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (vehicle_id, position)
);

CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_position ON vehicle_images(vehicle_id, position);
```

---

## Integration Examples

### Zoho CRM Workflow

1. Set up a Zoho Flow that triggers when a Deal is created/updated
2. Send webhook to: `https://car-template-demo.vercel.app/api/webhooks/vehicles`
3. Map Deal fields:
   - `Deal ID` → `crmid`
   - `Deal Name` → `title`
   - `Car Brand` (custom field) → `brand`
   - `Car Model` (custom field) → `model`
   - etc.

### Custom Integration

Any system that can make HTTP POST requests can trigger the webhook:

```javascript
// JavaScript/Node.js Example
const response = await fetch('https://car-template-demo.vercel.app/api/webhooks/vehicles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    crmid: 'YOUR-CRM-ID',
    data: {
      slug: 'your-car-slug',
      title: 'Your Car Title',
      brand: 'Brand',
      model: 'Model',
      year: 2024,
      price: 50000,
      is_published: true
    }
  })
});

const result = await response.json();
console.log(result);
```

---

## Troubleshooting

### Error: "duplicate key value violates unique constraint"

**Cause:** You're using a `crmid` that already exists and trying to upsert, or the database constraint is incorrect.  
**Solution:** 
- Make sure you're using the correct unique identifier for your vehicle
- Ensure your database has the correct constraints set up

### Error: "Missing required fields: slug, title, ..."

**Cause:** You didn't include all required fields.  
**Solution:** Make sure your webhook includes all required fields in the `data` object.

### Images Not Appearing

**Cause:** Image URLs might be incorrect or not HTTPS.  
**Solution:** 
- Verify URLs are HTTPS (not HTTP)
- Verify URLs are accessible/public
- Check the server logs for warnings about skipped images

---

## Support

For issues or questions, check:
1. Server logs for detailed error messages
2. Response body for the specific error
3. Webhook payload for missing/invalid fields
