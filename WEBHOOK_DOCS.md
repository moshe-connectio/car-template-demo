# Vehicle Webhook API Documentation

## Overview

The webhook endpoint allows third-party services (Zoho CRM, inventory systems, etc.) to create and update vehicles in the database via HTTP requests.

**Base URL:** `https://car-template-demo.vercel.app`  
**Endpoint:** `POST /api/webhooks/vehicles`

---

## Request Format

### Headers
```
Content-Type: application/json
```

### Body Structure

#### Create Vehicle

```json
{
  "action": "create",
  "data": {
    "slug": "toyota-camry-2024",
    "title": "Toyota Camry 2024",
    "brand": "Toyota",
    "model": "Camry",
    "year": 2024,
    "price": 125000,
    "is_published": true,
    "crmid": "ZOHO-DEAL-12345",
    "external_id": "INV-2024-001",
    "km": 0,
    "gear_type": "Automatic",
    "fuel_type": "Petrol",
    "main_image_url": "https://example.com/toyota-camry.jpg",
    "short_description": "Beautiful Toyota Camry with low mileage and full warranty",
    "raw_data": {
      "color": "Black",
      "interior": "Leather",
      "transmission": "CVT",
      "features": ["Cruise Control", "Backup Camera", "Bluetooth"]
    }
  }
}
```

#### Update Vehicle

```json
{
  "action": "update",
  "vehicleId": "550e8400-e29b-41d4-a716-446655440000",
  "data": {
    "price": 120000,
    "km": 5000,
    "is_published": true
  }
}
```

#### Upsert Vehicle (Create or Update by CRM ID)

```json
{
  "action": "upsert",
  "crmid": "ZOHO-DEAL-12345",
  "data": {
    "slug": "toyota-camry-2024",
    "title": "Toyota Camry 2024",
    "brand": "Toyota",
    "model": "Camry",
    "year": 2024,
    "price": 125000,
    "is_published": true,
    "km": 0,
    "gear_type": "Automatic",
    "fuel_type": "Petrol",
    "main_image_url": "https://example.com/image.jpg",
    "short_description": "Beautiful Toyota Camry with low mileage"
  }
}
```

---

## Complete Field Reference

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | uuid | Auto | gen_random_uuid() | Unique identifier (auto-generated) |
| `created_at` | timestamp | Auto | now() | Creation time (auto-generated) |
| `updated_at` | timestamp | Auto | now() | Last update time (auto-generated) |
| `slug` | text | ✅ Yes | - | URL-friendly unique identifier |
| `title` | text | ✅ Yes | - | Vehicle display name |
| `brand` | text | ✅ Yes | - | Manufacturer (e.g., Toyota, BMW) |
| `model` | text | ✅ Yes | - | Model name (e.g., Camry, X5) |
| `year` | integer | ✅ Yes | - | Model year (e.g., 2024) |
| `price` | numeric | ✅ Yes | - | Price in your currency |
| `is_published` | boolean | No | true | Visibility on website |
| `crmid` | text | No | null | CRM system ID (Zoho, Salesforce) |
| `external_id` | text | No | null | Additional external reference |
| `km` | integer | No | null | Mileage in kilometers |
| `gear_type` | text | No | null | Transmission type |
| `fuel_type` | text | No | null | Fuel type |
| `main_image_url` | text | No | null | Primary image URL |
| `short_description` | text | No | null | Brief description |
| `raw_data` | jsonb | No | null | Additional metadata (JSON) |

---

## Required Fields

### Create Action
- `slug` (text, unique) - URL-friendly identifier
- `title` (text) - Vehicle name/title
- `brand` (text) - Brand name
- `model` (text) - Model name
- `year` (integer) - Model year
- `price` (numeric) - Price in your currency
- `is_published` (boolean) - Publication status

### Update Action
- `vehicleId` (uuid) - The vehicle ID to update
- At least one field in `data` object to update

### Upsert Action
- `crmid` (text) - The CRM ID to identify the vehicle
- All required fields from Create Action (slug, title, brand, model, year, price, is_published) - only needed if creating new vehicle

---

## Optional Fields

For both create and update actions, you can include:
- `crmid` (text) - CRM system ID (Zoho, Salesforce, etc.) for preventing duplicates
- `external_id` (text) - Additional external reference ID
- `km` (integer) - Mileage in kilometers
- `gear_type` (text) - Transmission type (e.g., "Manual", "Automatic", "CVT")
- `fuel_type` (text) - Fuel type (e.g., "Petrol", "Diesel", "Electric", "Hybrid")
- `main_image_url` (text) - URL to the main vehicle image
- `short_description` (text) - Brief description of the vehicle
- `raw_data` (jsonb) - Additional metadata as JSON object (any structure)

## Auto-Generated Fields (Do Not Send)

These fields are automatically managed by the database:
- `id` (uuid) - Unique identifier, auto-generated
- `created_at` (timestamp) - Creation timestamp, auto-set
- `updated_at` (timestamp) - Last update timestamp, auto-set

---

## Response Format

### Success Response (201 for create, 200 for update)

```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "vehicleId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Error Response (400, 500)

```json
{
  "success": false,
  "error": "Missing required fields for create: slug, title"
}
```

---

## Examples

### cURL - Update Vehicle

```bash
curl -X POST https://car-template-demo.vercel.app/api/webhooks/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update",
    "vehicleId": "550e8400-e29b-41d4-a716-446655440000",
    "data": {
      "price": 90000,
      "km": 1000
    }
  }'
