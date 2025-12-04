# Vehicle Images Local Storage Guide

## Overview

The system now supports storing vehicle images **locally in the project** instead of external URLs. Everything happens in **one webhook call**:

1. **Send images** (as base64 or URLs)
2. **Webhook processes** them automatically
3. **Images are saved** to `/public/vehicles/images/`
4. **Database is updated** with local paths
5. **Gallery displays** them immediately

## How It Works

### Single Webhook Call Flow

```
Client sends webhook
    ↓
    ├─ Create/Update vehicle in DB
    ├─ For each image:
    │  ├─ If base64: Save to /public/vehicles/images/{vehicleId}/
    │  ├─ If URL: Use as-is
    │  └─ Store path in database
    └─ Return response with all details
```

## Usage

### Example 1: Create Vehicle with Base64 Images

```bash
curl -X POST http://localhost:3000/api/webhooks/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "data": {
      "slug": "honda-civic-2024",
      "title": "Honda Civic 2024",
      "brand": "Honda",
      "model": "Civic",
      "year": 2024,
      "price": 28500,
      "is_published": true,
      "km": 0,
      "gear_type": "Automatic",
      "fuel_type": "Petrol"
    },
    "images": [
      {
        "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCABQAFADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9k",
        "position": 1,
        "alt_text": "Honda Civic front view"
      },
      {
        "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
        "position": 2,
        "alt_text": "Honda Civic side view"
      }
    ]
  }'
```

**תשובה:**
```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "vehicleId": "550e8400-e29b-41d4-a716-446655440000",
  "action": "created",
  "imagesAdded": 2
}
```

### Example 2: Mixed URLs and Base64

```json
{
  "action": "create",
  "data": { /* vehicle data */ },
  "images": [
    {
      "image_url": "data:image/jpeg;base64,...",
      "position": 1,
      "alt_text": "Front view"
    },
    {
      "image_url": "https://example.com/image2.jpg",
      "position": 2,
      "alt_text": "Side view"
    }
  ]
}
```

התמונות הראשונה תישמר בדיסק, השנייה תישמר כקישור חיצוני.

### Example 3: Update Vehicle with New Images

```bash
curl -X POST http://localhost:3000/api/webhooks/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update",
    "vehicleId": "550e8400-e29b-41d4-a716-446655440000",
    "data": {
      "price": 27500,
      "km": 100
    },
    "images": [
      {
        "image_url": "data:image/jpeg;base64,...",
        "position": 3,
        "alt_text": "Interior"
      }
    ]
  }'
```

## Image Storage Structure

```
public/
└── vehicles/
    └── images/
        ├── {vehicleId-1}/
        │   ├── image-1.jpg  (primary image)
        │   ├── image-2.jpg
        │   └── image-3.png
        ├── {vehicleId-2}/
        │   ├── image-1.jpg
        │   └── image-2.webp
        └── {vehicleId-3}/
            └── image-1.jpeg
```

## Supported Image Formats

- ✅ JPEG / JPG
- ✅ PNG
- ✅ WebP
- ✅ GIF

## URL Formats Supported

### 1. Base64 Data URI
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
data:image/png;base64,iVBORw0KGgoAAAANS...
data:image/webp;base64,UklGRiYAAABXRUJQ...
```

### 2. External URLs
```
https://example.com/images/car.jpg
http://cdn.example.com/photo.png
```

### 3. Relative URLs (after first upload)
```
/vehicles/images/{vehicleId}/image-1.jpg
/vehicles/images/{vehicleId}/image-2.png
```

## Image Specifications

| Property | Value |
|----------|-------|
| Max Size | 5MB |
| Allowed Types | JPEG, PNG, WebP, GIF |
| Max per Vehicle | 10 |
| Position Range | 1-10 |

## Database Storage

Images are stored in the `vehicle_images` table:

```sql
CREATE TABLE vehicle_images (
  id UUID PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id),
  image_url TEXT,              -- Stores: /vehicles/images/{id}/image-1.jpg
  position INTEGER,             -- 1-10
  alt_text TEXT,
  uploaded_at TIMESTAMP
);
```

## API Endpoints

### Upload Image (Alternative Method)

If you prefer uploading images separately:

```bash
curl -X POST http://localhost:3000/api/webhooks/upload-image \
  -F "file=@/path/to/image.jpg" \
  -F "vehicleId=550e8400-e29b-41d4-a716-446655440000" \
  -F "position=1"
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "/vehicles/images/550e8400-e29b-41d4-a716-446655440000/image-1.jpg",
  "vehicleId": "550e8400-e29b-41d4-a716-446655440000",
  "position": 1
}
```

## How to Convert Images to Base64

### Node.js
```javascript
const fs = require('fs');
const imageBuffer = fs.readFileSync('/path/to/image.jpg');
const base64 = imageBuffer.toString('base64');
const dataUri = `data:image/jpeg;base64,${base64}`;
```

### JavaScript (Browser)
```javascript
const file = document.getElementById('imageInput').files[0];
const reader = new FileReader();
reader.onload = (e) => {
  const base64 = e.target.result; // Already includes data:image/jpeg;base64,...
  console.log(base64);
};
reader.readAsDataURL(file);
```

### Python
```python
import base64

