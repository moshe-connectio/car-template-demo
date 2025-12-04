import { NextRequest, NextResponse } from 'next/server';
import { 
  createVehicle, 
  updateVehicle, 
  upsertVehicleByCrmId,
  CreateVehicleInput, 
  UpdateVehicleInput 
} from '@/lib/vehiclesRepository';

/**
 * Webhook endpoint for creating/updating vehicles
 * 
 * POST /api/webhooks/vehicles
 * 
 * Expected payload:
 * {
 *   "action": "create" | "update" | "upsert",
 *   "data": {
 *     // For create: all required fields (slug, title, brand, model, year, price, is_published)
 *     // For update: at least one field to update
 *     // For upsert: crmid is required, will create or update based on crmid
 *   },
 *   "vehicleId": "uuid",  // Required only for update action
 *   "crmid": "string"     // Optional for create, required for upsert
 * }
 */

type WebhookPayload = 
  | {
      action: 'create';
      data: CreateVehicleInput;
    }
  | {
      action: 'update';
      vehicleId: string;
      data: UpdateVehicleInput;
    }
  | {
      action: 'upsert';
      crmid: string;
      data: CreateVehicleInput;
    };

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Webhook received');

    // Parse request body
    const body = await request.json();
    console.log('📦 Payload:', JSON.stringify(body, null, 2));

    // Validate basic structure
    if (!body.action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      );
    }

    if (!body.data) {
      return NextResponse.json(
        { error: 'Missing required field: data' },
        { status: 400 }
      );
    }

    const payload = body as WebhookPayload;

    // Handle create action
    if (payload.action === 'create') {
      const createData = payload.data as CreateVehicleInput;

      // Validate required fields
      const requiredFields = ['slug', 'title', 'brand', 'model', 'year', 'price'];
      const missingFields = requiredFields.filter((field) => !(field in createData));

      if (missingFields.length > 0) {
        return NextResponse.json(
          { 
            error: `Missing required fields for create: ${missingFields.join(', ')}` 
          },
          { status: 400 }
        );
      }

      const newVehicle = await createVehicle(createData);

      return NextResponse.json(
        {
          success: true,
          message: 'Vehicle created successfully',
          vehicleId: newVehicle.id,
          action: 'created',
        },
        { status: 201 }
      );
    }

    // Handle update action
    if (payload.action === 'update') {
      if (!payload.vehicleId) {
        return NextResponse.json(
          { error: 'Missing required field for update: vehicleId' },
          { status: 400 }
        );
      }

      const updateData = payload.data as UpdateVehicleInput;

      const updatedVehicle = await updateVehicle(payload.vehicleId, updateData);

      return NextResponse.json(
        {
          success: true,
          message: 'Vehicle updated successfully',
          vehicleId: updatedVehicle.id,
          action: 'updated',
        },
        { status: 200 }
      );
    }

    // Handle upsert action
    if (payload.action === 'upsert') {
      if (!payload.crmid) {
        return NextResponse.json(
          { error: 'Missing required field for upsert: crmid' },
          { status: 400 }
        );
      }

      const createData = payload.data as CreateVehicleInput;

      // Validate required fields for creation (in case vehicle doesn't exist)
      const requiredFields = ['slug', 'title', 'brand', 'model', 'year', 'price'];
      const missingFields = requiredFields.filter((field) => !(field in createData));

      if (missingFields.length > 0) {
        return NextResponse.json(
          { 
            error: `Missing required fields for upsert: ${missingFields.join(', ')}` 
          },
          { status: 400 }
        );
      }

      // Ensure crmid is set in the data
      const dataWithCrmId = { ...createData, crmid: payload.crmid };

      const result = await upsertVehicleByCrmId(payload.crmid, dataWithCrmId);

      return NextResponse.json(
        {
          success: true,
          message: `Vehicle ${result.action} successfully via CRM ID`,
          vehicleId: result.vehicle.id,
          action: result.action,
        },
        { status: result.action === 'created' ? 201 : 200 }
      );
    }

    // Unknown action
    return NextResponse.json(
      { error: 'Unknown action. Use "create", "update", or "upsert"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('❌ Webhook error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