```

### cURL - Upsert Vehicle (via CRM ID)

Creates or updates vehicle based on CRM ID:

```bash
curl -X POST https://car-template-demo.vercel.app/api/webhooks/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "action": "upsert",
    "crmid": "ZOHO-DEAL-12345",
    "data": {
      "slug": "ford-mustang-2024",
      "title": "Ford Mustang 2024",
      "brand": "Ford",
      "model": "Mustang",
      "year": 2024,
      "price": 180000,
      "is_published": true,
      "km": 0,
      "gear_type": "Automatic",
      "fuel_type": "Petrol"
    }
  }'
```

**First time?** Returns 201 with action: "created"  
**Already exists?** Returns 200 with action: "updated"

### cURL - Update Vehicle

```bash
curl -X POST https://car-template-demo.vercel.app/api/webhooks/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update",
    "vehicleId": "550e8400-e29b-41d4-a716-446655440000",
    "data": {
      "price": 90000,
      "km": 1000
    }
  }'
```

### JavaScript/Node.js

```javascript
async function createVehicle(vehicleData) {
  const response = await fetch('https://car-template-demo.vercel.app/api/webhooks/vehicles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'create',
      data: vehicleData,
    }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
}

async function upsertVehicle(crmid, vehicleData) {
  const response = await fetch('https://car-template-demo.vercel.app/api/webhooks/vehicles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'upsert',
      crmid: crmid,
      data: vehicleData,
    }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
}

// Usage - Create
createVehicle({
  slug: 'bmw-x5-2024',
  title: 'BMW X5 2024',
  brand: 'BMW',
  model: 'X5',
  year: 2024,
  price: 250000,
  is_published: true,
}).then(console.log).catch(console.error);

// Usage - Upsert (will create or update based on CRM ID)
upsertVehicle('ZOHO-DEAL-12345', {
  slug: 'bmw-x5-2024',
  title: 'BMW X5 2024',
  brand: 'BMW',
  model: 'X5',
  year: 2024,
  price: 250000,
  is_published: true,
}).then(result => {
  console.log(`Vehicle ${result.action}: ${result.vehicleId}`);
}).catch(console.error);
```

### Python

```python
import requests
import json

def create_vehicle(vehicle_data):
    url = 'https://car-template-demo.vercel.app/api/webhooks/vehicles'
    
    payload = {
        'action': 'create',
        'data': vehicle_data
    }
    
    response = requests.post(url, json=payload)
    result = response.json()
    
    if response.status_code not in [200, 201]:
        raise Exception(result.get('error'))
    
    return result

def upsert_vehicle(crmid, vehicle_data):
    url = 'https://car-template-demo.vercel.app/api/webhooks/vehicles'
    
    payload = {
        'action': 'upsert',
        'crmid': crmid,
        'data': vehicle_data
    }
    
    response = requests.post(url, json=payload)
    result = response.json()
    
    if response.status_code not in [200, 201]:
        raise Exception(result.get('error'))
    
    return result

# Usage - Create
vehicle = {
    'slug': 'mercedes-benz-c-class-2024',
    'title': 'Mercedes-Benz C-Class 2024',
    'brand': 'Mercedes-Benz',
    'model': 'C-Class',
    'year': 2024,
    'price': 280000,
    'is_published': True,
    'fuel_type': 'Diesel',
}

result = create_vehicle(vehicle)
print(f"Created vehicle: {result['vehicleId']}")

# Usage - Upsert (will create or update based on CRM ID)
result = upsert_vehicle('ZOHO-DEAL-12345', vehicle)
print(f"Vehicle {result['action']}: {result['vehicleId']}")
```

---

## Error Handling

### Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Missing required field: action | Include `action` field with "create" or "update" |
| 400 | Missing required field: data | Include `data` object with vehicle information |
| 400 | Missing required fields for create: slug, title | Include all required fields for vehicle creation |
| 400 | Missing required field for update: vehicleId | Include `vehicleId` when using update action |
| 500 | Failed to create vehicle: ... | Check database connection and field constraints (e.g., slug uniqueness) |

---

## Testing Locally

### Using the dev server

```bash
# Start dev server
npm run dev

# In another terminal, test the webhook
curl -X POST http://localhost:3000/api/webhooks/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "data": {
      "slug": "test-vehicle-123",
      "title": "Test Vehicle",
      "brand": "Test Brand",
      "model": "Test Model",
      "year": 2024,
      "price": 50000,
      "is_published": true
    }
  }'
```

---

## Integration with Zoho CRM (Future)

The `crmid` field enables seamless integration with Zoho CRM. Once Zoho integration is set up, webhooks can be triggered automatically when:
- A new deal is won (creates a new vehicle)
- Vehicle information is updated in Zoho (updates the vehicle record)
- Inventory status changes

### How it works:

1. **First webhook from Zoho** with a new `crmid` → Vehicle is created in Supabase
2. **Second webhook from Zoho** with the same `crmid` → Vehicle is updated instead of duplicated
3. **Demo page automatically revalidates** (ISR) → Latest changes appear on the website

Example integration flow:
1. Sales closes deal in Zoho CRM (e.g., `ZOHO-DEAL-67890`)
2. Zoho sends webhook to `/api/webhooks/vehicles` with action: "upsert" and crmid
3. Vehicle is created in Supabase with the crmid
4. Next.js ISR revalidates the demo page
5. Updated vehicles appear on the website automatically
6. If the deal is updated in Zoho, webhook is sent again with same crmid → vehicle updates instead of duplicates

---

## Security Considerations

- ⚠️ Currently, the webhook endpoint is **public** and requires no authentication
- 🔐 For production, consider adding:
  - API key validation
  - Request signing with HMAC
  - IP whitelist (only accept from Zoho, etc.)
  - Rate limiting

Example with API key:
```json
{
  "action": "create",
  "apiKey": "secret-key-here",
  "data": { ... }
}
```

---

**Last Updated:** December 4, 2025
