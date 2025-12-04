/**
 * Application Constants
 * All static values and configuration constants for the application
 */

export const APP_CONFIG = {
  name: 'Car Dealership',
  description: 'מציעים את מגוון הרכבים הטוב ביותר',
  locale: 'he-IL',
  currency: 'ILS',
  currencySymbol: '₪',
} as const;

export const ROUTES = {
  home: '/',
  vehicles: '/vehicles',
  vehicleDetail: (slug: string) => `/vehicles/${slug}`,
  demo: '/demo/vehicles',
  api: {
    webhooks: {
      vehicles: '/api/webhooks/vehicles',
    },
  },
} as const;

export const CONTACT_INFO = {
  phone: '050-123-4567',
  email: 'info@cardealership.com',
  address: 'תל אביב, ישראל',
} as const;

export const SOCIAL_LINKS = {
  facebook: '#',
  instagram: '#',
  whatsapp: '#',
} as const;

export const VEHICLE_FILTERS = {
  gearTypes: ['Manual', 'Automatic', 'CVT', 'DCT'],
  fuelTypes: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'],
  priceRanges: [
    { label: 'עד 50,000 ₪', min: 0, max: 50000 },
    { label: '50,000 - 100,000 ₪', min: 50000, max: 100000 },
    { label: '100,000 - 200,000 ₪', min: 100000, max: 200000 },
    { label: '200,000+ ₪', min: 200000, max: Infinity },
  ],
  yearRanges: [
    { label: '2024-2025', min: 2024, max: 2025 },
    { label: '2020-2023', min: 2020, max: 2023 },
    { label: '2015-2019', min: 2015, max: 2019 },
    { label: 'לפני 2015', min: 0, max: 2014 },
  ],
} as const;

export const ISR_REVALIDATE = {
  vehicles: 60,        // 1 minute
  vehicleDetail: 300,  // 5 minutes
  home: 3600,         // 1 hour
} as const;

export const PAGINATION = {
  vehiclesPerPage: 12,
  maxPages: 100,
} as const;
