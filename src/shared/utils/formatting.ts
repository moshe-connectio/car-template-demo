/**
 * Format Utilities
 * Common formatting functions used throughout the application
 */

import { APP_CONFIG } from '@core/lib/constants';

/**
 * Format price with currency symbol
 * @example formatPrice(125000) // returns "₪125,000"
 */
export function formatPrice(price: number): string {
  return `${APP_CONFIG.currencySymbol}${price.toLocaleString(APP_CONFIG.locale)}`;
}

/**
 * Format kilometers with unit
 * @example formatKilometers(5000) // returns "5,000 ק״מ"
 */
export function formatKilometers(km: number): string {
  return `${km.toLocaleString(APP_CONFIG.locale)} ק״מ`;
}

/**
 * Format date to Hebrew locale
 * @example formatDate(new Date()) // returns formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(APP_CONFIG.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format relative time (e.g., "לפני 2 ימים")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'היום';
  if (diffInDays === 1) return 'אתמול';
  if (diffInDays < 7) return `לפני ${diffInDays} ימים`;
  if (diffInDays < 30) return `לפני ${Math.floor(diffInDays / 7)} שבועות`;
  if (diffInDays < 365) return `לפני ${Math.floor(diffInDays / 30)} חודשים`;
  return `לפני ${Math.floor(diffInDays / 365)} שנים`;
}

/**
 * Generate vehicle slug from title (supports Hebrew and English)
 * @example generateSlug('Toyota Camry 2024') // returns 'toyota-camry-2024'
 * @example generateSlug('טויוטה קאמרי 2024') // returns 'טויוטה-קאמרי-2024'
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    // Keep Hebrew letters (א-ת), English letters (a-z), numbers (0-9), spaces, and hyphens
    .replace(/[^\u0590-\u05FF\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Generate vehicle URL slug with ID (supports Hebrew)
 * @example generateVehicleSlug('Toyota Camry', 2024, '123e4567-e89b-12d3-a456-426614174000') 
 * // returns 'toyota-camry-2024-426614174000'
 * @example generateVehicleSlug('טויוטה קאמרי', 2024, '123e4567-e89b-12d3-a456-426614174000')
 * // returns 'טויוטה-קאמרי-2024-426614174000'
 */
export function generateVehicleSlug(title: string, year: number, id: string): string {
  const baseSlug = generateSlug(`${title} ${year}`);
  // Get last 12 characters of ID (or full ID if shorter)
  const idSuffix = id.slice(-12);
  return `${baseSlug}-${idSuffix}`;
}

/**
 * Extract ID from vehicle slug
 * @example extractIdFromSlug('toyota-camry-2024-426614174000') // returns '426614174000'
 * @example extractIdFromSlug('8b234567-89ab-12cd-ef01-23456789abcd') // returns full UUID if already valid
 */
export function extractIdFromSlug(slug: string): string {
  // If slug looks like a UUID (contains at least one hyphen with proper format), return as-is
  // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(slug)) {
    return slug;
  }
  
  // Otherwise, extract the last part which should be the ID suffix
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  // If last part looks like a full UUID, return it
  if (uuidRegex.test(lastPart)) {
    return lastPart;
  }
  
  // Return last 12 characters as ID suffix
  return lastPart;
}

/**
 * Truncate text with ellipsis
 * @example truncate('Long text here', 10) // returns 'Long text...'
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Check if value is defined and not null
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
