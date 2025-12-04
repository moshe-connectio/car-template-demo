/**
 * Theme Utility Functions
 * Helper functions to easily access theme values in components
 */

import { colors, spacing, typography, borderRadius, shadows } from './theme';

/**
 * Get color value from theme
 * @example getColor('primary', 600) // returns '#2563eb'
 * @example getColor('text', 'primary') // returns '#111827'
 */
export function getColor(category: keyof typeof colors, shade?: string | number): string {
  const colorCategory = colors[category];
  if (!colorCategory) return '';
  
  if (shade && typeof colorCategory === 'object' && shade in colorCategory) {
    return colorCategory[shade as keyof typeof colorCategory] as string;
  }
  
  if (typeof colorCategory === 'string') {
    return colorCategory;
  }
  
  return '';
}

/**
 * Get spacing value from theme
 * @example getSpacing(4) // returns '1rem'
 */
export function getSpacing(size: keyof typeof spacing): string {
  return spacing[size] || '0';
}

/**
 * Get font size from theme
 * @example getFontSize('xl') // returns '1.25rem'
 */
export function getFontSize(size: keyof typeof typography.fontSize): string {
  return typography.fontSize[size] || typography.fontSize.base;
}

/**
 * Get border radius from theme
 * @example getBorderRadius('lg') // returns '0.5rem'
 */
export function getBorderRadius(size: keyof typeof borderRadius): string {
  return borderRadius[size] || borderRadius.base;
}

/**
 * Get box shadow from theme
 * @example getShadow('md') // returns shadow value
 */
export function getShadow(size: keyof typeof shadows): string {
  return shadows[size] || shadows.base;
}

/**
 * Class names utility - combines multiple class names
 * @example cn('text-lg', isActive && 'font-bold', className)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
