import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Image Upload Endpoint
 * Handles image upload and saves to public/vehicles/images
 * Returns the relative path for use in vehicle database
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const vehicleId = formData.get('vehicleId') as string;
    const position = formData.get('position') as string;

    // Validation
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Missing vehicleId' },
        { status: 400 }
      );
    }

    if (!position || isNaN(Number(position)) || Number(position) < 1 || Number(position) > 10) {
      return NextResponse.json(
        { error: 'Position must be a number between 1 and 10' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Create directory structure
    const vehicleDir = join(process.cwd(), 'public/vehicles/images', vehicleId);
    const imagesDir = join(vehicleDir);

    if (!existsSync(imagesDir)) {
      await mkdir(imagesDir, { recursive: true });
    }

    // Generate filename
    const ext = file.name.split('.').pop();
    const filename = `image-${position}.${ext}`;
    const filepath = join(imagesDir, filename);
    const relativePath = `/vehicles/images/${vehicleId}/${filename}`;

    // Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    console.log(`✅ Image saved successfully: ${relativePath}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Image uploaded successfully',
        imageUrl: relativePath,
        vehicleId,
        position: Number(position),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Image upload error:', error);
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
