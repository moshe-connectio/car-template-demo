import { NextResponse } from 'next/server';
import { deleteSoldVehicles } from '@/lib/vehiclesRepository';

/**
 * Cron Job endpoint for automatic cleanup of sold vehicles
 * This deletes vehicles that have been marked as sold (is_published = false)
 * for more than 2 days
 * 
 * GET /api/cron/cleanup-vehicles
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/cleanup-vehicles",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Deleted 5 sold vehicles",
 *   "deletedCount": 5
 * }
 */
export async function GET() {
  try {
    console.log('🧹 Running automatic vehicle cleanup...');
    const startTime = Date.now();
    
    const deletedCount = await deleteSoldVehicles();
    
    const duration = Date.now() - startTime;
    console.log(`✅ Cleanup completed in ${duration}ms`);
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} sold vehicles`,
      deletedCount,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error in cleanup cron job:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
