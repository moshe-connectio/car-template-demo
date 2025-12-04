'use client';

import { useState, useEffect } from 'react';

interface VehicleFiltersProps {
  brands: string[];
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  brand: string;
  categories: string[];
  searchQuery: string;
}

export function VehicleFilters({ brands, categories, onFilterChange }: VehicleFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    brand: '',
    categories: [],
    searchQuery: '',
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleBrandChange = (brand: string) => {
    setFilters(prev => ({ ...prev, brand }));
  };

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSearchChange = (searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  const handleReset = () => {
    setFilters({ brand: '', categories: [], searchQuery: '' });
  };

  const hasActiveFilters = filters.brand || filters.categories.length > 0 || filters.searchQuery;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">סינון רכבים</h2>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-primary hover:text-blue-700 font-medium"
          >
            נקה סינונים
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            חיפוש חופשי
          </label>
          <input
            type="text"
            id="search"
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="חפש רכב..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Brand Filter */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
            יצרן
          </label>
          <select
            id="brand"
            value={filters.brand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">כל היצרנים</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            קטגוריה
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-white">
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">אין קטגוריות זמינות</p>
            ) : (
              categories.map(category => (
                <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.brand && (
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              יצרן: {filters.brand}
              <button
                onClick={() => handleBrandChange('')}
                className="hover:text-blue-700"
              >
                ✕
              </button>
            </span>
          )}
          {filters.categories.map(category => (
            <span key={category} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              קטגוריה: {category}
              <button
                onClick={() => handleCategoryToggle(category)}
                className="hover:text-blue-700"
              >
                ✕
              </button>
            </span>
          ))}
          {filters.searchQuery && (
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              חיפוש: {filters.searchQuery}
              <button
                onClick={() => handleSearchChange('')}
                className="hover:text-blue-700"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
