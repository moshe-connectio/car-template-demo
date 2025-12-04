import { getPublishedVehicles, Vehicle } from '@/lib/vehiclesRepository';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { VehicleGrid } from '@/components/vehicles/VehicleGrid';

export const revalidate = 60;

export default async function VehiclesPage() {
  let vehicles: Vehicle[] = [];
  let error: string | null = null;

  try {
    vehicles = await getPublishedVehicles();
  } catch (err) {
    console.error('Failed to load vehicles:', err);
    error = 'שגיאה בטעינת הרכבים. אנא נסה שוב מאוחר יותר.';
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-12">
          <Container>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              רכבים למכירה
            </h1>
            <p className="text-xl text-blue-100">
              גלה את מגוון הרכבים שלנו - מחירים תחרותיים ושירות מעולה
            </p>
          </Container>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200 py-6">
          <Container>
            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {vehicles.length}
                </div>
                <div className="text-sm text-gray-600">רכבים זמינים</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600">מאושרים</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">שירות לקוחות</div>
              </div>
            </div>
          </Container>
        </div>

        {/* Vehicles Grid */}
        <Container className="py-12">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <VehicleGrid vehicles={vehicles} />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
