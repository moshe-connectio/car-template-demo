import { getPublishedVehicles, deleteSoldVehicles, Vehicle } from '@/lib/vehiclesRepository';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { VehicleGrid } from '@/components/vehicles/VehicleGrid';

export const revalidate = 60; // ISR - 1 minute

export default async function VehiclesPage() {
  let vehicles: Vehicle[] = [];
  let error: string | null = null;

  try {
    // Clean up sold vehicles older than 1 day
    await deleteSoldVehicles();
    
    // Fetch published vehicles
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
        <div className="bg-primary text-white py-12">
          <Container>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              רכבים למכירה
            </h1>
            <p className="text-xl opacity-90">
              גלה את מגוון הרכבים שלנו - מחירים תחרותיים ושירות מעולה
            </p>
          </Container>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200 py-6">
          <Container>
            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {vehicles.length}
                </div>
                <div className="text-sm text-gray-600">רכבים זמינים</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="text-3xl font-bold text-success">100%</div>
                <div className="text-sm text-gray-600">מאושרים</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className="text-3xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-gray-600">שירות לקוחות</div>
              </div>
            </div>
          </Container>
        </div>

        {/* Vehicles Grid */}
        <Container className="py-12">
          {error && (
            <div className="mb-8 p-4 bg-error/10 border border-error text-error rounded-lg">
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
