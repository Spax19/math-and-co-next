import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(request) {
  try {
    // Verify JWT token
    const decoded = await verifyToken(request);
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
    const [user] = await connectToDB(
      "SELECT password FROM users WHERE id = ?",
      [decoded.userId]
    );

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
    await connectToDB("UPDATE users SET password = ? WHERE id = ?", [
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
