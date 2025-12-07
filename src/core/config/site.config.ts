/**
 * Dealership Configuration
 * Central configuration file for customizing the car dealership template
 * Update these values to customize the template for your dealership
 */

export const dealershipConfig = {
  // Business Information
  business: {
    name: 'Car Dealership',
    description: 'מציעים את מגוון הרכבים הטוב ביותר',
    tagline: 'רכבים איכותיים, מחירים תחרותיים, שירות מעולה',
    logo: '/logo.svg',
    favicon: '/favicon.ico',
  },

  // Contact Information
  contact: {
    phone: '+972-50-123-4567',
    whatsapp: '+972-50-123-4567',
    email: 'info@cardealership.com',
    address: 'תל אביב, ישראל',
    businessHours: {
      weekdays: '09:00 - 18:00',
      friday: '09:00 - 14:00',
      saturday: 'סגור',
      sunday: '09:00 - 18:00',
    },
  },

  // Payment Configuration
  payment: {
    enabled: true, // Set to false to disable payment system
    provider: 'stripe' as const, // 'stripe' | 'tranzila' | 'payplus'
    currency: 'ILS',
    currencySymbol: '₪',
    
    // Available payment methods (customize per client)
    // Remove methods you don't want to offer
    availableMethods: [
      'card',       // Credit/Debit cards
      'paypal',     // PayPal (requires Stripe PayPal setup)
      'apple_pay',  // Apple Pay (auto-enabled on iOS)
      'google_pay', // Google Pay (auto-enabled on Android)
      // 'bit',     // Bit (Israeli) - Coming soon
    ] as const,
    
    // Stripe specific (if using Stripe)
    stripe: {
      // Keys are loaded from environment variables
      // NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      // STRIPE_SECRET_KEY
      
      // Enable PayPal through Stripe
      enablePayPal: true,
      
      // Enable wallet payments
      enableWallets: true, // Apple Pay & Google Pay
    },
    
    // Features
    features: {
      guestCheckout: true,  // Allow checkout without account
      savedCards: false,    // Save cards for future purchases (requires user accounts)
      showSecurityBadges: true, // Show SSL/PCI badges
      requireBillingAddress: false, // Require billing address
    },
  },

  // Social Media Links
  social: {
    facebook: 'https://facebook.com/cardealership',
    instagram: 'https://instagram.com/cardealership',
    whatsapp: 'https://wa.me/972501234567',
    linkedin: 'https://linkedin.com/company/cardealership',
    youtube: 'https://youtube.com/@cardealership',
  },

  // Localization
  locale: {
    language: 'he-IL',
    currency: 'ILS',
    currencySymbol: '₪',
    direction: 'rtl', // 'rtl' for Hebrew, 'ltr' for English
  },

  // SEO & Meta
  seo: {
    title: 'Car Dealership - רכבים למכירה',
    description: 'סוכנות רכב מובילה המציעה מגוון רכבים איכותיים במחירים תחרותיים',
    keywords: 'רכבים, מכירת רכבים, סוכנות רכב, רכבים משומשים, רכבים חדשים',
    author: 'Car Dealership',
  },

  // Features & Sections
  features: {
    enableBlog: false,
    enableComparision: true,
    enableTestDrive: true,
    enableFinancing: true,
    enableTrade: true,
    enableSearch: true,
    enableFilters: true,
  },

  // Pagination & Limits
  pagination: {
    vehiclesPerPage: 12,
    featuredVehiclesCount: 6,
    maxSearchResults: 100,
  },

  // Cache & Performance
  cache: {
    homePageRevalidate: 3600, // 1 hour
    vehiclesPageRevalidate: 60, // 1 minute
    vehicleDetailRevalidate: 300, // 5 minutes
  },

  // Theme Colors (for documentation purposes)
  // All colors are defined in src/app/globals.css
  theme: {
    primary: '#2563eb', // Blue gradient
    secondary: '#7c3aed', // Purple gradient
    success: '#10b981', // Green
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
  },

  // Company Info for Footer
  company: {
    foundedYear: 2020,
    employees: 50,
    satisfaction: '95%',
    yearsExperience: 4,
  },

  // Analytics
  analytics: {
    googleAnalyticsId: '', // Add your Google Analytics ID
    gtmId: '', // Add your Google Tag Manager ID
    enableAnalytics: false,
  },

  // Email Configuration
  email: {
    from: 'info@cardealership.com',
    replyTo: 'support@cardealership.com',
    bcc: 'admin@cardealership.com',
  },

  // Vehicle Database
  database: {
    maxImagesPerVehicle: 10,
    minImagesPerVehicle: 1,
    defaultVehiclesPerFetch: 100,
  },

  // API Configuration
  api: {
    webhookSecret: process.env.WEBHOOK_SECRET || '',
    apiTimeout: 30000, // 30 seconds
    retryAttempts: 3,
  },

  // Feature Flags
  featureFlags: {
    betaFeatures: false,
    maintenanceMode: false,
    enableNewUI: true,
    enableDarkMode: false,
  },
} as const;

// Type exports for TypeScript support
export type DealershipConfig = typeof dealershipConfig;
