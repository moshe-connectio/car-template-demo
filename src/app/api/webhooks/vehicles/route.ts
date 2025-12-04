import { NextRequest, NextResponse } from 'next/server';
import { 
  upsertVehicleByCrmId,
  addImagesToVehicle,
  CreateVehicleInput, 
  AddImageInput,
  VehicleImage,
} from '@/lib/vehiclesRepository';

/**
 * Webhook endpoint for creating/updating vehicles and their images
 * 
 * POST /api/webhooks/vehicles
 * 
 * Expected payload:
 * {
 *   "crmid": "ZOHO-DEAL-12345",  // Required - use this as the unique identifier
 *   "data": {
 *     "slug": "tesla-model-3",
 *     "title": "Tesla Model 3",
 *     "brand": "Tesla",
 *     "model": "Model 3",
 *     "year": 2024,
 *     "price": 45000,
 *     "is_published": true,
 *     // Optional fields
 *     "km": 50000,
 *     "gear_type": "automatic",
 *     "fuel_type": "electric",
 *     "main_image_url": "https://...",
 *     "short_description": "...",
 *     "raw_data": {}
 *   },
 *   "images": [           // Optional
 *     {
 *       "image_url": "https://...",
 *       "position": 1,    // 1-10 (1 is primary image)
 *       "alt_text": "Front view"
 *     }
 *   ]
 * }
 * 
 * IMPORTANT: 
 * - crmid is the unique identifier for upserting vehicles
 * - If crmid exists, the vehicle will be UPDATED
 * - If crmid doesn't exist, a NEW vehicle will be created
 * - Multiple vehicles can have the same slug/title (e.g., multiple Tesla Model 3s in different colors/years)
 * - Only external image URLs are supported (no base64)
 */

type WebhookPayload = {
  crmid: string; // Required - unique identifier for upsert
  data: CreateVehicleInput;
  images?: AddImageInput[];
};

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Webhook received');

    // Parse request body
    const body = await request.json();
    console.log('📦 Payload:', JSON.stringify(body, null, 2));

    // Validate basic structure
    if (!body.data) {
      return NextResponse.json(
        { error: 'Missing required field: data' },
        { status: 400 }
      );
    }

    if (!body.crmid) {
      return NextResponse.json(
        { error: 'Missing required field: crmid (use crmid as unique identifier)' },
        { status: 400 }
      );
    }

    const payload = body as WebhookPayload;
    const createData = payload.data as CreateVehicleInput;

    console.log(`🔄 Processing webhook for crmid: ${payload.crmid}`);
    console.log(`📋 is_published: ${createData.is_published}`);

    // Special handling for marking as sold (is_published = false)
    // If is_published is false, only update that field without requiring other data
    if (createData.is_published === false) {
      console.log(`🔴 Vehicle marked as sold: ${payload.crmid}`);
      
      const result = await upsertVehicleByCrmId(payload.crmid, {
        ...createData,
        crmid: payload.crmid,
        // Only update is_published, keep other fields unchanged
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Vehicle marked as sold',
          vehicleId: result.vehicle.id,
          action: 'sold',
          imagesAdded: 0,
        },
        { status: 200 }
      );
    }

    // Normal upsert for creating/updating vehicles with full data
    // Validate required fields only for non-sold vehicles
    const requiredFieldsForCreate = ['slug', 'title', 'brand', 'model', 'year', 'price'];
    const missingRequiredFields = requiredFieldsForCreate.filter((field) => !(field in createData));

    if (missingRequiredFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingRequiredFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Always use upsert by crmid
    // If the vehicle exists (same crmid), it will be updated
    // If it doesn't exist, a new one will be created
    const result = await upsertVehicleByCrmId(payload.crmid, {
      ...createData,
      crmid: payload.crmid,
    });

    console.log(`✅ Vehicle ${result.action === 'created' ? 'created' : 'updated'}: ${result.vehicle.id}`);

    // Add images if provided
    let addedImages: VehicleImage[] = [];
    if (payload.images && payload.images.length > 0) {
      const processedImages: AddImageInput[] = [];

      // Process each image - only accept external URLs
      for (const img of payload.images) {
        // Skip base64 images (not supported in serverless environment)
        if (img.image_url.startsWith('data:image/')) {
          console.warn(`⚠️ Skipping base64 image at position ${img.position} - only external URLs are supported`);
          continue;
        }

        processedImages.push({
          ...img,
          vehicle_id: result.vehicle.id,
          image_url: img.image_url,
        });
      }

      if (processedImages.length > 0) {
        addedImages = await addImagesToVehicle(result.vehicle.id, processedImages);
        console.log(`✅ Added ${addedImages.length} images to vehicle`);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: result.action === 'created' 
          ? 'Vehicle created successfully' 
          : 'Vehicle updated successfully',
        vehicleId: result.vehicle.id,
        action: result.action,
        imagesAdded: addedImages.length,
      },
      { status: result.action === 'created' ? 201 : 200 }
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
