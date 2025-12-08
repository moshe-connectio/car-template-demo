import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@core/lib/supabase';
import { 
  upsertVehicleByCrmId,
  addImagesToVehicle,
  deleteVehicleImages,
  CreateVehicleInput, 
  AddImageInput,
  VehicleImage,
} from '@modules/vehicles/lib/repository';
import { generateVehicleSlug, extractIdFromSlug } from '@shared/utils/formatting';

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
 *       "position": 1,    // 1-20 (1 is primary image)
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
  images?: Omit<AddImageInput, 'vehicle_id'>[];
};

/**
 * Extract actual download URL from Zoho WorkDrive HTML page
 */
async function extractZohoDownloadUrl(htmlPageUrl: string): Promise<string> {
  try {
    // Fetch the HTML page
    const response = await fetch(htmlPageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Zoho page: HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extract downloadUrl from JavaScript variable in the HTML
    // Pattern: downloadUrl = "https://files-accl.zohoexternal.com/..."
    const downloadUrlMatch = html.match(/downloadUrl\s*=\s*"([^"]+)"/);
    
    if (!downloadUrlMatch || !downloadUrlMatch[1]) {
      throw new Error('Could not extract download URL from Zoho WorkDrive page');
    }

    const actualDownloadUrl = downloadUrlMatch[1];
    return actualDownloadUrl;
  } catch (error) {
    console.error(`❌ Error extracting Zoho URL`);
    throw error;
  }
}

/**
 * Download image from URL and return buffer with filename
 */
