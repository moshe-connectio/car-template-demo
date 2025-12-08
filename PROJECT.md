# Car Dealership Template - Project Overview

## 📋 Project Description

A reusable website template for car dealerships and other automotive businesses built with Next.js, TypeScript, and Tailwind CSS. The template is deployed on Vercel with Supabase (PostgreSQL) as the main application database.

**Future integrations:** Zoho CRM integration planned for later phases.

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 16.0.7 (App Router, Turbopack), TypeScript, Tailwind CSS v4
- **Backend:** Node.js (Next.js API routes, webhooks)
- **Database:** Supabase (PostgreSQL) with Storage
- **Deployment:** Vercel (ISR 60s)
- **CRM Integration:** Zoho CRM (webhooks)

---

## 📁 Project Structure

```
src/
├── core/                              # Shared configuration and core libraries
│   ├── config/
│   │   ├── site.config.ts             # Site configuration (name, contact, social)
│   │   └── theme.config.ts            # Theme configuration (colors, fonts)
│   └── lib/
│       ├── supabase.ts                # Supabase server client
│       └── constants.ts               # Constants and routes
├── shared/                            # Reusable components and utilities
│   ├── components/
│   │   └── layout/
│   │       ├── Container.tsx          # Reusable container wrapper
│   │       ├── Header.tsx             # Site header with navigation
│   │       └── Footer.tsx             # Site footer with contact info
│   └── utils/
│       ├── formatting.ts              # Formatting utilities (prices, dates)
│       └── theme.ts                   # Theme utilities
├── modules/                           # Feature modules
│   └── vehicles/                      # Vehicle module
│       ├── components/
│       │   ├── VehicleCard.tsx
│       │   ├── VehicleGrid.tsx
│       │   ├── VehicleFilters.tsx
│       │   ├── FilterableVehicleGrid.tsx
│       │   └── VehicleImageGallery.tsx
│       └── lib/
│           └── repository.ts          # Vehicle data access layer
└── app/                               # Next.js App Router
    ├── globals.css                    # Global styles with design system CSS variables
    ├── layout.tsx                     # Root layout
    ├── page.tsx                       # Home page
    ├── api/
    │   ├── vehicles/
    │   │   └── [id]/route.ts
    │   ├── cron/
    │   │   └── cleanup-vehicles/
    │   │       └── route.ts
    │   └── webhooks/
    │       ├── upload-image/
    │       │   └── route.ts
    │       └── vehicles/
    │           ├── route.ts
    │           ├── delete/
    │           │   └── route.ts
    │           └── mark-sold/
    │               └── route.ts
    └── vehicles/
        ├── page.tsx                   # Vehicles listing page with ISR
        └── [slug]/page.tsx            # Vehicle detail page
public/
```

---

## 🗄️ Database Schema

### `public.vehicles` table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default: gen_random_uuid() | Unique identifier |
| created_at | timestamptz | default: now() | Creation timestamp |
| updated_at | timestamptz | default: now() | Last update timestamp |
| is_published | boolean | default: true | Publication status |
| external_id | text | nullable | External system ID |
| crmid | text | nullable, unique | CRM ID for webhook upsert |
| slug | text | unique, not null | URL-friendly identifier |
| title | text | not null | Vehicle title/name |
| brand | text | not null | Vehicle brand (e.g., Toyota) |
| model | text | not null | Vehicle model (e.g., Camry) |
| year | integer | not null | Model year |
| price | numeric(12,2) | not null | Vehicle price |
| km | integer | nullable | Mileage in kilometers |
| gear_type | text | nullable | Transmission type (e.g., Manual, Automatic) |
| fuel_type | text | nullable | Fuel type (e.g., Petrol, Diesel, Electric) |
| categories | text[] | default: '{}' | Array of vehicle categories |
| main_image_url | text | nullable | Primary vehicle image URL |
| short_description | text | nullable | Brief vehicle description |
| raw_data | jsonb | nullable | Additional metadata in JSON format |

### `public.vehicle_images` table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default: gen_random_uuid() | Unique identifier |
| vehicle_id | uuid | FK to vehicles(id) | Reference to vehicle |
| image_url | text | not null | Image URL (from Supabase Storage) |
| position | integer | 1-20, not null | Image order (1 = primary) |
| alt_text | text | nullable | Image description |
| uploaded_at | timestamptz | default: now() | Upload timestamp |

### `vehicle-images` Supabase Storage bucket

- **Type:** Public bucket
- **Path structure:** `vehicles/{slug}-{idSuffix}/{position}-{timestamp}.{ext}`
- **Example:** `vehicles/honda-civic-2024-097dc71b/1-1764867249536.jpg`

---

## 🔧 Environment Variables

