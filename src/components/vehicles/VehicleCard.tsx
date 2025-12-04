import { Vehicle } from '@/lib/vehiclesRepository';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div 
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {vehicle.main_image_url ? (
          <img
            src={vehicle.main_image_url}
            alt={vehicle.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
            <svg 
              className="w-20 h-20 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
              />
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        {vehicle.km !== null && vehicle.km === 0 && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            חדש מהאפס
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {vehicle.title}
        </h3>

        {/* Brand, Model, Year */}
        <p className="text-sm text-gray-600 mb-3">
          {vehicle.brand} {vehicle.model} • {vehicle.year}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          {vehicle.km !== null && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{vehicle.km.toLocaleString('he-IL')} ק״מ</span>
            </div>
          )}
          
          {vehicle.gear_type && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>{vehicle.gear_type}</span>
            </div>
          )}
          
          {vehicle.fuel_type && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              <span>{vehicle.fuel_type}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {vehicle.short_description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {vehicle.short_description}
          </p>
        )}

        {/* Price */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              ₪{vehicle.price.toLocaleString('he-IL')}
            </span>
            <span className="text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              פרטים
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
