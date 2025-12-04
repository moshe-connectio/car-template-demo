import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServerClient';
import { 
  upsertVehicleByCrmId,
  addImagesToVehicle,
  CreateVehicleInput, 
  AddImageInput,
  VehicleImage,
} from '@/lib/vehiclesRepository';
import { generateVehicleSlug, extractIdFromSlug } from '@/lib/utils';

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
 *     "categories": ["חשמלי", "8 מושבים", "SUV"],    // Array of categories. Options: SUV, סדאן, האצ'בק, מיני ואן, קופה, קרוסאובר, טנדר, ספורט, חשמלי, היברידי, 4x4, יוקרה, משפחתית, מנהלים, 8 מושבים
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

/**
 * Download image from URL and return as Buffer
 */
async function downloadImage(imageUrl: string): Promise<Buffer> {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`❌ Error downloading image from ${imageUrl}:`, error);
    throw error;
  }
}

/**
 * Upload image buffer to Supabase Storage
 */
async function uploadImageToSupabase(
  imageBuffer: Buffer,
  vehicleSlug: string,
  vehicleId: string,
  position: number,
  originalFileName: string
): Promise<string> {
  try {
    const client = createServerSupabaseClient();

    // Extract ID suffix from vehicle ID (last 8 chars)
    const idSuffix = vehicleId.slice(-8);

    // Create folder path: vehicles/{slug}-{idSuffix}/
    const folderPath = `vehicles/${vehicleSlug}-${idSuffix}`;

    // Generate unique filename: position-{timestamp}-{originalName}
    const timestamp = Date.now();
    const ext = originalFileName.split('.').pop() || 'jpg';
    const fileName = `${position}-${timestamp}.${ext}`;
    const filePath = `${folderPath}/${fileName}`;

    console.log(`📤 Uploading image to: ${filePath}`);

    const { data, error } = await client.storage
      .from('vehicle-images')
      .upload(filePath, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = client.storage
      .from('vehicle-images')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;
    console.log(`✅ Image uploaded successfully: ${publicUrl}`);

    return publicUrl;
  } catch (error) {
    console.error(`❌ Error uploading image to Supabase:`, error);
    throw error;
  }
}

/**
 * Process and upload images from webhook
 */
async function processAndUploadImages(
  vehicleId: string,
  vehicleSlug: string,
  images: (AddImageInput & { image_url: string })[]
): Promise<VehicleImage[]> {
  const uploadedImages: VehicleImage[] = [];

  for (const img of images) {
    try {
      console.log(`🖼️ Processing image at position ${img.position}: ${img.image_url}`);

      // Skip if URL is base64
      if (img.image_url.startsWith('data:image/')) {
        console.warn(`⚠️ Skipping base64 image at position ${img.position}`);
        continue;
      }

      // Download image
      console.log(`⬇️ Downloading image from: ${img.image_url}`);
      const imageBuffer = await downloadImage(img.image_url);

      // Extract filename from URL
      const urlObj = new URL(img.image_url);
      const originalFileName = urlObj.pathname.split('/').pop() || 'image';

      // Upload to Supabase Storage
      const supabaseUrl = await uploadImageToSupabase(
        imageBuffer,
        vehicleSlug,
        vehicleId,
        img.position,
        originalFileName
      );

      // Add to database with new Supabase URL
      uploadedImages.push({
        vehicle_id: vehicleId,
        image_url: supabaseUrl,
        position: img.position,
        alt_text: img.alt_text || null,
      } as VehicleImage);
    } catch (error) {
      console.error(`❌ Failed to process image at position ${img.position}:`, error);
      // Continue with next image instead of failing entire webhook
      continue;
    }
  }

  // Add all successfully uploaded images to database
  if (uploadedImages.length > 0) {
    const addedImages = await addImagesToVehicle(vehicleId, uploadedImages);
    return addedImages;
  }

  return [];
}

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

    // Add images if provided - download, upload to Supabase Storage, and save URLs
    let addedImages: VehicleImage[] = [];
    if (payload.images && payload.images.length > 0) {
      try {
        console.log(`📸 Processing ${payload.images.length} images...`);
        
        // Filter valid images
        const validImages = payload.images.filter(img => {
          if (img.image_url.startsWith('data:image/')) {
            console.warn(`⚠️ Skipping base64 image at position ${img.position}`);
            return false;
          }
          return true;
        });

        if (validImages.length > 0) {
          addedImages = await processAndUploadImages(
            result.vehicle.id,
            createData.slug,
            validImages
          );
          console.log(`✅ Added ${addedImages.length} images to vehicle`);
        }
      } catch (error) {
        console.error('❌ Error processing images:', error);
        // Don't fail the entire webhook if image processing fails
        // The vehicle was created successfully
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
