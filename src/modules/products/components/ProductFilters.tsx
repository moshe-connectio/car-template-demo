'use client';

import { useState, useCallback } from 'react';
import { FaSearch, FaTimes, FaChevronDown, FaHome, FaCarSide, FaTree, FaCouch, FaLightbulb, FaTags } from 'react-icons/fa';
import type { IconType } from 'react-icons';

export interface FilterOptions {
  searchQuery: string;
  mainCategorySlug: string;
  categorySlug: string; // single-select dropdown
  selectedTags: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'popular';
}

interface ProductFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>;
  availableTags?: string[];
  onFiltersChange: (filters: FilterOptions) => void;
  maxPrice?: number;
}

export function ProductFilters({ categories, availableTags = [], onFiltersChange, maxPrice = 10000 }: ProductFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mainCategorySlug, setMainCategorySlug] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPriceValue, setMaxPriceValue] = useState(maxPrice);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categoryIcons: Record<string, IconType> = {
    home: FaHome,
    car: FaCarSide,
    garden: FaTree,
    furniture: FaCouch,
    lighting: FaLightbulb,
  };

  // Predefined price ranges for quick selection
  const priceRanges = [
    { label: 'כל הטווחים', min: 0, max: maxPrice },
    { label: '₪0 - ₪50', min: 0, max: 50 },
    { label: '₪50 - ₪150', min: 50, max: 150 },
    { label: '₪150 - ₪300', min: 150, max: 300 },
    { label: '₪300+', min: 300, max: maxPrice },
  ];

  const buildFilters = useCallback(
    (overrides: Partial<FilterOptions> = {}) => ({
      searchQuery,
      mainCategorySlug,
      categorySlug,
      selectedTags,
      minPrice,
      maxPrice: maxPriceValue,
      sortBy,
      ...overrides,
    }),
    [searchQuery, mainCategorySlug, categorySlug, selectedTags, minPrice, maxPriceValue, sortBy]
  );

  const handleFilterChange = useCallback(
    (overrides: Partial<FilterOptions> = {}) => {
      onFiltersChange(buildFilters(overrides));
    },
    [onFiltersChange, buildFilters]
  );

  const updateSearch = (value: string) => {
    setSearchQuery(value);
  };

  const updateMainCategory = (value: string) => {
    setMainCategorySlug(value);
    setCategorySlug(value);
    setSelectedTags([]); // reset tag selection when switching category
  };

  const updateCategorySelect = (value: string) => {
    setCategorySlug(value);
    setMainCategorySlug(value);
    setSelectedTags([]);
  };

  const updateMinPrice = (value: number) => {
    setMinPrice(value);
  };

  const updateMaxPrice = (value: number) => {
    setMaxPriceValue(value);
  };

  const updateSort = (value: 'newest' | 'price-low' | 'price-high' | 'popular') => {
    setSortBy(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMainCategorySlug('');
    setCategorySlug('');
    setSelectedTags([]);
    setMinPrice(0);
    setMaxPriceValue(maxPrice);
    setSortBy('newest');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      // Trigger filter change with the new tag selection
      handleFilterChange({ selectedTags: newTags });
      return newTags;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="חיפוש מוצרים..."
            value={searchQuery}
            onChange={(e) => {
              updateSearch(e.target.value);
              handleFilterChange({ searchQuery: e.target.value });
            }}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                handleFilterChange({ searchQuery: '' });
              }}
              className="absolute right-2 top-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Categories (icons) under search */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setMainCategorySlug('');
            setCategorySlug('');
            setSelectedTags([]);
            handleFilterChange({ mainCategorySlug: '', categorySlug: '', selectedTags: [] });
          }}
          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
            mainCategorySlug === ''
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          הכל
        </button>
        {categories
          .filter(cat => ['home', 'car', 'garden', 'women'].includes(cat.slug))
          .map((cat) => {
            const Icon = categoryIcons[cat.slug] || FaTags;
            const active = mainCategorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  updateMainCategory(cat.slug);
                  handleFilterChange({ mainCategorySlug: cat.slug, categorySlug: cat.slug, selectedTags: [] });
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  active ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
      </div>

      {/* Main Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category dropdown */}
        <div className="flex flex-col justify-end">
          <select
            value={categorySlug}
            onChange={(e) => {
              updateCategorySelect(e.target.value);
              handleFilterChange({ categorySlug: e.target.value, mainCategorySlug: e.target.value, selectedTags: [] });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
          >
            <option value="">כל הקטגוריות</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => {
              updateSort(e.target.value as any);
              handleFilterChange({ sortBy: e.target.value as any });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
          >
            <option value="newest">חדש ביותר</option>
            <option value="price-high">מחיר: נמוך לגבוה</option>
            <option value="price-low">מחיר: גבוה לנמוך</option>
            <option value="popular">פופולרי</option>
          </select>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium text-gray-700"
        >
          <span>אפשרויות חיפוש</span>
          <FaChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t">
          {/* Tags */}
          {availableTags && availableTags.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                תגיות
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Price Ranges */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              טווח מחירים
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {priceRanges.map((range) => (
                <button
                  key={`${range.min}-${range.max}`}
                  onClick={() => {
                    const nextMin = range.min;
                    const nextMax = range.max;
                    setMinPrice(nextMin);
                    setMaxPriceValue(nextMax);
                    handleFilterChange({ minPrice: nextMin, maxPrice: nextMax });
                  }}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    minPrice === range.min && maxPriceValue === range.max
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range Inputs */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              טווח מחירים מותאם
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">מינימום</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      updateMinPrice(value);
                      handleFilterChange({ minPrice: value });
                    }}
                    min="0"
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-600">₪</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">מקסימום</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={maxPriceValue}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      updateMaxPrice(value);
                      handleFilterChange({ maxPrice: value });
                    }}
                    min={minPrice}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder={String(maxPrice)}
                  />
                  <span className="text-xs text-gray-600">₪</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || mainCategorySlug || categorySlug || selectedTags.length > 0 || minPrice > 0 || maxPriceValue < maxPrice || sortBy !== 'newest') && (
            <button
              onClick={() => {
                clearFilters();
                handleFilterChange({
                  searchQuery: '',
                  mainCategorySlug: '',
                  categorySlug: '',
                  selectedTags: [],
                  minPrice: 0,
                  maxPrice,
                  sortBy: 'newest',
                });
              }}
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              נקה סינונים
            </button>
          )}
        </div>
      )}
    </div>
  );
}
