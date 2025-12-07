import { NextRequest, NextResponse } from 'next/server';
import { deleteVehicleByCrmId, deleteVehicleById } from '@modules/vehicles/lib/repository';

/**
 * Webhook endpoint for deleting vehicles
 * 
 * DELETE /api/webhooks/vehicles/delete
 * 
 * Expected payload (option 1 - by CRM ID):
 * {
 *   "crmid": "ZOHO-DEAL-12345"
 * }
 * 
 * Expected payload (option 2 - by vehicle ID):
 * {
 *   "vehicleId": "550e8400-e29b-41d4-a716-446655440000"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Vehicle deleted successfully",
 *   "crmid": "ZOHO-DEAL-12345"  // or vehicleId
 * }
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Delete webhook received');
    const payload = await request.json();
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    // Validate payload
    const { crmid, vehicleId } = payload;

    if (!crmid && !vehicleId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: either "crmid" or "vehicleId" must be provided',
        },
        { status: 400 }
      );
    }

    // Delete by CRM ID (preferred for external integrations)
    if (crmid) {
      console.log(`🔍 Deleting vehicle by CRM ID: ${crmid}`);
      const wasDeleted = await deleteVehicleByCrmId(crmid);

      if (!wasDeleted) {
        return NextResponse.json(
          {
            success: false,
            error: `No vehicle found with crmid: ${crmid}`,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Vehicle deleted successfully',
        crmid,
      });
    }

    // Delete by vehicle ID (for internal use)
    if (vehicleId) {
      console.log(`🔍 Deleting vehicle by ID: ${vehicleId}`);
      await deleteVehicleById(vehicleId);

      return NextResponse.json({
        success: true,
        message: 'Vehicle deleted successfully',
        vehicleId,
      });
    }

    // Should never reach here due to validation above
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('❌ Error in delete webhook:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// Support DELETE method as well (more RESTful)
export async function DELETE(request: NextRequest) {
  return POST(request);
}
