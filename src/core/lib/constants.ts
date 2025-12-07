/**
 * Application Constants
 * Imported from the main dealership config
 */

import { dealershipConfig } from '@core/config/site.config';

export const APP_CONFIG = {
  name: dealershipConfig.business.name,
  description: dealershipConfig.business.description,
  locale: dealershipConfig.locale.language,
  currency: dealershipConfig.locale.currency,
  currencySymbol: dealershipConfig.locale.currencySymbol,
} as const;

export const ROUTES = {
  home: '/',
  vehicles: '/vehicles',
  vehicleDetail: (slug: string) => `/vehicles/${slug}`,
  products: '/products',
  productDetail: (slug: string) => `/products/${slug}`,
  cart: '/cart',
  api: {
    webhooks: {
      vehicles: '/api/webhooks/vehicles',
    },
  },
} as const;

export const CONTACT_INFO = {
  phone: dealershipConfig.contact.phone,
  email: dealershipConfig.contact.email,
  address: dealershipConfig.contact.address,
} as const;

export const SOCIAL_LINKS = {
  facebook: dealershipConfig.social.facebook,
  instagram: dealershipConfig.social.instagram,
  whatsapp: dealershipConfig.social.whatsapp,
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
  vehicles: dealershipConfig.cache.vehiclesPageRevalidate,
  vehicleDetail: dealershipConfig.cache.vehicleDetailRevalidate,
  home: dealershipConfig.cache.homePageRevalidate,
} as const;

export const PAGINATION = {
  vehiclesPerPage: dealershipConfig.pagination.vehiclesPerPage,
  maxPages: 100,
} as const;
