# Car Dealership Template - Project Overview

## 📋 Project Description

A reusable website template for car dealerships and other automotive businesses built with Next.js, TypeScript, and Tailwind CSS. The template is deployed on Vercel with Supabase (PostgreSQL) as the main application database.

**Future integrations:** Zoho CRM integration planned for later phases.

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend:** Node.js (Next.js server actions)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **CRM Integration:** Zoho CRM (planned)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css                    # Global styles with design system CSS variables
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/
│   │   └── webhooks/
│   │       └── vehicles/
│   │           └── route.ts           # Webhook API for external integrations
│   ├── demo/
│   │   └── vehicles/
│   │       └── page.tsx               # Demo page showing vehicles from DB
│   └── vehicles/
│       └── page.tsx                   # Main vehicles page with ISR
├── components/
│   ├── layout/
│   │   ├── Container.tsx              # Reusable container wrapper
│   │   ├── Header.tsx                 # Site header with navigation
│   │   └── Footer.tsx                 # Site footer with contact info
│   └── vehicles/
│       ├── VehicleCard.tsx            # Individual vehicle card component
│       └── VehicleGrid.tsx            # Responsive grid with empty state
├── lib/
│   ├── supabaseServerClient.ts        # Server-side Supabase client
│   ├── vehiclesRepository.ts          # Vehicles data access layer
│   ├── constants.ts                   # Application constants and configuration
│   └── utils.ts                       # Formatting utilities
├── styles/
│   ├── theme.ts                       # Design tokens (colors, spacing, typography)
│   └── utils.ts                       # Theme utility functions
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
| slug | text | unique, not null | URL-friendly identifier |
| title | text | not null | Vehicle title/name |
| brand | text | not null | Vehicle brand (e.g., Toyota) |
| model | text | not null | Vehicle model (e.g., Camry) |
| year | integer | not null | Model year |
| price | numeric(12,2) | not null | Vehicle price |
| km | integer | nullable | Mileage in kilometers |
| gear_type | text | nullable | Transmission type (e.g., Manual, Automatic) |
| fuel_type | text | nullable | Fuel type (e.g., Petrol, Diesel, Electric) |
| main_image_url | text | nullable | Primary vehicle image URL |
| short_description | text | nullable | Brief vehicle description |
| raw_data | jsonb | nullable | Additional metadata in JSON format |

**Status:** 3 example vehicles already inserted.

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

### 2. Vehicles Repository (`src/lib/vehiclesRepository.ts`)
- ✓ `Vehicle` TypeScript type matching the database schema
- ✓ `getPublishedVehicles()` – Fetches all published vehicles ordered by creation date (newest first)
- ✓ `getVehicleBySlug(slug: string)` – Fetches a single vehicle by slug
- ✓ Proper error handling with console logging
- ✓ Detailed logging for debugging

### 3. Demo Page (`src/app/demo/vehicles/page.tsx`)
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
- ✓ Live deployment working at: `https://car-template-demo.vercel.app/demo/vehicles`
- ✓ All 3 vehicles displaying correctly in production

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

# Navigate to the demo page
# http://localhost:3000/demo/vehicles

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

**Last Updated:** December 4, 2025 - Added crmid field and upsert functionality for Zoho CRM integration
