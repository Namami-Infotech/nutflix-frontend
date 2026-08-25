import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

  try {
    const res = await axios.get(`${backendUrl}/reviews?${searchParams.toString()}`, {
      validateStatus: (status) => status < 500,
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: 'Backend review service unavailable', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

  try {
    const body = await request.json();
    const res = await axios.post(`${backendUrl}/reviews`, body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: (status) => status < 500,
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to submit review to backend' },
      { status: 500 }
    );
  }
}
