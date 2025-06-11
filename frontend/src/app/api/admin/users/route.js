// app/api/admin/users/route.js
import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(request) {
  try {
    // Verify admin role from headers (set by middleware)
    const role = request.headers.get('x-user-role');
    if (role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const users = await query('SELECT id, username, email, role FROM users');
    return NextResponse.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { username, email, password, role: userRole } = await request.json();
    const hashedPassword = await hashPassword(password);
    
    await query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, userRole]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}