// src/app/api/upload-avatar/route.js
import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { verifyToken, extractToken } from "../../../lib/auth"; 
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    // 1. Extract the token from the request
    const token = extractToken(request); // 

    // 2. Verify the token string
    const decoded = await verifyToken(token); 
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type and size (client-side already does this, but good to have server-side too)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 2MB" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const ext = path.extname(file.name);
    // Ensure decoded.userId exists from the JWT payload
    if (!decoded.userId) {
      console.error("Decoded token is missing userId:", decoded);
      return NextResponse.json(
        { error: "Invalid token payload: missing userId" },
        { status: 400 }
      );
    }
    const filename = `avatar-${decoded.userId}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Save file
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Update user avatar in database
    await query("UPDATE users SET avatar = ? WHERE id = ?", [
      `/uploads/${filename}`,
      decoded.userId,
    ]);

    return NextResponse.json({
      success: true,
      avatarUrl: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    // Make sure to return specific error details from server if possible during dev
    return NextResponse.json(
      { error: "Internal server error", details: error.message }, // Added details for debugging
      { status: 500 }
    );
  }
}
