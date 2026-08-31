import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';
  try {
    const res = await axios.get(`${backendUrl}/payment/razorpay/key`);
    return NextResponse.json(res.data);
  } catch (error) {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RqJtOyGfDiW0vw';
    return NextResponse.json({
      success: true,
      data: { keyId },
    });
  }
}
