import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';
    
    const token = request.headers.get('authorization') || '';

    const res = await axios.post(`${backendUrl}/payment/razorpay/verify`, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    const errData = error?.response?.data || {
      success: false,
      message: error?.message || 'Payment verification failed',
    };
    return NextResponse.json(errData, { status: error?.response?.status || 400 });
  }
}