async function downloadImage(imageUrl: string): Promise<{ buffer: Buffer; filename: string; contentType: string }> {
  try {
    // For Google Drive URLs, convert to direct download URL
    let downloadUrl = imageUrl;
    if (imageUrl.includes('drive.google.com')) {
      const fileIdMatch = imageUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        downloadUrl = `https://drive.google.com/uc?id=${fileIdMatch[1]}&export=download`;
      }
    }

    const isZohoWorkdrive = imageUrl.includes('workdrive.zoho');
    let triedExtract = false;

    const fetchImage = async (url: string) => {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';

      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
      const urlLower = url.toLowerCase();
      const hasImageExtension = imageExtensions.some(ext => urlLower.endsWith(ext));
      const isOctetStream = contentType === 'application/octet-stream' || contentType === 'binary/octet-stream';
      const isZoho = isZohoWorkdrive;
      const isImageLike = contentType.includes('image') || isOctetStream || (contentType === '' && hasImageExtension);

      // If Zoho and content-type is HTML, try to extract real download URL
      if (isZoho && !isImageLike) {
        if (triedExtract) {
          throw new Error(`Zoho response not image even after extraction: ${contentType}`);
        }
        triedExtract = true;
        const extractedUrl = await extractZohoDownloadUrl(url);
        return await fetchImage(extractedUrl);
      }

      if (!isZoho && !isImageLike) {
        throw new Error(`Invalid content type: ${contentType}. Expected image or octet-stream with image extension.`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const contentDisposition = response.headers.get('content-disposition');
      let actualFilename = 'image';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          actualFilename = filenameMatch[1].replace(/['"]/g, '');
          if (actualFilename.includes('UTF-8')) {
            const urlEncodedMatch = actualFilename.match(/UTF-8''(.+)/);
            if (urlEncodedMatch) {
              actualFilename = decodeURIComponent(urlEncodedMatch[1]);
            }
          }
        }
      }

      // Ensure filename has a proper extension
      const hasExt = /\.[a-zA-Z0-9]+$/.test(actualFilename);
      if (!hasExt) {
        const ct = contentType.toLowerCase();
        const ctToExt: Record<string, string> = {
          'image/jpeg': 'jpg',
          'image/jpg': 'jpg',
          'image/png': 'png',
          'image/webp': 'webp',
          'image/gif': 'gif',
          'image/bmp': 'bmp',
        };
        const guessedExt = ctToExt[ct] || (hasImageExtension ? urlLower.split('.').pop() || 'jpg' : 'jpg');
        actualFilename = `${actualFilename}.${guessedExt}`;
      }

      return { buffer, filename: actualFilename, contentType };
    };

    try {
      // Try direct fetch first (even for Zoho). If content-type invalid, fall back to extraction once.
      return await fetchImage(downloadUrl);
    } catch (directErr) {
      console.warn('⚠️ Direct download failed or invalid content-type', directErr);
      if (isZohoWorkdrive && !triedExtract) {
        triedExtract = true;
        const extractedUrl = await extractZohoDownloadUrl(imageUrl);
        console.log(`🔄 Retrying with extracted Zoho URL: ${extractedUrl}`);
        return await fetchImage(extractedUrl);
      }
      throw directErr;
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ Download failed: ${errorMsg}`);
    throw error;
  }
}

/**
 * Upload image to Supabase Storage
 */
async function uploadImageToSupabase(
  imageBuffer: Buffer,
  vehicleSlug: string,
  vehicleId: string,
  position: number,
  originalFileName: string,
  sourceContentType?: string
): Promise<string> {
  try {
    const client = createServerSupabaseClient();

    // Extract ID suffix from vehicle ID (last 8 chars)
    const idSuffix = vehicleId.slice(-8);

    // Create folder path: vehicles/{idSuffix}/ (using ID only to avoid Hebrew chars)
    const folderPath = `vehicles/${idSuffix}`;

    // Generate unique filename: position-{timestamp}.{ext}
    const timestamp = Date.now();
    const ext = originalFileName.split('.').pop() || 'jpg';
    const fileName = `${position}-${timestamp}.${ext}`;
    const filePath = `${folderPath}/${fileName}`;

    // Choose content type based on source
    const ct = (sourceContentType && sourceContentType.toLowerCase().startsWith('image/'))
      ? sourceContentType
      : (originalFileName.toLowerCase().endsWith('.png')
          ? 'image/png'
          : originalFileName.toLowerCase().endsWith('.webp')
            ? 'image/webp'
            : originalFileName.toLowerCase().endsWith('.gif')
              ? 'image/gif'
              : 'image/jpeg');

    const { data, error } = await client.storage
      .from('vehicle-images')
      .upload(filePath, imageBuffer, {
        contentType: ct,
        upsert: false,
      });

    if (error) {
      console.error(`❌ Supabase upload error:`, JSON.stringify(error, null, 2));
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    // Get public URL
    const publicUrlData = client.storage
      .from('vehicle-images')
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.data || !publicUrlData.data.publicUrl) {
      throw new Error('Failed to generate public URL');
    }

    return publicUrlData.data.publicUrl;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`❌ Upload error: ${msg}`);
    throw error;
  }
}

/**
 * Process and upload images from webhook (parallel processing)
 */
async function processAndUploadImages(
  vehicleId: string,
  vehicleSlug: string,
  images: (Omit<AddImageInput, 'vehicle_id'> & { image_url: string })[]
): Promise<AddImageInput[]> {
  // Process all images in parallel
  const imagePromises = images.map(async (img) => {
    try {
      // Skip if URL is base64
      if (img.image_url.startsWith('data:image/')) {
        console.warn(`⚠️ Skipping base64 image at position ${img.position}`);
        return null;
      }

      // Download image
      const { buffer: imageBuffer, filename: originalFileName, contentType } = await downloadImage(img.image_url);

      // Upload to Supabase Storage
      const supabaseUrl = await uploadImageToSupabase(
        imageBuffer,
        vehicleSlug,
        vehicleId,
        img.position,
        originalFileName,
        contentType
      );

      // Return image data for database
      return {
        vehicle_id: vehicleId,
        image_url: supabaseUrl,
        position: img.position,
        alt_text: img.alt_text || null,
      } as AddImageInput;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to process image at position ${img.position}`);
      // Return null for failed images
      return null;
    }
  });

  // Wait for all images to complete
  const results = await Promise.all(imagePromises);
  
  // Filter out failed images (null values)
  const uploadedImages = results.filter((img): img is AddImageInput => img !== null);
  
  console.log(`✅ Successfully processed ${uploadedImages.length}/${images.length} images`);
  return uploadedImages;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ Invalid JSON');
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Validate basic structure
    if (!body || typeof body !== 'object') {
      console.error('❌ Invalid payload');
      return NextResponse.json(
        { error: 'Payload must be a JSON object' },
        { status: 400 }
      );
    }

    if (!body.data) {
      console.error('❌ Missing required field: data');
      return NextResponse.json(
        { error: 'Missing required field: data' },
        { status: 400 }
      );
    }

    if (!body.crmid) {
      console.error('❌ Missing required field: crmid');
      return NextResponse.json(
        { error: 'Missing required field: crmid' },
        { status: 400 }
      );
    }

    const payload = body as WebhookPayload;
    let createData = payload.data as CreateVehicleInput;

    // Normalize condition field - convert variations to standard format
    if (createData.condition) {
      const normalizedCondition = createData.condition.trim();
      if (normalizedCondition === 'אפס ק״מ' || normalizedCondition === 'אפס קמ') {
        createData = { ...createData, condition: '0 ק״מ' as any };
      }
    }

    // Normalize hand field - convert Hebrew text to number
    if (createData.hand !== undefined && createData.hand !== null) {
      let handValue: number;
      
      if (typeof (createData.hand as any) === 'string') {
        const handStr = (createData.hand as any).trim();
        const hebrewHandMap: Record<string, number> = {
          'ראשונה': 1,
          'שנייה': 2,
          'שלישית': 3,
          'רביעית': 4,
          'חמישית': 5,
          'שישית': 6,
          'שביעית': 7,
          'שמינית': 8,
          'תשיעית': 9,
          'עשירית': 10,
        };
        
        handValue = hebrewHandMap[handStr] || parseInt(handStr, 10);
      } else {
        handValue = createData.hand as number;
      }
      
      createData = { ...createData, hand: handValue as any };
    }

    // Special handling for marking as sold (is_published = false)
    // If is_published is false, only update that field without requiring other data
    if (createData.is_published === false) {
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

    // Prepare images array - include main_image_url as position 1 if provided
    let imagesToProcess = [...(payload.images || [])];

    // Add main_image_url as primary image (position 1) if provided
    if (createData.main_image_url) {
      imagesToProcess.unshift({
        image_url: createData.main_image_url,
        position: 1,
        alt_text: `${createData.title || 'Vehicle'} - Main Image`,
      });
    }

    // Add images if provided - download, upload to Supabase Storage, and save URLs
    let addedImages: VehicleImage[] = [];
    if (imagesToProcess.length > 0) {
      try {
        // Filter valid images
        const validImages = imagesToProcess.filter(img => {
          if (img.image_url.startsWith('data:image/')) {
            return false;
          }
          return true;
        });

        if (validImages.length > 0) {
          // Process and upload all images first
          const uploadedImages = await processAndUploadImages(
            result.vehicle.id,
            createData.slug,
            validImages
          );

          if (uploadedImages.length > 0) {
            // Only delete old images AFTER we successfully uploaded new ones
            if (result.action === 'updated') {
              await deleteVehicleImages(result.vehicle.id);
            }

            // Now add the new images to database
            addedImages = await addImagesToVehicle(result.vehicle.id, uploadedImages);
          }
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
