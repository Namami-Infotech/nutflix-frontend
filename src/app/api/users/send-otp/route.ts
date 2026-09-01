import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5005/api';
  try {
    const body = await request.json();
    const res = await axios.post(`${backendUrl}/users/send-otp`, body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true,
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Unable to connect to backend server at ' + backendUrl },
      { status: 500 }
    );
  }
}
