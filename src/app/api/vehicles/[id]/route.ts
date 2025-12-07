import { getVehicleById, getVehicleByIdSuffix } from '@modules/vehicles/lib/repository';
import { extractIdFromSlug } from '@shared/utils/formatting';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slugOrId } = await params;
    
    if (!slugOrId) {
      return Response.json(
        { error: 'Slug or ID is required' },
        { status: 400 }
      );
    }

    // Extract ID suffix from slug (last part after hyphens)
    const idSuffix = extractIdFromSlug(slugOrId);
    
    // Check if it looks like a full UUID, otherwise search by suffix
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let vehicle;
    
    if (uuidRegex.test(idSuffix)) {
      // Full UUID - use direct lookup
      vehicle = await getVehicleById(idSuffix);
    } else {
      // Partial ID - search by suffix
      vehicle = await getVehicleByIdSuffix(idSuffix);
    }

    if (!vehicle) {
      return Response.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return Response.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return Response.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}
