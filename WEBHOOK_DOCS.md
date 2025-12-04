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
    "km": 0,
    "gear_type": "Automatic",
    "fuel_type": "Petrol",
    "main_image_url": "https://example.com/image.jpg",
    "short_description": "Beautiful Toyota Camry with low mileage",
    "external_id": "ZOHO-12345",
    "raw_data": { "color": "Black", "transmission": "CVT" }
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

---

## Optional Fields

For both create and update actions, you can include:
- `km` - Mileage in kilometers
- `gear_type` - Transmission type (e.g., "Manual", "Automatic", "CVT")
- `fuel_type` - Fuel type (e.g., "Petrol", "Diesel", "Electric", "Hybrid")
- `main_image_url` - URL to the main vehicle image
- `short_description` - Brief description of the vehicle
- `external_id` - Reference ID from external system (e.g., Zoho CRM ID)
- `raw_data` - Additional metadata as JSON object

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

### cURL - Create Vehicle

```bash
curl -X POST https://car-template-demo.vercel.app/api/webhooks/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "data": {
      "slug": "honda-civic-2024",
      "title": "Honda Civic 2024",
      "brand": "Honda",
      "model": "Civic",
      "year": 2024,
      "price": 95000,
      "is_published": true,
      "km": 0,
      "gear_type": "Automatic",
      "fuel_type": "Petrol",
      "main_image_url": "https://example.com/civic.jpg",
      "short_description": "New Honda Civic with warranty"
    }
  }'
```

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

// Usage
createVehicle({
  slug: 'bmw-x5-2024',
  title: 'BMW X5 2024',
  brand: 'BMW',
  model: 'X5',
  year: 2024,
  price: 250000,
  is_published: true,
}).then(console.log).catch(console.error);
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

# Usage
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

Once Zoho CRM integration is implemented, webhooks can be triggered automatically when:
- A new deal is won
- Vehicle information is updated
- Inventory status changes

Example integration flow:
1. Zoho CRM sends webhook to `/api/webhooks/vehicles`
2. Vehicle data is created/updated in Supabase
3. Next.js ISR revalidates the demo page
4. Updated vehicles appear on the website automatically

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
