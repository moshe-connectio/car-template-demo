'use client';

import { useState, useMemo } from 'react';
import { Vehicle } from '@/lib/vehiclesRepository';
import { VehicleFilters, FilterState } from './VehicleFilters';
import { VehicleGrid } from './VehicleGrid';

interface FilterableVehicleGridProps {
  vehicles: Vehicle[];
  brands: string[];
  categories: string[];
}

export function FilterableVehicleGrid({ vehicles, brands, categories }: FilterableVehicleGridProps) {
  const [filters, setFilters] = useState<FilterState>({
    brand: '',
    categories: [],
    searchQuery: '',
  });

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      // Brand filter
      if (filters.brand && vehicle.brand !== filters.brand) {
        return false;
      }

      // Categories filter - if any categories are selected, vehicle must have at least one matching category
      if (filters.categories.length > 0) {
        const hasMatchingCategory = filters.categories.some(selectedCategory =>
          vehicle.categories.includes(selectedCategory)
        );
        if (!hasMatchingCategory) {
          return false;
        }
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = [
          vehicle.title,
          vehicle.brand,
          vehicle.model,
          ...vehicle.categories,
          vehicle.year.toString(),
        ].join(' ').toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [vehicles, filters]);

  return (
    <>
      <VehicleFilters
        brands={brands}
        categories={categories}
        onFilterChange={setFilters}
      />
      
      <div className="mb-4 text-gray-600">
        מציג {filteredVehicles.length} מתוך {vehicles.length} רכבים
      </div>

      <VehicleGrid vehicles={filteredVehicles} />
    </>
  );
}
