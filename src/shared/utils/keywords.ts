/**
 * Generate search keywords automatically for Hebrew products
 * Helps with common spelling variations and SEO
 */

interface KeywordVariations {
  [key: string]: string[];
}

// Common Hebrew word variations and synonyms
const HEBREW_VARIATIONS: KeywordVariations = {
  'כיסא': ['כסא', 'כיסא', 'כסאות', 'כיסאות', 'chair', 'seat'],
  'כסא': ['כסא', 'כיסא', 'כסאות', 'כיסאות', 'chair', 'seat'],
  'שולחן': ['שולחן', 'שלחן', 'שולחנות', 'table', 'desk'],
  'שלחן': ['שולחן', 'שלחן', 'שולחנות', 'table', 'desk'],
  'נורה': ['נורה', 'נורות', 'נורת', 'bulb', 'light'],
  'מנורה': ['מנורה', 'מנורות', 'מנורת', 'lamp', 'lighting'],
  'ספה': ['ספה', 'ספות', 'couch', 'sofa'],
  'ארון': ['ארון', 'ארונות', 'closet', 'cabinet', 'wardrobe'],
  'מיטה': ['מיטה', 'מיטות', 'bed'],
  'שטיח': ['שטיח', 'שטיחים', 'rug', 'carpet'],
  'וילון': ['וילון', 'וילונות', 'curtain', 'drape'],
  'כרית': ['כרית', 'כריות', 'pillow', 'cushion'],
  'מזרון': ['מזרון', 'מזרונים', 'mattress'],
  'כורסא': ['כורסא', 'כורסה', 'כורסאות', 'armchair'],
  'מדף': ['מדף', 'מדפים', 'shelf', 'shelves'],
  'מראה': ['מראה', 'מראות', 'mirror'],
  'שידה': ['שידה', 'שידות', 'dresser', 'chest'],
  'ויטרינה': ['ויטרינה', 'ויטרינות', 'vitrine', 'display cabinet'],
  'מזנון': ['מזנון', 'מזנונים', 'sideboard', 'buffet'],
  'ספריה': ['ספריה', 'ספריות', 'bookcase', 'bookshelf'],
  'מחשב': ['מחשב', 'מחשבים', 'computer', 'pc'],
  'מקלדת': ['מקלדת', 'מקלדות', 'keyboard'],
  'עכבר': ['עכבר', 'עכברים', 'mouse'],
  'מסך': ['מסך', 'מסכים', 'screen', 'monitor'],
  'רמקול': ['רמקול', 'רמקולים', 'speaker'],
  'אוזניות': ['אוזניות', 'אוזניה', 'headphones', 'earphones'],
};

/**
 * Generate search keywords from product name
 * @param productName - The name of the product
 * @param additionalKeywords - Optional additional keywords to include
 * @returns Comma-separated string of keywords
 */
export function generateSearchKeywords(
  productName: string,
  additionalKeywords: string[] = []
): string {
  const keywords = new Set<string>();
  
  // Add original name
  keywords.add(productName.toLowerCase());
  
  // Extract words from product name
  const words = productName.toLowerCase().split(/\s+/);
  
  // For each word, check if we have variations
  for (const word of words) {
    keywords.add(word);
    
    // Check for matches in our variations dictionary
    for (const [key, variations] of Object.entries(HEBREW_VARIATIONS)) {
      if (word.includes(key) || key.includes(word)) {
        variations.forEach(v => keywords.add(v));
      }
    }
  }
  
  // Add additional keywords
  additionalKeywords.forEach(k => keywords.add(k.toLowerCase()));
  
  // Convert to array, remove empty strings, and join
  return Array.from(keywords)
    .filter(k => k.trim().length > 0)
    .join(', ');
}

/**
 * Add category-based keywords
 * @param categoryName - Category name
 * @returns Array of category-related keywords
 */
export function getCategoryKeywords(categoryName: string): string[] {
  const categoryMap: KeywordVariations = {
    'רהיטים': ['furniture', 'רהיט'],
    'תאורה': ['lighting', 'lights', 'תאורות', 'אור'],
    'חשמל': ['electronics', 'electrical', 'חשמלי'],
    'גינה': ['garden', 'outdoor', 'חוץ'],
    'מטבח': ['kitchen', 'מטבחי'],
    'אמבטיה': ['bathroom', 'bath'],
    'חדר שינה': ['bedroom', 'חדש'],
    'סלון': ['living room', 'living'],
    'משרד': ['office', 'משרדי'],
    'ילדים': ['kids', 'children', 'ילד'],
  };
  
  const categoryLower = categoryName.toLowerCase();
  
  for (const [key, keywords] of Object.entries(categoryMap)) {
    if (categoryLower.includes(key)) {
      return keywords;
    }
  }
  
  return [];
}

/**
 * Complete keyword generation including category
 * @param productName - Product name
 * @param categoryName - Category name (optional)
 * @param tags - Product tags (optional)
 * @returns Complete keyword string
 */
export function generateCompleteKeywords(
  productName: string,
  categoryName?: string,
  tags?: string[]
): string {
  const additional: string[] = [];
  
  // Add category keywords
  if (categoryName) {
    additional.push(...getCategoryKeywords(categoryName));
  }
  
  // Add tags
  if (tags) {
    additional.push(...tags);
  }
  
  return generateSearchKeywords(productName, additional);
}

// Example usage:
// generateCompleteKeywords('כיסא גיימינג', 'רהיטים', ['gaming', 'ארגונומי'])
// Returns: "כיסא גיימינג, כיסא, כסא, כיסא, כיסאות, כיסאות, chair, seat, גיימינג, furniture, רהיט, gaming, ארגונומי"
