import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET() {
  const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';
  try {
    const res = await axios.get(`${backendUrl}/impact`, {
      validateStatus: (status) => status < 500,
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { success: true, message: 'Impact data unavailable', data: [] },
      { status: 200 }
    );
  }
}
