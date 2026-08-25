import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';
  try {
    const res = await axios.get(`${backendUrl}/products/${slug}`, {
      validateStatus: (status) => status < 400,
    });
    return NextResponse.json(res.data);
  } catch (e) {
    console.error('Error fetching product by slug from backend:', e);
  }

  return NextResponse.json(
    { success: false, error: 'Product not found' },
    { status: 404 }
  );
}
