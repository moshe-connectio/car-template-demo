/**
 * ManufacturerGrid Component
 * רשת יצרנים עם לוגו ושם
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ManufacturerWithCounts } from '../types';

interface ManufacturerGridProps {
  manufacturers: ManufacturerWithCounts[];
  isLoading?: boolean;
}

export function ManufacturerGrid({ manufacturers, isLoading }: ManufacturerGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (manufacturers.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
        <p className="text-center text-gray-500">אין יצרנים זמינים כעת</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {manufacturers.map((manufacturer) => (
        <Link
          key={manufacturer.id}
          href={`/new-vehicles/${manufacturer.slug}`}
          className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:border-primary hover:shadow-md"
        >
          <div className="aspect-square flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
            {/* לוגו יצרן */}
            {manufacturer.logo_url ? (
              <Image
                src={manufacturer.logo_url}
                alt={manufacturer.name}
                width={120}
                height={120}
                className="h-24 w-24 object-contain transition-transform group-hover:scale-110"
                priority
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-200">
                <span className="text-xs font-semibold text-gray-400">
                  {manufacturer.name.charAt(0)}
                </span>
              </div>
            )}

            {/* שם יצרן */}
            <p className="mt-3 text-center text-sm font-semibold text-gray-900">
              {manufacturer.name}
            </p>

            {/* ספירת דגמים */}
            <p className="mt-1 text-xs text-gray-500">
              {manufacturer.models_count} דגמים
            </p>

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/50 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-sm font-medium text-white">
                {manufacturer.models_count} דגמים
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ManufacturerGrid;
