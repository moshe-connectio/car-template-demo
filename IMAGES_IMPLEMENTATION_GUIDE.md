# Vehicle Images Implementation Guide

## Quick Start

The car dealership template now supports up to **10 images per vehicle** (1 primary + 9 secondary images). This guide walks you through setting it up and using it.

## Prerequisites

1. Your Supabase project is set up and running
2. The `vehicles` table already exists
3. You have access to the Supabase SQL editor or CLI

## Step 1: Create the Database Table

### Using Supabase Web Console

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste this SQL:

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

5. Click **Run**

### Using Supabase CLI

```bash
# Create a new migration
supabase migration new create_vehicle_images_table

# Edit the generated file and add the SQL above
# Then apply the migration
supabase migration up
```

## Step 2: Verify the Installation

You can verify that the vehicle image gallery is working by:

1. Building the project locally:
   ```bash
   npm run build
   ```

2. Running the development server:
   ```bash
   npm run dev
   ```

3. Visiting the vehicles page to see the gallery component

## How to Use Images

### Option A: Add Images via Webhook API

Send a POST request to `/api/webhooks/vehicles` with images included:

```bash
curl -X POST http://localhost:3000/api/webhooks/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "data": {
      "slug": "2024-honda-civic",
      "title": "2024 Honda Civic",
      "brand": "Honda",
      "model": "Civic",
      "year": 2024,
      "price": 28500,
      "is_published": true
    },
    "images": [
      {
        "image_url": "https://example.com/civic-front.jpg",
        "position": 1,
        "alt_text": "Front view"
      },
      {
        "image_url": "https://example.com/civic-side.jpg",
        "position": 2,
        "alt_text": "Side view"
      }
    ]
  }'
```

### Option B: Add Images Programmatically

Using the repository functions in `src/lib/vehiclesRepository.ts`:

```typescript
import {
  addImagesToVehicle,
  updateVehicleImage,
  deleteVehicleImage,
  reorderVehicleImages,
} from '@/lib/vehiclesRepository';

// Add images
const newImages = await addImagesToVehicle('vehicle-id', [
  {
    vehicle_id: 'vehicle-id',
    image_url: 'https://example.com/image1.jpg',
    position: 1,
    alt_text: 'Front view',
  },
  {
    vehicle_id: 'vehicle-id',
    image_url: 'https://example.com/image2.jpg',
    position: 2,
    alt_text: 'Side view',
  },
]);

// Update an image
await updateVehicleImage('image-id', {
  image_url: 'https://example.com/new-image.jpg',
  alt_text: 'Updated description',
});

// Delete an image
await deleteVehicleImage('image-id');

// Reorder images
await reorderVehicleImages('vehicle-id', [
  { id: 'image-id-1', position: 2 },
  { id: 'image-id-2', position: 1 },
]);
```

## Image Gallery Component

The `VehicleImageGallery` component automatically displays all images for a vehicle:

```typescript
import VehicleImageGallery from '@/components/vehicles/VehicleImageGallery';
import { Vehicle } from '@/lib/vehiclesRepository';

function MyComponent({ vehicle }: { vehicle: Vehicle }) {
  return (
    <VehicleImageGallery
      images={vehicle.images}
      vehicleTitle={vehicle.title}
    />
  );
}
```

### Features

- **Primary Image (Position 1)**: Displayed prominently with hover zoom effect
- **Thumbnail Navigation**: Up to 9 secondary images (positions 2-10)
- **Image Counters**: Shows total images available
- **Position Badges**: Visible on each image showing its position (1-10)
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: Alt text support for screen readers
- **Smooth Transitions**: CSS animations for better UX
- **Fallback**: Shows placeholder if no images available

## Image Guidelines

### Position System

- **Position 1**: Primary image (main display)
- **Positions 2-10**: Secondary images

### Requirements

- **Image URLs**: Must be valid and publicly accessible
- **Position**: Must be between 1-10
- **Uniqueness**: Each position per vehicle must be unique
- **Alt Text**: Recommended for accessibility and SEO

### Best Practices

1. **Primary Image (Position 1)**:
   - Use a high-quality front-view photo
   - Should be the most appealing angle
   - Recommended size: 1200x800px or similar aspect ratio

