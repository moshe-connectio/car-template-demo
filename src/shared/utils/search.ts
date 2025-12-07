/**
 * Smart search utilities with Hebrew normalization
 */

/**
 * Normalize Hebrew text for better search matching
 * Handles common typos and variations in Hebrew spelling
 */
export function normalizeHebrew(text: string): string {
  if (!text) return '';
  
  let normalized = text
    .toLowerCase()
    .trim();
  
  // Normalize final letters to regular letters
  normalized = normalized
    .replace(/ך/g, 'כ')
    .replace(/ם/g, 'מ')
    .replace(/ן/g, 'נ')
    .replace(/ף/g, 'פ')
    .replace(/ץ/g, 'צ');
  
  // Remove extra yuds (כיסא -> כסא)
  normalized = normalized.replace(/כי([אוהע])/g, 'כ$1');
  
  // Normalize vowel variations
  normalized = normalized
    .replace(/יי/g, 'י')
    .replace(/וו/g, 'ו');
  
  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, ' ');
  
  return normalized;
}

/**
 * Check if search query matches text with smart Hebrew normalization
 */
export function smartMatch(text: string, query: string): boolean {
  if (!text || !query) return false;
  
  const normalizedText = normalizeHebrew(text);
  const normalizedQuery = normalizeHebrew(query);
  
  return normalizedText.includes(normalizedQuery);
}

/**
 * Calculate similarity score between two Hebrew strings
 * Returns a number between 0 (no match) and 1 (perfect match)
 */
export function calculateSimilarity(text: string, query: string): number {
  if (!text || !query) return 0;
  
  const normalizedText = normalizeHebrew(text);
  const normalizedQuery = normalizeHebrew(query);
  
  // Exact match
  if (normalizedText === normalizedQuery) return 1;
  
  // Contains full query
  if (normalizedText.includes(normalizedQuery)) return 0.8;
  
  // Word-level matching
  const textWords = normalizedText.split(' ');
  const queryWords = normalizedQuery.split(' ');
  
  let matchingWords = 0;
  for (const queryWord of queryWords) {
    if (textWords.some(textWord => textWord.includes(queryWord))) {
      matchingWords++;
    }
  }
  
  const wordScore = matchingWords / queryWords.length;
  
  // Character-level fuzzy matching (simple Levenshtein-like)
  const charScore = calculateCharacterSimilarity(normalizedText, normalizedQuery);
  
  // Weighted combination
  return (wordScore * 0.7) + (charScore * 0.3);
}

/**
 * Simple character-level similarity
 */
function calculateCharacterSimilarity(text: string, query: string): number {
  let matches = 0;
  const shorter = query.length < text.length ? query : text;
  const longer = query.length >= text.length ? query : text;
  
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) {
      matches++;
    }
  }
  
  return matches / longer.length;
}

/**
 * Smart search function that returns items sorted by relevance
 */
export function smartSearch<T>(
  items: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] {
  if (!query.trim()) return items;
  
  // Calculate relevance scores
  const scored = items.map(item => {
    let maxScore = 0;
    
    for (const field of searchFields) {
      const value = item[field];
      if (typeof value === 'string') {
        const score = calculateSimilarity(value, query);
        maxScore = Math.max(maxScore, score);
      }
    }
    
    return { item, score: maxScore };
  });
  
  // Filter items with score above threshold and sort by relevance
  return scored
    .filter(({ score }) => score > 0.2) // Lower threshold for better recall
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
