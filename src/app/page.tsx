import { getPublishedVehicles, Vehicle } from '@modules/vehicles/lib/repository';
import { Header } from '@shared/components/layout/Header';
import { Footer } from '@shared/components/layout/Footer';
import { Container } from '@shared/components/layout/Container';
import { VehicleGrid } from '@modules/vehicles/components/VehicleGrid';
import { APP_CONFIG, ROUTES } from '@core/lib/constants';

export const revalidate = 3600; // ISR - 1 hour for home page

export default async function HomePage() {
  let vehicles: Vehicle[] = [];
  let error: string | null = null;

  try {
    vehicles = await getPublishedVehicles();
    // Filter only published vehicles (not sold) for home page
    vehicles = vehicles.filter(v => v.is_published);
  } catch (err) {
    console.error('Failed to load vehicles:', err);
    error = 'שגיאה בטעינת הרכבים. אנא נסה שוב מאוחר יותר.';
  }

  // Get featured vehicles (first 6)
  const featuredVehicles = vehicles.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-primary text-white py-20">
          <Container>
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {APP_CONFIG.name}
              </h1>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                {APP_CONFIG.description}
              </p>
              <a
                href={ROUTES.vehicles}
                className="inline-block bg-white text-primary font-semibold py-3 px-8 rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                צפה בכל הרכבים
              </a>
            </div>
          </Container>
        </div>

        {/* Featured Vehicles Section */}
        <Container className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              רכבים מומלצים
            </h2>
            <p className="text-lg text-gray-600">
              בחר מהרכבים המשובחים שלנו
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-error/10 border border-error text-error rounded-lg">
              {error}
            </div>
          )}

          {featuredVehicles.length > 0 ? (
            <VehicleGrid vehicles={featuredVehicles} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">אין רכבים זמינים כרגע</p>
            </div>
          )}
        </Container>

        {/* CTA Section */}
        {vehicles.length > 6 && (
          <div className="bg-secondary text-white py-16">
            <Container>
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  יותר {vehicles.length - 6} רכבים חיכים לך
                </h2>
                <a
                  href={ROUTES.vehicles}
                  className="inline-block bg-white text-secondary font-semibold py-3 px-8 rounded-lg hover:shadow-lg transition-shadow duration-300"
                >
                  עיין בקטלוג המלא
                </a>
              </div>
            </Container>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
