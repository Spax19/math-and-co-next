// app/api/auth/validate/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/jwt';

export async function POST(request) {
  try {
    const { token } = await request.json();
    const decoded = verifyToken(token);
    return NextResponse.json(decoded);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}