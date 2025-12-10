/**
 * ModelGrid Component
 * רשת דגמים עם תמונה ושם דגם
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ModelWithManufacturer } from '../types';

interface ModelGridProps {
  models: ModelWithManufacturer[];
  manufacturerSlug: string;
  isLoading?: boolean;
}

export function ModelGrid({ models, manufacturerSlug, isLoading }: ModelGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-lg border border-gray-200"
          >
            <div className="aspect-video bg-gray-200" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
        <p className="text-center text-gray-500">אין דגמים זמינים</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <Link
          key={model.id}
          href={`/new-vehicles/${manufacturerSlug}/${model.slug}`}
          className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:border-primary hover:shadow-lg"
        >
          {/* תמונה דגם */}
          <div className="relative aspect-video overflow-hidden bg-gray-100">
            {model.image_url ? (
              <Image
                src={model.image_url}
                alt={model.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <span className="text-sm font-medium text-gray-400">
                  אין תמונה
                </span>
              </div>
            )}
          </div>

          {/* מידע דגם */}
          <div className="p-4">
            {/* שם דגם */}
            <h3 className="text-lg font-semibold text-gray-900">
              {model.name}
            </h3>

            {/* סוג גוף */}
            {model.body_type && (
              <p className="mt-1 text-sm text-gray-600">
                {model.body_type}
              </p>
            )}

            {/* טווח מחיר */}
            <div className="mt-3 flex items-baseline gap-2 text-sm">
              <span className="text-xs text-gray-500">מחיר:</span>
              <span className="font-semibold text-gray-900">
                {model.min_price && model.max_price ? (
                  <>
                    ₪{model.min_price.toLocaleString('he-IL')} -
                    <br />
                    ₪{model.max_price.toLocaleString('he-IL')}
                  </>
                ) : model.min_price ? (
                  `₪${model.min_price.toLocaleString('he-IL')}`
                ) : (
                  'לא מוגדר'
                )}
              </span>
            </div>

            {/* ספירת רמות גימור */}
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-500">
                {model.trim_levels_count} רמות גימור
              </span>
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                בחר
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ModelGrid;
