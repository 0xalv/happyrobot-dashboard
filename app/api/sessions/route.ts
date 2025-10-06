import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function GET() {
  try {
    // Fetch from backend with API key authentication
    const apiKey = process.env.BACKEND_API_KEY;
    if (!apiKey) {
      throw new Error('BACKEND_API_KEY is not configured');
    }

    const response = await fetch(`${BACKEND_URL}/api/dashboard/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      cache: 'no-store', // Disable caching for real-time updates
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sessions data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
