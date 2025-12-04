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
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── demo/
│       └── vehicles/
│           └── page.tsx          # Demo page showing vehicles from DB
├── lib/
│   ├── supabaseServerClient.ts   # Server-side Supabase client
│   └── vehiclesRepository.ts     # Vehicles data access layer
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
- ✓ Full validation and error handling
- ✓ Comprehensive API documentation in `WEBHOOK_DOCS.md`
- ✓ Examples for cURL, JavaScript, and Python
- ✓ Ready for Zoho CRM integration

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
```

---

## 📝 Next Steps / Roadmap

- [ ] Test webhook in production (create/update vehicles via API)
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

**Last Updated:** December 4, 2025 - Webhook API implemented and deployed, ready for third-party integrations
