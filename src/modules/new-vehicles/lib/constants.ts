/**
 * New Vehicles Module - Constants & Configuration
 * הגדרות ודברים קבועים למודול
 */

export const NEW_VEHICLES_ROUTES = {
  HOME: '/new-vehicles',
  MANUFACTURER: (slug: string) => `/new-vehicles/${slug}`,
  MODEL: (manufacturerSlug: string, modelSlug: string) =>
    `/new-vehicles/${manufacturerSlug}/${modelSlug}`,
} as const;

export const NEW_VEHICLES_CONFIG = {
  // כמה פריטים להציג בעמוד אחד
  ITEMS_PER_PAGE: 50,
  
  // כמה רמות גימור להראות ללא scroll
  TRIM_LEVELS_VISIBLE: 10,
  
  // שם המודול
  MODULE_NAME: 'new-vehicles',
  
  // תמונות ברירת מחדל
  PLACEHOLDER_IMAGE: 'https://via.placeholder.com/400x300?text=No+Image',
  
  // פרטי ברירת מחדל
  DEFAULT_DISPLAY_ORDER: 0,
} as const;

// Slugs חד-משמעיים ליצרנים נפוצים בישראל
export const COMMON_MANUFACTURERS = {
  BMW: 'bmw',
  MERCEDES: 'mercedes-benz',
  AUDI: 'audi',
  VOLKSWAGEN: 'volkswagen',
  SKODA: 'skoda',
  SEAT: 'seat',
  CUPRA: 'cupra',
  ABARTH: 'abarth',
  FIAT: 'fiat',
  JEEP: 'jeep',
  RAM: 'ram',
  DODGE: 'dodge',
  CHRYSLER: 'chrysler',
  FORD: 'ford',
  CHEVROLET: 'chevrolet',
  CADILLAC: 'cadillac',
  GMC: 'gmc',
  TESLA: 'tesla',
  POLESTAR: 'polestar',
  VOLVO: 'volvo',
  PORSCHE: 'porsche',
  LAMBORGHINI: 'lamborghini',
  FERRARI: 'ferrari',
  MASERATI: 'maserati',
  ROLLS_ROYCE: 'rolls-royce',
  BENTLEY: 'bentley',
  JAGUAR: 'jaguar',
  LAND_ROVER: 'land-rover',
  RANGE_ROVER: 'range-rover',
  SUBARU: 'subaru',
  MAZDA: 'mazda',
  NISSAN: 'nissan',
  MITSUBISHI: 'mitsubishi',
  TOYOTA: 'toyota',
  LEXUS: 'lexus',
  HONDA: 'honda',
  ACURA: 'acura',
  INFINITI: 'infiniti',
  HYUNDAI: 'hyundai',
  GENESIS: 'genesis',
  KIA: 'kia',
  RENAULT: 'renault',
  CITROEN: 'citroen',
  PEUGEOT: 'peugeot',
  DS: 'ds',
  OPEL: 'opel',
  VAUXHALL: 'vauxhall',
  DACIA: 'dacia',
  ALFA_ROMEO: 'alfa-romeo',
  LANCIA: 'lancia',
  CATAN: 'catan',
  MG: 'mg',
  BYD: 'byd',
  NIO: 'nio',
  XPeng: 'xpeng',
} as const;

// סוגי גוף נפוצים
export const BODY_TYPES = {
  SEDAN: 'Sedan',
  COUPE: 'Coupe',
  HATCHBACK: 'Hatchback',
  STATION_WAGON: 'Station Wagon',
  SUV: 'SUV',
  CROSSOVER: 'Crossover',
  MINIVAN: 'Minivan',
  MPV: 'MPV',
  PICKUP: 'Pickup',
  CONVERTIBLE: 'Convertible',
  ROADSTER: 'Roadster',
  VAN: 'Van',
} as const;

// סוגי דלק/מנועים
export const FUEL_TYPES = {
  PETROL: 'Petrol',
  DIESEL: 'Diesel',
  HYBRID: 'Hybrid',
  PLUG_IN_HYBRID: 'Plug-in Hybrid',
  ELECTRIC: 'Electric',
  LPG: 'LPG',
  CNG: 'CNG',
} as const;

// סוגי תיבות הילוכים
export const TRANSMISSION_TYPES = {
  MANUAL: 'Manual',
  AUTOMATIC: 'Automatic',
  CVT: 'CVT',
  SEMI_AUTOMATIC: 'Semi-Automatic',
  DUAL_CLUTCH: 'Dual-Clutch',
} as const;

// קטגוריות פרטים נוספים
export const SPECIFICATION_CATEGORIES = {
  SAFETY: 'Safety',
  COMFORT: 'Comfort',
  TECHNOLOGY: 'Technology',
  EXTERIOR: 'Exterior',
  INTERIOR: 'Interior',
  INFOTAINMENT: 'Infotainment',
  EMISSIONS: 'Emissions',
  CHASSIS: 'Chassis',
  SUSPENSION: 'Suspension',
  BRAKING: 'Braking',
  WHEELS: 'Wheels',
  PERFORMANCE: 'Performance',
} as const;
