import { getPublishedVehicles, Vehicle } from '@/lib/vehiclesRepository';

export const revalidate = 60;

export default async function VehiclesDemoPage() {
  let vehicles: Vehicle[] = [];
  let error: string | null = null;

  try {
    vehicles = await getPublishedVehicles();
  } catch (err) {
    console.error('Failed to load vehicles:', err);
    error = 'Failed to load vehicles. Please try again later.';
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Vehicles Demo (DB)</h1>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error text-error rounded">
          {error}
        </div>
      )}

      <p className="mb-6 text-gray-600">
        {vehicles.length === 0
          ? 'No vehicles found'
          : `Loaded ${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''}`}
      </p>

      {vehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {vehicle.main_image_url && (
                <img
                  src={vehicle.main_image_url}
                  alt={vehicle.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{vehicle.title}</h2>

                <p className="text-sm text-gray-600 mb-3">
                  {vehicle.brand} {vehicle.model} ({vehicle.year})
                </p>

                <p className="text-xl font-bold text-success mb-3">
                  ₪{vehicle.price.toLocaleString('he-IL')}
                </p>

                {vehicle.km !== null && (
                  <p className="text-sm text-gray-500 mb-3">
                    {vehicle.km.toLocaleString('he-IL')} km
                  </p>
                )}

                {vehicle.short_description && (
                  <p className="text-sm text-gray-700">
                    {vehicle.short_description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
