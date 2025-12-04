# Add Category Column to Vehicles Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Add categories column to vehicles table (as TEXT array)
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- Add index for better filtering performance
CREATE INDEX IF NOT EXISTS idx_vehicles_categories ON vehicles USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand);

-- Update existing vehicles with empty array (optional)
-- UPDATE vehicles SET categories = '{}' WHERE categories IS NULL;
```

## Supported Categories (Hebrew):
- SUV
- סדאן
- האצ'בק
- מיני ואן
- קופה
- קרוסאובר
- טנדר
- ספורט
- חשמלי
- היברידי
- 4x4
- יוקרה
- משפחתית
- מנהלים
- 8 מושבים

## Usage Example:
When creating/updating vehicles via webhook, include the categories field (as an array):
```json
{
  "crmid": "ZOHO-123",
  "data": {
    "title": "Toyota RAV4",
    "brand": "Toyota",
    "model": "RAV4",
    "year": 2024,
    "price": 150000,
    "categories": ["SUV", "4x4"]
  }
}
```
