import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

export async function PUT(request) {
  try {
    // Verify JWT token
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, email, phone, address } = await request.json();

    // Validate input
    if (!username || !email) {
      return NextResponse.json(
        { error: "Username and email are required" },
        { status: 400 }
      );
    }

    // Update user data
    await connectToDB(
      `UPDATE users 
       SET username = ?, email = ?, phone = ?, address = ?
       WHERE id = ?`,
      [username, email, phone || null, address || null, decoded.userId]
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