Required environment variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
SUPABASE_DB_SCHEMA=public
```

---

## ✅ Completed Features

### 1. Server-side Supabase Client (`src/lib/supabaseServerClient.ts`)
- ✓ Initializes Supabase client with service role key (server-only)
- ✓ Validates required environment variables with detailed logging
- ✓ Throws clear errors if env vars are missing
- ✓ No client-side exposure of sensitive keys

### 2. Vehicles Repository (`src/modules/vehicles/lib/repository.ts`)
- ✓ `Vehicle` TypeScript type matching the database schema
- ✓ `getPublishedVehicles()` – Fetches all published vehicles ordered by creation date (newest first)
- ✓ `getVehicleBySlug(slug: string)` – Fetches a single vehicle by slug
- ✓ Proper error handling with console logging
- ✓ Detailed logging for debugging

### 3. Vehicles Page (`src/app/vehicles/page.tsx`)
- ✓ Server component (no "use client" directive)
- ✓ Incremental Static Regeneration (ISR) with 60-second revalidation
- ✓ Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
- ✓ Vehicle cards displaying:
  - Title (heading)
  - Brand, model, year
  - Price formatted with Hebrew locale and ₪ symbol
  - Mileage (km) if available
  - Short description if available
  - Main image (plain `<img>` tag)
- ✓ Error handling with user-friendly messages
- ✓ "No vehicles found" message when empty
- ✓ Tailwind-based styling with hover effects and shadows

### 4. Vercel Deployment
- ✓ Environment variables configured in Vercel
- ✓ Live deployment working at: `https://car-template-demo.vercel.app`
- ✓ All vehicles displaying correctly in production

### 5. Webhook API (`src/app/api/webhooks/vehicles`)
- ✓ POST endpoint for creating vehicles
- ✓ POST endpoint for updating vehicles
- ✓ POST endpoint for upserting vehicles (create or update by CRM ID)
- ✓ `crmid` field to prevent duplicates from external systems
- ✓ Smart logic: checks if crmid exists, updates if yes, creates if no
- ✓ Full validation and error handling
- ✓ Comprehensive API documentation in `WEBHOOK_DOCS.md`
- ✓ Examples for cURL, JavaScript, and Python
- ✓ Ready for Zoho CRM integration

---

## 🎨 Design System

The project uses a comprehensive design system with centralized configuration to ensure consistency and maintainability.

### Structure

- **`src/styles/theme.ts`** - Design tokens (colors, spacing, typography, shadows, transitions)
- **`src/styles/utils.ts`** - Helper functions for accessing theme values (`getColor`, `getSpacing`, etc.)
- **`src/lib/constants.ts`** - Application configuration (`APP_CONFIG`, `ROUTES`, `CONTACT_INFO`)
- **`src/lib/utils.ts`** - Formatting utilities (`formatPrice`, `formatKilometers`, `formatDate`)
- **`src/app/globals.css`** - CSS custom properties for global design tokens

### Color Palette

```typescript
colors: {
  primary: { 50-900 scale, default: #2563eb }
  secondary: { purple gradient }
  success: { light, base, dark }
  warning: { light, base, dark }
  error: { light, base, dark }
  gray: { 50-900 scale }
  background: { primary, secondary, tertiary }
  text: { primary, secondary, tertiary, inverse }
  border: { light, base, dark }
}
```

### Usage Guidelines

- **No hardcoded colors** - All colors should reference the design system
- **Use constants** - Import from `@/lib/constants` for app configuration
- **Formatting utilities** - Use `formatPrice`, `formatKilometers`, etc. from `@/lib/utils`
- **RTL Support** - All layouts support right-to-left (Hebrew)

---

## 🚀 How to Run

```bash
# Install dependencies
npm install

# Create .env.local with your Supabase credentials
# (see Environment Variables section above)

# Run development server
npm run dev

# Navigate to the vehicles page
# http://localhost:3000/vehicles

# Build for production
npm run build
```

---

## 📝 Next Steps / Roadmap

### ✅ Completed
- [x] Supabase integration with server-side client
- [x] Vehicle repository with CRUD operations
- [x] Webhook API (create/update/upsert)
- [x] Professional component architecture (Header, Footer, VehicleCard, VehicleGrid, Container)
- [x] Design system with theme tokens and constants
- [x] ISR (Incremental Static Regeneration) with 60-second revalidation
- [x] Vercel deployment with environment variables

### 🔄 In Progress
- [ ] Test webhook in production (create/update vehicles via API)
- [ ] Refine responsive design and mobile experience

