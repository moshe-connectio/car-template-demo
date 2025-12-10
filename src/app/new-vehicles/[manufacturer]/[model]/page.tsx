/**
 * Model Page
 * עמוד דגם ספציפי עם בחירת רמת גימור וצפיית פרטים
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import type { ModelWithTrimLevels, TrimLevel, TrimLevelWithSpecifications } from '@modules/new-vehicles/types';
import { TrimLevelSelector } from '@modules/new-vehicles/components/TrimLevelSelector';
import { VehicleSpecifications } from '@modules/new-vehicles/components/VehicleSpecifications';

interface ModelPageProps {
  params: Promise<{
    manufacturer: string;
    model: string;
  }>;
  searchParams: Promise<{
    trim?: string;
  }>;
}

// This is a client component that will be fetched
export default function ModelPage() {
  const [modelData, setModelData] = useState<ModelWithTrimLevels | null>(null);
  const [selectedTrim, setSelectedTrim] = useState<TrimLevel | null>(null);
  const [trimDetails, setTrimDetails] = useState<TrimLevelWithSpecifications | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Note: In a real app, you'd get params from the page component
  // This is a simplified version. Let's create a proper server component instead.

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="h-12 w-1/3 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 w-full animate-pulse rounded bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !modelData) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            שגיאה בטעינת הדגם
          </h1>
          <p className="mt-4 text-gray-600">{error}</p>
          <Link href="/new-vehicles" className="mt-6 inline-block text-primary hover:underline">
            חזור לדף הרכבים
          </Link>
        </div>
      </main>
    );
  }

  if (!selectedTrim) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-gray-600">בחר רמת גימור</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-linear-to-r from-primary/5 to-primary/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link
              href="/new-vehicles"
              className="hover:text-primary hover:underline"
            >
              רכבים חדשים
            </Link>
            <span>/</span>
            <Link
              href={`/new-vehicles/${modelData.manufacturer_slug}`}
              className="hover:text-primary hover:underline"
            >
              {modelData.manufacturer_name}
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-900">
              {modelData.name}
            </span>
          </nav>

          {/* Header Content */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            {/* Logo + Image */}
            <div className="shrink-0 sm:order-2">
              {modelData.image_url && (
                <Image
                  src={modelData.image_url}
                  alt={modelData.name}
                  width={400}
                  height={300}
                  className="rounded-lg object-cover"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 sm:order-1">
              <div className="mb-4 flex items-center gap-3">
                {modelData.manufacturer_logo && (
                  <Image
                    src={modelData.manufacturer_logo}
                    alt={modelData.manufacturer_name}
                    width={60}
                    height={60}
                    className="h-12 w-12 object-contain"
                  />
                )}
                <div>
                  <p className="text-sm text-gray-600">
                    {modelData.manufacturer_name}
                  </p>
                  <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                    {modelData.name}
                  </h1>
                </div>
              </div>

              {modelData.body_type && (
                <p className="mb-4 text-lg text-gray-600">
                  {modelData.body_type}
                </p>
              )}

              {modelData.description && (
                <p className="text-gray-600">
                  {modelData.description}
                </p>
              )}

              {/* Stats */}
              <div className="mt-6 flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {modelData.trim_levels_count}
                  </p>
                  <p className="text-sm text-gray-600">רמות גימור</p>
                </div>
                {modelData.min_price && (
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      ₪{modelData.min_price.toLocaleString('he-IL')}
                    </p>
                    <p className="text-sm text-gray-600">מחיר מתחיל</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar - Trim Selector */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                בחר רמת גימור
              </h2>
              <TrimLevelSelector
                trimLevels={modelData.trim_levels || []}
                onSelect={setSelectedTrim}
                selectedId={selectedTrim?.id}
              />
            </div>
          </div>

          {/* Main - Specifications */}
          <div className="lg:col-span-2">
            {trimDetails && (
              <VehicleSpecifications trimLevel={trimDetails} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