2. **Secondary Images (Positions 2-10)**:
   - Vary the angles: side, rear, interior, features
   - Include detail shots: dashboard, seats, wheels
   - Maintain consistent image quality
   - Keep file sizes reasonable for web (< 500KB per image)

3. **Alt Text**:
   - Describe what's visible in the image
   - Example: "Red Honda Civic front 3-quarter view"
   - Include relevant details: color, angle, features

## Database Schema Reference

### vehicle_images Table

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
```

**Indexes:**
- `idx_vehicle_images_vehicle_id`: Optimizes queries by vehicle_id
- `idx_vehicle_images_position`: Optimizes ordering by position

**Constraints:**
- `FOREIGN KEY (vehicle_id)`: Cascade delete removes images when vehicle is deleted
- `UNIQUE (vehicle_id, position)`: One image per position per vehicle
- `CHECK position >= 1 AND position <= 10`: Position must be 1-10

## Graceful Fallback

If the `vehicle_images` table doesn't exist yet:

1. The application will automatically detect the missing relationship
2. It will gracefully fall back to fetching vehicles without images
3. You'll see a warning in the console: `⚠️ vehicle_images table not found or relationship not defined, falling back to basic fetch`
4. Once the table is created, images will automatically be included in queries

This allows you to deploy the code before creating the database table.

## Troubleshooting

### "Could not find a relationship between 'vehicles' and 'vehicle_images'"

**Solution:** The `vehicle_images` table doesn't exist yet. Run the SQL migration in Step 1.

### Images not showing up

1. Check that images are in the database:
   ```sql
   SELECT * FROM vehicle_images WHERE vehicle_id = 'your-vehicle-id';
   ```

2. Verify image URLs are valid and publicly accessible

3. Check browser console for any errors

### Position validation error

**Error:** "Image position must be between 1 and 10"

**Solution:** Ensure all image positions are integers between 1-10, with each position being unique per vehicle.

## Advanced Usage

### Batch Update Images

When updating a vehicle through the webhook, you can:

1. **Replace all images**: Delete old images and add new ones
2. **Add new images**: Include images with unused positions
3. **Update existing images**: Modify image URL or alt_text

### Image Ordering

Images are always displayed in order by position (1-10). To reorder:

```typescript
await reorderVehicleImages('vehicle-id', [
  { id: 'img-1', position: 3 },
  { id: 'img-2', position: 1 },
  { id: 'img-3', position: 2 },
]);
```

### Conditional Display

Show/hide the gallery based on whether images exist:

```typescript
{vehicle.images && vehicle.images.length > 0 && (
  <VehicleImageGallery images={vehicle.images} vehicleTitle={vehicle.title} />
)}
```

## Integration with CRM Systems

### Zoho CRM

When syncing vehicles from Zoho CRM, include image URLs:

```json
{
  "action": "upsert",
  "crmid": "ZOHO-DEAL-12345",
  "data": { /* vehicle data */ },
  "images": [
    {
      "image_url": "https://your-storage.com/zoho-assets/car-123-photo-1.jpg",
      "position": 1,
      "alt_text": "Vehicle primary image"
    }
  ]
}
```

### Custom Integrations

1. Store image URLs in your external system
2. When syncing vehicles, fetch those URLs
3. Include them in the webhook payload
4. The system will create the records automatically

## Performance Considerations

- **Image Queries**: The gallery component uses the `vehicle.images` array already loaded
- **No N+1 Queries**: Images are fetched with vehicles in a single query
- **Lazy Loading**: Next.js Image component provides automatic optimization
- **Caching**: ISR (Incremental Static Regeneration) caches pages with images

## Security

- **URL Validation**: URLs must be publicly accessible (no authentication required)
- **Storage**: Use external image hosting (AWS S3, Cloudinary, etc.)
- **Permissions**: Images are deleted automatically when vehicle is deleted (CASCADE)
- **No File Upload**: Current implementation uses external URLs only

## Next Steps

1. ✅ Create the `vehicle_images` table (Step 1)
2. ✅ Verify installation (Step 2)
3. Start adding images to vehicles via webhook or API
4. Customize the gallery appearance if needed (edit `VehicleImageGallery.tsx`)

For more information, see:
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database schema details
- [WEBHOOK_DOCS.md](./WEBHOOK_DOCS.md) - Webhook API documentation
- [README.md](./README.md) - Project overview