### 📋 Planned Features
- [ ] Create individual vehicle detail page (`src/app/vehicles/[slug]/page.tsx`)
- [ ] Add vehicle search and filtering functionality
- [ ] Enhance home page (`src/app/page.tsx`) with featured vehicles
- [ ] Implement Zoho CRM webhook integration
- [ ] Add vehicle comparison feature
- [ ] Implement Next.js Image component for image optimization
- [ ] Implement SEO metadata for vehicle pages (dynamic Open Graph tags)
- [ ] Create contact form (linked to Zoho CRM)
- [ ] Create admin panel for vehicle management
- [ ] Add analytics tracking
- [ ] Mobile-responsive refinements and A/B testing

---

## 🔗 Useful Links

- **Supabase Project Dashboard:** [Link to your Supabase dashboard]
- **Vercel Deployment:** [Link to your Vercel project]
- **GitHub Repository:** https://github.com/moshe-connectio/car-template-demo
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## 📚 Architecture Notes

- All Supabase queries happen server-side for security
- Data access is abstracted in the repository layer (`vehiclesRepository.ts`)
- Server components are preferred over client components
- Folder structure under `src/` is organized for scalability
- Future integrations (Zoho, etc.) will have their own subdirectories under `src/lib/`

---

## 📝 Session Summary (December 4, 2025)

### ✅ Completed Features

1. **SEO-Friendly Vehicle URLs**
   - Format: `{name}-{year}-{idSuffix}` (e.g., tesla-model-3-2024-a1b2c3d4)
   - Utilities: `generateVehicleSlug()`, `extractIdFromSlug()`
   - Enhanced detail pages with 600px image height

2. **Image Management System**
   - Webhook downloads images from Google Drive
   - Uploads to Supabase Storage: `vehicles/{slug}-{idSuffix}/`
   - File structure: `{position}-{timestamp}.{ext}`
   - Fixed Next.js image config for `*.supabase.co` domain
   - Handles errors gracefully (partial image processing)

3. **Multi-Category Support**
   - Vehicle type: `categories: string[]` (15 possible categories)
   - Categories: SUV, סדאן, האצ'בק, מיני ואן, קופה, קרוסאובר, טנדר, ספורט, חשמלי, היברידי, 4x4, יוקרה, משפחתית, מנהלים, 8 מושבים
   - Database migration: `ALTER TABLE vehicles ADD COLUMN categories TEXT[] DEFAULT '{}'`
   - Helper: `getUniqueCategories()` - flattens and deduplicates arrays

4. **Advanced Filtering System**
   - VehicleFilters component with:
     - Brand filter (dropdown, single select)
     - Categories filter (combobox with search, multi-select)
     - Text search across 5 fields
   - FilterableVehicleGrid with memoized filtering
   - Filtering logic: ANY category match, brand exact match, search includes
   - Count display: "מציג X מתוך Y רכבים"

5. **Sold Vehicle Management**
   - `is_published` field controls vehicle visibility
   - Automatically hidden from listings when not published
   - Cleanup: deletes unpublished vehicles older than 2 days

### 🔧 Key Code Changes

**Webhook Processing Pipeline** (`src/app/api/webhooks/vehicles/route.ts`):
```typescript
// Download from Google Drive
const downloadImage = (imageUrl) => {
  // Extracts file ID, converts to direct download format
  // Returns Buffer with validation
}

// Upload to Supabase Storage
const uploadImageToSupabase = (buffer, slug, id, position, filename) => {
  // Creates: vehicles/{slug}-{idSuffix}/
  // Returns public Supabase URL
}

// Orchestrator function
const processAndUploadImages = async (vehicleId, slug, images) => {
  // Sequential processing with error handling per image
  // Webhook succeeds even if some images fail
}
```

**URL Utilities** (`src/lib/utils.ts`):
```typescript
// SEO slug generation
generateVehicleSlug(title, year, id) // "tesla-model-3-2024-a1b2c3d4"

// ID extraction from slug
extractIdFromSlug(slug) // Returns 8-char ID with UUID validation
```

**Type Updates** (`src/lib/vehiclesRepository.ts`):
```typescript
interface Vehicle {
  // ... other fields
  categories: string[] // Changed from single string to array
  is_published: boolean // For sold status
  image_urls?: string[] // From Supabase
}
```

### ✅ Test Results

**Webhook Test (Successful)**:
- Downloaded 561KB image from Google Drive
- Uploaded to Supabase Storage successfully
- Image accessible via public URL
- Stored reference in database
- No Next.js image config errors

**Filtering Test (Successful)**:
- Multi-select categories working correctly
- Brand filter functioning properly
- Text search across vehicle fields
- Count display accurate
- Active filters display with removal

### 📦 Current Project Status

**Production Ready**: ✅
- All features implemented and tested
- Code compiles without errors
- All commits pushed to main branch
- ISR (60s revalidation) configured on Vercel
- Supabase images configured and accessible

**Remaining Tasks**: None blocking

---

**Last Updated:** December 4, 2025 - Completed filtering, image upload, multi-category support, and SEO URLs
