/**
 * New Vehicles - Main Page
 * עמוד ראשי עם רשת יצרנים
 */

import { Metadata } from 'next';
import { getAllManufacturers } from '@modules/new-vehicles/lib/repository';
import { ManufacturerGrid } from '@modules/new-vehicles/components/ManufacturerGrid';

export const metadata: Metadata = {
  title: 'רכבים חדשים | חנותנו',
  description: 'גלה את כל הרכבים החדשים שנמכרים בישראל - יצרנים, דגמים ורמות גימור',
  openGraph: {
    title: 'רכבים חדשים',
    description: 'גלה את כל הרכבים החדשים',
    type: 'website',
  },
};

async function NewVehiclesPage() {
  try {
    const manufacturers = await getAllManufacturers();

    return (
      <main className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="border-b border-gray-200 bg-linear-to-r from-primary/5 to-primary/10 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                רכבים חדשים
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                גלה את כל היצרנים וקבל את הרכב המושלם עבורך
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {manufacturers.length} יצרנים זמינים
            </h2>
            <p className="mt-2 text-gray-600">
              בחר יצרן כדי לראות את כל הדגמים וגישות הרכייה
            </p>
          </div>

          {/* Manufacturers Grid */}
          <ManufacturerGrid manufacturers={manufacturers} />
        </div>

        {/* Info Section */}
        <div className="border-t border-gray-200 bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-xl font-bold text-primary">
                    {manufacturers.length}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  יצרנים
                </h3>
                <p className="mt-2 text-gray-600">
                  מגוון רחב של יצרנים בעולם
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-xl font-bold text-primary">+</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  דגמים מהנדסים
                </h3>
                <p className="mt-2 text-gray-600">
                  אלפי דגמים להבחירה
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-xl font-bold text-primary">✓</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  בחירה קלה
                </h3>
                <p className="mt-2 text-gray-600">
                  השוואה וחיפוש בקל
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading manufacturers:', error);
    
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">שגיאה בטעינת היצרנים</h1>
          <p className="mt-4 text-gray-600">
            אנא נסה שוב מאוחר יותר
          </p>
        </div>
      </main>
    );
  }
}

export default NewVehiclesPage;
