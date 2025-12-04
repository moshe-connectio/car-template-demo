# Car Template Demo - Next.js Dealership Platform

A modern, full-featured vehicle dealership website built with Next.js 16, Tailwind CSS, and Supabase.

## 🎯 Features

- **Dynamic Vehicle Listings** with advanced filtering (brand, categories, text search)
- **SEO-Friendly URLs** with slug format: `{name}-{year}-{id}`
- **Image Gallery** with automatic download from Google Drive and storage in Supabase
- **Multi-Category Support** (15 categories including יוקרה, 4x4, ספורט, etc.)
- **Sold Vehicle Management** with auto-hiding unpublished vehicles
- **Webhook Integration** with Zoho CRM via unique `crmid` field
- **Responsive Design** optimized for mobile and desktop
- **Incremental Static Regeneration (ISR)** for fast page loads

## 🛠 Tech Stack

- **Framework:** Next.js 16.0.7 (with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage (vehicle images)
- **Deployment:** Vercel

## 📋 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── vehicles/[id]/route.ts      # Get single vehicle
│   │   └── webhooks/
│   │       ├── vehicles/route.ts        # Create/update vehicle webhook
│   │       └── upload-image/route.ts    # Image upload webhook
│   ├── vehicles/
│   │   ├── page.tsx                     # Listing page (with filters)
│   │   └── [slug]/page.tsx              # Detail page
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Container.tsx
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   └── vehicles/
│       ├── FilterableVehicleGrid.tsx    # Filtering logic
│       ├── VehicleCard.tsx              # Vehicle card component
│       ├── VehicleFilters.tsx           # Filter UI (brand, categories, search)
│       ├── VehicleGrid.tsx              # Grid wrapper
│       └── VehicleImageGallery.tsx      # Image carousel
├── config/
│   └── dealership.config.ts             # Theme and configuration
├── lib/
│   ├── constants.ts
│   ├── supabaseServerClient.ts
│   ├── utils.ts                         # URL utilities
│   └── vehiclesRepository.ts            # Data access layer
└── styles/
    └── theme.ts                         # Tailwind design tokens
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase project with `vehicles` and `vehicle_images` tables
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone https://github.com/moshe-connectio/car-template-demo.git
cd car-template-demo
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

- **[PROJECT.md](./PROJECT.md)** - Project overview, tech stack, and recent updates
- **[WEBHOOK_DOCS.md](./WEBHOOK_DOCS.md)** - Complete webhook API documentation
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database structure and migrations
- **[DATABASE_MIGRATION_CATEGORY.md](./DATABASE_MIGRATION_CATEGORY.md)** - Categories system setup
- **[IMAGES_IMPLEMENTATION_GUIDE.md](./IMAGES_IMPLEMENTATION_GUIDE.md)** - Image handling
- **[LOCAL_IMAGES_GUIDE.md](./LOCAL_IMAGES_GUIDE.md)** - Local image configuration

## 🔌 Webhook Integration

Send vehicle data via webhook to create or update vehicles:

```bash
curl -X POST "https://your-site.com/api/webhooks/vehicles" \
  -H "Content-Type: application/json" \
  -d '{
    "crmid": "ZOHO-DEAL-12345",
    "data": {
      "slug": "tesla-model-3-2024",
      "title": "Tesla Model 3 2024",
      "brand": "Tesla",
      "model": "Model 3",
      "year": 2024,
      "price": 85000,
      "is_published": true,
      "categories": ["חשמלי", "ספורט"]
    },
    "images": [
      {
        "image_url": "https://drive.google.com/uc?id=FILE_ID&export=view",
        "position": 1
      }
    ]
  }'
```

See [WEBHOOK_DOCS.md](./WEBHOOK_DOCS.md) for complete API documentation.

## 🎨 Customization

### Theme Colors

Edit `src/config/dealership.config.ts`:
```typescript
export const config = {
  colors: {
    primary: '#...',      // Main brand color
    header: '#...',       // Header background
    footer: '#...',       // Footer background
  },
  // ... other settings
}
```

### Categories

Update the categories array in `src/lib/vehiclesRepository.ts`:
```typescript
export const VEHICLE_CATEGORIES = [
  'SUV', 'סדאן', 'ספורט', // ... add your categories
];
```

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Deployment

```bash
npm run build
npm start
```

## 📊 Key Features Explained

### SEO-Friendly URLs
- Vehicles use slug format: `{name}-{year}-{id-suffix}`
- Example: `tesla-model-3-2024-a1b2c3d4`
- Utilities: `generateVehicleSlug()`, `extractIdFromSlug()`

### Image Management
- Images downloaded from Google Drive links
- Automatically uploaded to Supabase Storage
- Folder structure: `vehicles/{slug}-{idSuffix}/`
- Public URLs stored in database

### Advanced Filtering
- Filter by brand (dropdown)
- Multi-select categories (combobox with search)
- Text search across vehicle fields
- Displays "מציג X מתוך Y רכבים"

### Category System
- 15 supported categories
- Each vehicle can have multiple categories
- Categories stored as string[] array in database

## 🐛 Troubleshooting

### Images Not Appearing
- Verify Supabase credentials in `.env.local`
- Check that `*.supabase.co` is in Next.js `remotePatterns`
- Ensure Google Drive URLs are shared publicly

### Webhook Issues
- Verify `crmid` is unique
- Check webhook endpoint is accessible
- Review error response for missing fields

### Filtering Not Working
- Verify database has `categories` column (type: `TEXT[]`)
- Check that category values match those in database

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for server-side) |
| `NEXT_PUBLIC_SITE_URL` | Your site URL (for ISR) |

## 📧 Support

For issues and questions, check the documentation files or contact the development team.

## 📄 License

This project is private. All rights reserved.

---

**Last Updated:** December 4, 2025
