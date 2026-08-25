import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET() {
  const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';
  try {
    const res = await axios.get(`${backendUrl}/categories`, {
      validateStatus: (status) => status < 400,
    });
    return NextResponse.json(res.data);
  } catch (e) {
    console.error('Error fetching categories from backend:', e);
  }

  return NextResponse.json({
    success: true,
    data: [],
  });
}
