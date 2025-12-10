/**
 * Manufacturer Page
 * עמוד יצרן ספציפי עם רשת דגמים
 */

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllManufacturers, getManufacturerBySlug } from '@modules/new-vehicles/lib/repository';
import { ModelGrid } from '@modules/new-vehicles/components/ModelGrid';

interface ManufacturerPageProps {
  params: Promise<{ manufacturer: string }>;
}

// Generate static params for all manufacturers
export async function generateStaticParams() {
  try {
    const manufacturers = await getAllManufacturers();
    return manufacturers.map((m) => ({
      manufacturer: m.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata dynamically
export async function generateMetadata(
  { params }: ManufacturerPageProps
): Promise<Metadata> {
  const { manufacturer } = await params;
  
  try {
    const manufacturerData = await getManufacturerBySlug(manufacturer);
    
    if (!manufacturerData) {
      return {
        title: 'לא נמצא',
      };
    }

    return {
      title: `${manufacturerData.name} - רכבים חדשים | חנותנו`,
      description: manufacturerData.description || 
        `גלה את כל דגמי ${manufacturerData.name} החדשים שנמכרים בישראל`,
      openGraph: {
        title: `${manufacturerData.name} - רכבים חדשים`,
        description: manufacturerData.description || `דגמים של ${manufacturerData.name}`,
        images: manufacturerData.logo_url
          ? [
              {
                url: manufacturerData.logo_url,
                width: 200,
                height: 200,
                alt: manufacturerData.name,
              },
            ]
          : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'רכבים חדשים',
    };
  }
}

async function ManufacturerPage({ params }: ManufacturerPageProps) {
  const { manufacturer } = await params;

  try {
    const manufacturerData = await getManufacturerBySlug(manufacturer);

    if (!manufacturerData) {
      notFound();
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
              <span className="font-semibold text-gray-900">
                {manufacturerData.name}
              </span>
            </nav>

            {/* Manufacturer Header */}
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
              {/* Logo */}
              {manufacturerData.logo_url && (
                <div className="shrink-0">
                  <Image
                    src={manufacturerData.logo_url}
                    alt={manufacturerData.name}
                    width={150}
                    height={150}
                    className="h-32 w-32 object-contain"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                  {manufacturerData.name}
                </h1>
                
                {manufacturerData.description && (
                  <p className="mt-4 max-w-2xl text-lg text-gray-600">
                    {manufacturerData.description}
                  </p>
                )}

                {/* Stats */}
                <div className="mt-6 flex gap-8">
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      {manufacturerData.models_count}
                    </p>
                    <p className="text-sm text-gray-600">דגמים</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      {manufacturerData.total_trim_levels}
                    </p>
                    <p className="text-sm text-gray-600">רמות גימור</p>
                  </div>
                </div>
              </div>

              {/* Banner Image */}
              {manufacturerData.banner_url && (
                <div className="shrink-0">
                  <Image
                    src={manufacturerData.banner_url}
                    alt={manufacturerData.name}
                    width={300}
                    height={200}
                    className="hidden rounded-lg sm:block"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              דגמים זמינים
            </h2>
            <p className="mt-2 text-gray-600">
              בחר דגם כדי לראות את רמות הגימור והפרטים
            </p>
          </div>

          {/* Models Grid */}
          {manufacturerData.models && manufacturerData.models.length > 0 ? (
            <ModelGrid
              models={manufacturerData.models}
              manufacturerSlug={manufacturerData.slug}
            />
          ) : (
            <div className="flex min-h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              <p className="text-center text-gray-500">
                אין דגמים זמינים כעת ליצרן זה
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {manufacturerData.country && (
          <div className="border-t border-gray-200 bg-gray-50 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-gray-600">
                  <span className="font-semibold">ארץ המוצא:</span>{' '}
                  {manufacturerData.country}
                </p>
                {manufacturerData.website_url && (
                  <p className="mt-2">
                    <a
                      href={manufacturerData.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      בקר באתר הרשמי
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error(`Error loading manufacturer ${manufacturer}:`, error);
    notFound();
  }
}

export default ManufacturerPage;
