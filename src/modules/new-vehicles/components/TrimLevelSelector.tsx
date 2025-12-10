/**
 * TrimLevelSelector Component
 * בחירת רמת גימור עם tabs
 */

'use client';

import { useState } from 'react';
import type { TrimLevel } from '../types';

interface TrimLevelSelectorProps {
  trimLevels: TrimLevel[];
  onSelect: (trimLevel: TrimLevel) => void;
  selectedId?: string;
}

export function TrimLevelSelector({
  trimLevels,
  onSelect,
  selectedId,
}: TrimLevelSelectorProps) {
  const [selected, setSelected] = useState<TrimLevel>(
    selectedId
      ? trimLevels.find((t) => t.id === selectedId) || trimLevels[0]
      : trimLevels[0]
  );

  const handleSelect = (trimLevel: TrimLevel) => {
    setSelected(trimLevel);
    onSelect(trimLevel);
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-2">
          {trimLevels.map((trim) => (
            <button
              key={trim.id}
              onClick={() => handleSelect(trim)}
              className={`whitespace-nowrap rounded-lg border-2 px-4 py-2 font-medium transition-all ${
                selected.id === trim.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 bg-white text-gray-900 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <div className="text-base">{trim.name}</div>
              <div
                className={`mt-0.5 text-xs ${
                  selected.id === trim.id ? 'text-white/80' : 'text-gray-600'
                }`}
              >
                ₪{trim.price.toLocaleString('he-IL')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Trim Summary */}
      {selected && (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-linear-to-br from-gray-50 to-gray-100 p-4">
          <div className="flex items-baseline justify-between">
            <h4 className="text-sm font-medium text-gray-600">
              רמת גימור נבחרת:
            </h4>
            <p className="text-2xl font-bold text-primary">
              ₪{selected.price.toLocaleString('he-IL')}
            </p>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-3 pt-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {selected.engine_type && (
              <div>
                <p className="text-xs text-gray-600">מנוע</p>
                <p className="font-semibold text-gray-900">
                  {selected.engine_type}
                </p>
              </div>
            )}

            {selected.transmission && (
              <div>
                <p className="text-xs text-gray-600">תיבת הילוכים</p>
                <p className="font-semibold text-gray-900">
                  {selected.transmission}
                </p>
              </div>
            )}

            {selected.power_hp && (
              <div>
                <p className="text-xs text-gray-600">כוח</p>
                <p className="font-semibold text-gray-900">
                  {selected.power_hp} hp
                </p>
              </div>
            )}

            {selected.acceleration_0_100 && (
              <div>
                <p className="text-xs text-gray-600">0-100 ק״מ</p>
                <p className="font-semibold text-gray-900">
                  {selected.acceleration_0_100}s
                </p>
              </div>
            )}

            {selected.fuel_consumption && (
              <div>
                <p className="text-xs text-gray-600">צריכה</p>
                <p className="font-semibold text-gray-900">
                  {selected.fuel_consumption} L/100km
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TrimLevelSelector;
