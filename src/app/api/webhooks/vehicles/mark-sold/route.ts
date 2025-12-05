import { NextRequest, NextResponse } from 'next/server';
import { markVehicleAsSold } from '@/lib/vehiclesRepository';

/**
 * Webhook endpoint for marking a vehicle as sold (soft delete)
 * This sets is_published = false, which hides the vehicle from listings
 * After 2 days, the vehicle will be permanently deleted by the cleanup process
 * 
 * POST /api/webhooks/vehicles/mark-sold
 * 
 * Expected payload:
 * {
 *   "crmid": "ZOHO-DEAL-12345"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Vehicle marked as sold",
 *   "crmid": "ZOHO-DEAL-12345"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Mark as sold webhook received');
    const payload = await request.json();
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    // Validate payload
    const { crmid } = payload;

    if (!crmid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: crmid',
        },
        { status: 400 }
      );
    }

    console.log(`🔍 Marking vehicle as sold: ${crmid}`);

    // Mark vehicle as sold (soft delete)
    const wasMarked = await markVehicleAsSold(crmid);

    if (!wasMarked) {
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
      message: 'Vehicle marked as sold',
      crmid,
      note: 'Vehicle will be automatically deleted after 2 days',
    });
  } catch (error) {
    console.error('❌ Error in mark-sold webhook:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
