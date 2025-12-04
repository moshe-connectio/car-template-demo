import { getVehicleBySlug } from '@/lib/vehiclesRepository';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return Response.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const vehicle = await getVehicleBySlug(slug);

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
