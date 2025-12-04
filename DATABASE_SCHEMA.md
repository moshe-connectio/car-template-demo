# Database Schema

This document describes the Supabase PostgreSQL database schema for the Car Dealership Template.

## Tables

### `vehicles` (Already exists)

Main table for vehicle inventory.

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_published BOOLEAN DEFAULT false,
  external_id TEXT,
  crmid TEXT UNIQUE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  km INTEGER,
  gear_type TEXT,
  fuel_type TEXT,
  main_image_url TEXT,
  short_description TEXT,
  raw_data JSONB
);

-- Indexes
CREATE INDEX idx_vehicles_is_published ON vehicles(is_published);
CREATE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE INDEX idx_vehicles_crmid ON vehicles(crmid);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at DESC);
```

**Note:** The `slug` field is NOT unique because multiple vehicles can have the same name/model. The `crmid` (CRM ID) is the unique identifier used for upsert operations - if a vehicle with the same `crmid` exists, it will be updated instead of creating a duplicate.

### `vehicle_images` (NEW - Needs to be created)

Stores up to 10 images per vehicle (1 primary + 9 secondary).

```sql
CREATE TABLE vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 10),
  alt_text TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (vehicle_id, position)
);

-- Indexes
CREATE INDEX idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX idx_vehicle_images_position ON vehicle_images(vehicle_id, position);
```

## Setting up in Supabase

### Option 1: Using the Supabase Web Console

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query" or "New Snippet"
4. Copy and paste the SQL code below
5. Click "Run" to execute

```sql
-- Create the vehicle_images table
CREATE TABLE IF NOT EXISTS vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 10),
  alt_text TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (vehicle_id, position)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_position ON vehicle_images(vehicle_id, position);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
```

### Option 2: Using Supabase CLI (Recommended for Version Control)

1. Create a migration file:
   ```bash
   supabase migration new create_vehicle_images_table
   ```

2. Edit the generated migration file in `supabase/migrations/` and add the SQL above

3. Apply the migration:
   ```bash
   supabase migration up
   ```

## API Usage

### Image Management Functions

The repository provides several image management functions:

#### Get Vehicle Images
```typescript
const images = await getVehicleImages(vehicleId);
```

#### Add Images to a Vehicle
```typescript
const newImages = await addImagesToVehicle(vehicleId, [
  {
    vehicle_id: vehicleId,
    image_url: 'https://example.com/image1.jpg',
    position: 1,
    alt_text: 'Primary vehicle image'
  },
  {
    vehicle_id: vehicleId,
    image_url: 'https://example.com/image2.jpg',
    position: 2,
    alt_text: 'Side view'
  }
]);
```

#### Update an Image
```typescript
const updated = await updateVehicleImage(imageId, {
  image_url: 'https://example.com/new-image.jpg',
  alt_text: 'Updated description'
});
```

#### Delete an Image
```typescript
await deleteVehicleImage(imageId);
```

#### Reorder Images
```typescript
await reorderVehicleImages(vehicleId, [
  { id: 'image-id-1', position: 2 },
  { id: 'image-id-2', position: 1 }
]);
```

### Webhook Usage

When creating or updating vehicles via the webhook, you can include images:

```bash
curl -X POST http://localhost:3000/api/webhooks/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "data": {
      "slug": "2024-toyota-camry",
      "title": "2024 Toyota Camry",
      "brand": "Toyota",
      "model": "Camry",
      "year": 2024,
      "price": 28000,
      "is_published": true,
      "km": 100,
      "fuel_type": "Hybrid",
      "gear_type": "Automatic"
    },
    "images": [
      {
        "image_url": "https://example.com/image1.jpg",
        "position": 1,
        "alt_text": "Front view"
      },
      {
        "image_url": "https://example.com/image2.jpg",
        "position": 2,
        "alt_text": "Side view"
      }
    ]
  }'
```

## Data Types

### VehicleImage Type

```typescript
export type VehicleImage = {
  id: string;              // UUID
  vehicle_id: string;      // UUID, references vehicles.id
  image_url: string;       // URL to image
  position: number;        // 1-10 (1 is primary image)
  alt_text: string | null; // Accessibility text
  uploaded_at: string;     // ISO timestamp
};
```

## Notes

- **Position Field**: Images are ordered by position 1-10. Position 1 is the primary/main image
- **Cascade Delete**: If a vehicle is deleted, all associated images are automatically deleted
- **Unique Constraint**: Each vehicle can only have one image at each position (1-10)
- **Fallback Behavior**: If the vehicle_images table doesn't exist, the application will gracefully fall back to fetching vehicles without image relationships