with open('/path/to/image.jpg', 'rb') as f:
    image_data = f.read()
    base64_str = base64.b64encode(image_data).decode()
    data_uri = f"data:image/jpeg;base64,{base64_str}"
    print(data_uri)
```

### Linux/Mac Command Line
```bash
# Create base64 string
base64 -i /path/to/image.jpg

# Or with data URI header for JPEG
echo "data:image/jpeg;base64,$(base64 -i /path/to/image.jpg)"
```

## File Serving

Images are automatically served from `/public/vehicles/images/`:

```html
<!-- Image from local storage -->
<img src="/vehicles/images/550e8400-e29b-41d4-a716-446655440000/image-1.jpg" alt="Vehicle" />

<!-- Image from external URL -->
<img src="https://example.com/image.jpg" alt="Vehicle" />
```

## Best Practices

1. **Convert to Base64 Server-Side** when possible to reduce request size
2. **Optimize Images** before conversion (resize, compress)
3. **Use Appropriate Formats**:
   - JPEG for photographs
   - PNG for graphics with transparency
   - WebP for modern browsers (smaller file size)
4. **Add Alt Text** for accessibility and SEO
5. **Position Correctly** - Position 1 is always the primary image

## Troubleshooting

### "File size exceeds 5MB limit"
**Solution:** Compress the image before converting to base64

### "Invalid file type"
**Solution:** Use only JPEG, PNG, WebP, or GIF formats

### Images not showing
**Solution:**
1. Check that position is between 1-10
2. Verify image_url format is correct
3. Check `/public/vehicles/images/` directory exists

### Base64 string too long
**Solution:**
- Resize image to smaller dimensions
- Use lower JPEG quality (80-90%)
- Use WebP format (better compression)

## Example Integration with Zoho CRM

```javascript
// When syncing from Zoho CRM
const zohoCrmAttachment = getAttachmentFromZoho(dealId);
const base64Image = await convertToBase64(zohoCrmAttachment);

const payload = {
  action: 'upsert',
  crmid: dealId,
  data: {
    slug: generateSlug(dealName),
    title: dealName,
    brand: carBrand,
    model: carModel,
    year: carYear,
    price: dealPrice,
    is_published: true
  },
  images: [
    {
      image_url: base64Image,  // Auto-saved locally
      position: 1,
      alt_text: `${dealName} primary image`
    }
  ]
};

await sendWebhook(payload);
```

## File Access

All image files are accessible via Next.js static file serving:

- **Local Files:** `/public/vehicles/images/{vehicleId}/image-{position}.{ext}`
- **Served at:** `http://localhost:3000/vehicles/images/{vehicleId}/image-{position}.{ext}`
- **In Production:** `https://your-domain.com/vehicles/images/{vehicleId}/image-{position}.{ext}`

## Security Notes

- ✅ Files are saved to a designated public directory only
- ✅ Filenames are controlled (cannot overwrite other files)
- ✅ File type validation prevents malicious uploads
- ✅ File size limits prevent abuse
- ✅ All files are world-readable (public static assets)

---

**Remember:** Everything happens in a single webhook call! 🚀
