# Vehicle Condition Field Migration

## Overview

Added a new `condition` field to the `vehicles` table to distinguish between:
- **חדש** (New) - Brand new vehicles
- **0 ק״מ** (Zero KM) - New but registered
- **משומש** (Used) - Previously used vehicles

## SQL Migration

Run this SQL in your Supabase dashboard:

```sql
-- Add the condition column with default value
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT 'משומש';

-- Add constraint to ensure valid values
ALTER TABLE vehicles ADD CONSTRAINT check_vehicle_condition 
  CHECK (condition IN ('חדש', '0 ק״מ', 'משומש'));

-- Create an index for filtering
CREATE INDEX IF NOT EXISTS idx_vehicles_condition ON vehicles(condition);
```

## Type Definition

```typescript
export type VehicleCondition = 'חדש' | '0 ק״מ' | 'משומש';

export type Vehicle = {
  // ... other fields ...
  condition: VehicleCondition;
  // ... other fields ...
};
```

## Usage

### In Webhook Payload

```json
{
  "crmid": "ZOHO-DEAL-12345",
  "data": {
    "slug": "toyota-camry-2024",
    "title": "Toyota Camry 2024",
    "brand": "Toyota",
    "model": "Camry",
    "year": 2024,
    "price": 125000,
    "condition": "0 ק״מ",
    "km": 0,
    "is_published": true
  }
}
```

### In TypeScript Code

```typescript
import { createVehicle, type VehicleCondition } from '@/lib/vehiclesRepository';

const newVehicle = await createVehicle({
  slug: 'toyota-camry-2024',
  title: 'Toyota Camry 2024',
  brand: 'Toyota',
  model: 'Camry',
  year: 2024,
  price: 125000,
  condition: '0 ק״מ',
  km: 0,
  // ... other fields ...
});
```

## Default Value

- If not specified in webhook, defaults to `'משומש'` (Used)
- For new vehicles with 0 km, explicitly set to `'0 ק״מ'`
- For brand new vehicles, set to `'חדש'`

## Display

You can display the condition in the UI:

```tsx
const conditions: Record<VehicleCondition, { label: string; color: string }> = {
  'חדש': { label: 'חדש', color: 'bg-green-500' },
  '0 ק״מ': { label: '0 ק״מ', color: 'bg-blue-500' },
  'משומש': { label: 'משומש', color: 'bg-gray-500' },
};

export function ConditionBadge({ condition }: { condition: VehicleCondition }) {
  const { label, color } = conditions[condition];
  return <span className={`px-3 py-1 rounded-full text-white ${color}`}>{label}</span>;
}
```

## Filtering

Filter vehicles by condition:

```typescript
// Get all new vehicles
const { data: newVehicles } = await client
  .from('vehicles')
  .select('*')
  .eq('condition', 'חדש');

// Get all zero-km vehicles
const { data: zeroKmVehicles } = await client
  .from('vehicles')
  .select('*')
  .eq('condition', '0 ק״מ');

// Get all used vehicles
const { data: usedVehicles } = await client
  .from('vehicles')
  .select('*')
  .eq('condition', 'משומש');
```

## Backward Compatibility

All existing vehicles default to `'משומש'` (Used). You can update them later with the correct condition values.
