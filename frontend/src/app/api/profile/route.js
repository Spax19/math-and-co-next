// src/app/api/profile/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/db";
import { getCurrentUser, verifyToken } from "../../../lib/auth";

export async function GET(request) {
  try {
    // 1. Authenticate the request
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    // 2. Fetch user profile data
    // In your route handler
    const [profile] = await connectToDB(
      `SELECT 
    id, 
    username, 
    email, 
    COALESCE(phone, '') as phone, 
    COALESCE(address, '') as address, 
    CASE 
      WHEN avatar IS NULL THEN '/default-avatar.png'
      WHEN avatar = '' THEN '/default-avatar.png'
      ELSE avatar
      END as avatar,
      created_at as joinedDate
    FROM users 
    WHERE id = ?`,
      [user.id]
    );

    if (!profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // 3. Fetch recent orders (optional)
    const orders = await connectToDB(
      `SELECT 
        id, 
        order_number as orderNumber, 
        total, 
        status, 
        created_at as date
      FROM orders 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5`,
      [user.id]
    );

    // 4. Return combined profile data
    return NextResponse.json({
      ...profile,
      orders: orders || [],
    });
  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // 1. Authenticate first
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate input
    const { username, email, phone, address } = await request.json();
    if (!username || !email) {
      return NextResponse.json(
        { error: "Username and email are required" },
        { status: 400 }
      );
    }

    // 3. Update profile
    await connectToDB(
      `UPDATE users 
       SET username = ?, email = ?, phone = ?, address = ?
       WHERE id = ?`,
      [username, email, phone || null, address || null, user.id]
    );

    // 4. Return updated profile
    const [updatedProfile] = await connectToDB(
      `SELECT username, email, phone, address 
       FROM users WHERE id = ?`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
