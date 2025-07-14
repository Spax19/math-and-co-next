import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { verifyToken, extractToken } from "../../../lib/auth"; 
import bcrypt from "bcryptjs";

export async function PUT(request) {
  try {
    // 1. Extract the token from the request
    const token = extractToken(request); //

    // 2. Verify the token string
    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new password are required" },
        { status: 400 }
      );
    }

    // Get current password hash
    const [user] = await query("SELECT password FROM users WHERE id = ?", [
      decoded.userId,
    ]);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      decoded.userId,
    ]);

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
