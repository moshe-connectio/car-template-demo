# New Vehicles API Documentation

## Overview
Complete REST API for managing new vehicles data (manufacturers, models, trim levels, and specifications).

## Endpoints

### Manufacturers

#### POST /api/new-vehicles/manufacturers
Add a new manufacturer.

**Request Body:**
```json
{
  "name": "Toyota",
  "slug": "toyota",
  "logo_url": "https://...",
  "banner_url": "https://...",
  "description": "Japanese automotive manufacturer",
  "country": "Japan",
  "website_url": "https://toyota.com",
  "display_order": 1
}
```

**Required Fields:** `name`, `slug`

**Response:**
```json
{
  "id": "uuid",
  "name": "Toyota",
  "slug": "toyota",
  "logo_url": "https://...",
  "created_at": "2024-01-15T10:30:00Z",
  ...
}
```

**Status Codes:** 
- `201` - Created successfully
- `400` - Invalid request (missing required fields or duplicate slug)
- `500` - Server error

---

#### GET /api/new-vehicles/manufacturers
Get all manufacturers with counts of models and trim levels.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Toyota",
    "slug": "toyota",
    "model_count": 5,
    "trim_count": 15,
    ...
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Models

#### POST /api/new-vehicles/models
Add a new model to a manufacturer.

**Request Body:**
```json
{
  "manufacturer_id": "uuid",
  "name": "Camry",
  "slug": "camry",
  "description": "Midsize sedan",
  "image_url": "https://...",
  "body_type": "Sedan",
  "segment": "Midsize",
  "year_from": 2024,
  "year_to": 2025,
  "base_price": 25000,
  "display_order": 1
}
```

**Required Fields:** `manufacturer_id`, `name`, `slug`

**Response:**
```json
{
  "id": "uuid",
  "manufacturer_id": "uuid",
  "name": "Camry",
  "slug": "camry",
  "base_price": 25000,
  "created_at": "2024-01-15T10:30:00Z",
  ...
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Invalid request
- `500` - Server error

---

#### GET /api/new-vehicles/models?manufacturer_id=xxx
Get models, optionally filtered by manufacturer.

**Query Parameters:**
- `manufacturer_id` (optional) - Filter by manufacturer UUID

**Response:**
```json
[
  {
    "id": "uuid",
    "manufacturer_id": "uuid",
    "name": "Camry",
    "slug": "camry",
    "manufacturer_name": "Toyota",
    "price_range": { "min": 25000, "max": 32000 },
    ...
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Trim Levels

#### POST /api/new-vehicles/trim-levels
Add a new trim level to a model.

**Request Body:**
```json
{
  "model_id": "uuid",
  "name": "LE",
  "slug": "le",
  "description": "Entry-level trim",
  "price": 25000,
  "transmission": "Automatic CVT",
  "engine_type": "2.5L 4-Cylinder",
  "fuel_type": "Gasoline",
  "power_hp": 203,
  "torque_nm": 260,
  "acceleration_0_100": 8.5,
  "top_speed": 220,
  "fuel_consumption": 9.5,
  "co2_emissions": 225,
  "body_dimensions": {
    "length": 4885,
    "width": 1840,
    "height": 1455
  },
  "weight": 1550,
  "seats": 5,
  "doors": 4,
  "trunk_volume": 450,
  "display_order": 1
}
```

**Required Fields:** `model_id`, `name`, `slug`, `price`

**Response:**
```json
{
  "id": "uuid",
  "model_id": "uuid",
  "name": "LE",
  "slug": "le",
  "price": 25000,
  "power_hp": 203,
  "created_at": "2024-01-15T10:30:00Z",
  ...
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Invalid request
- `500` - Server error

---

#### GET /api/new-vehicles/trim-levels?model_id=xxx
Get trim levels, optionally filtered by model.

**Query Parameters:**
- `model_id` (optional) - Filter by model UUID

**Response:**
```json
[
  {
    "id": "uuid",
    "model_id": "uuid",
    "name": "LE",
    "slug": "le",
    "price": 25000,
    "manufacturer_name": "Toyota",
    "model_name": "Camry",
    "power_hp": 203,
    ...
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### Specifications

#### POST /api/new-vehicles/specifications
Add a specification to a trim level.

**Request Body:**
```json
{
  "trim_id": "uuid",
  "spec_key": "aux_input",
  "spec_value": "Yes",
  "category": "Entertainment",
  "display_order": 1
}
```

**Required Fields:** `trim_id`, `spec_key`, `spec_value`

**Response:**
```json
{
  "id": "uuid",
  "trim_id": "uuid",
  "spec_key": "aux_input",
  "spec_value": "Yes",
  "category": "Entertainment",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Invalid request
- `500` - Server error

---

#### GET /api/new-vehicles/specifications?trim_id=xxx&category=xxx
Get specifications, optionally filtered by trim and/or category.

**Query Parameters:**
- `trim_id` (optional) - Filter by trim level UUID
- `category` (optional) - Filter by specification category

**Response:**
```json
[
  {
    "id": "uuid",
    "trim_id": "uuid",
    "spec_key": "aux_input",
    "spec_value": "Yes",
    "category": "Entertainment",
    "display_order": 1
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## Example Usage

### Add a Complete Vehicle

**Step 1: Add Manufacturer**
```bash
curl -X POST http://localhost:3000/api/new-vehicles/manufacturers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "BMW",
    "slug": "bmw",
    "country": "Germany",
    "display_order": 1
  }'
```

**Response:** `{ "id": "mfg-123", "name": "BMW", ... }`

**Step 2: Add Model**
```bash
curl -X POST http://localhost:3000/api/new-vehicles/models \
  -H "Content-Type: application/json" \
  -d '{
    "manufacturer_id": "mfg-123",
    "name": "3 Series",
    "slug": "3-series",
    "body_type": "Sedan",
    "base_price": 45000
  }'
```

**Response:** `{ "id": "mdl-456", "manufacturer_id": "mfg-123", ... }`

**Step 3: Add Trim Level**
```bash
curl -X POST http://localhost:3000/api/new-vehicles/trim-levels \
  -H "Content-Type: application/json" \
  -d '{
    "model_id": "mdl-456",
    "name": "330i",
    "slug": "330i",
    "price": 45000,
    "engine_type": "2.0L Turbocharged",
    "power_hp": 255
  }'
```

**Response:** `{ "id": "trim-789", "model_id": "mdl-456", ... }`

**Step 4: Add Specifications** (Optional)
```bash
curl -X POST http://localhost:3000/api/new-vehicles/specifications \
  -H "Content-Type: application/json" \
  -d '{
    "trim_id": "trim-789",
    "spec_key": "leather_seats",
    "spec_value": "Available",
    "category": "Interior"
  }'
```

---

## Error Handling

All endpoints return error responses in this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common Errors:**
- `name and slug are required` (400) - Missing required field
- `manufacturer_id, name, and slug are required` (400) - Missing required field
- `model_id, name, slug, and price are required` (400) - Missing required field
- `trim_id, spec_key, and spec_value are required` (400) - Missing required field
- `Internal server error` (500) - Unexpected server error

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Slugs must be unique within their resource type
- All POST requests return the created object with generated ID and timestamps
- GET requests support ordering by `display_order` and other fields
- The API uses the same Supabase client as the rest of the application
- All endpoints support the application's authentication context
