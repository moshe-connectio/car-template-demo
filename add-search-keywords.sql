-- Add search_keywords column to products table
-- This field contains search variations and synonyms for better SEO and search

-- Add the column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS search_keywords TEXT;

-- Add some example search keywords for common products
-- Format: "variation1, variation2, synonym1, synonym2"

-- Example: Update products with "כסא" to include "כיסא" variation
UPDATE products 
SET search_keywords = 'כסא, כיסא, כסאות, כיסאות, chair'
WHERE name ILIKE '%כסא%' OR name ILIKE '%כיסא%';

-- Example: Update products with "שולחן" variations
UPDATE products 
SET search_keywords = 'שולחן, שלחן, שולחנות, table, desk'
WHERE name ILIKE '%שולחן%' OR name ILIKE '%שלחן%';

-- Example: Update products with "נורה" variations
UPDATE products 
SET search_keywords = 'נורה, נורות, נורת, bulb, light'
WHERE name ILIKE '%נורה%' OR name ILIKE '%נורות%';

-- Example: Update products with "מנורה" variations
UPDATE products 
SET search_keywords = 'מנורה, מנורות, מנורת, lamp, lighting'
WHERE name ILIKE '%מנורה%' OR name ILIKE '%מנורות%';

-- Add comment to column
COMMENT ON COLUMN products.search_keywords IS 'Search keywords and variations for better search results and SEO. Include common misspellings, synonyms, and English translations.';

-- Create index for faster text search
CREATE INDEX IF NOT EXISTS idx_products_search_keywords 
ON products USING gin(to_tsvector('hebrew', COALESCE(search_keywords, '')));

-- Full-text search index combining multiple fields (optional - for future optimization)
CREATE INDEX IF NOT EXISTS idx_products_full_text_search 
ON products USING gin(
  to_tsvector('hebrew', 
    COALESCE(name, '') || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(short_description, '') || ' ' || 
    COALESCE(search_keywords, '')
  )
);
