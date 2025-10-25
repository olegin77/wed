import { NextResponse } from 'next/server';

/**
 * Health check endpoint for the frontend application
 * Returns 200 OK with status information
 */
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'frontend'
    },
    { status: 200 }
  );
}
