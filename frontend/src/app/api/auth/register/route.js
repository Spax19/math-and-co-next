// src/app/api/auth/register/route.js
import { connectToDB } from "../../../../lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../../../../lib/email";

// Special admin passwords (store these in environment variables in production)
const ADMIN_PASSWORD = "math-and-co-admin@123";
const WEB_ADMIN_PASSWORD = "math-and-co-webadmin@123";

export async function POST(request) {
  try {
    const { username, email, password, inviteCode } = await request.json();

    // Validate required fields
    if (!username || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate username (letters and spaces only, 2-50 chars)
    if (!/^[a-zA-Z\s]{2,50}$/.test(username)) {
      return Response.json(
        { success: false, message: "Name must be 2-50 letters only" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if email exists
    const existingUser = await connectToDB(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return Response.json(
        { success: false, message: "Email already in use" },
        { status: 409 }
      );
    }

    // Add this validation before userType determination
    if (password.length < 8) {
      return Response.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Determine userType based on password
    let userType = "user";
    if (password === ADMIN_PASSWORD) {
      userType = "admin";
    } else if (password === WEB_ADMIN_PASSWORD) {
      userType = "web-admin";
    }

    // Process registration
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await connectToDB(
      `INSERT INTO users 
             (username, email, password, userType, verification_token, verification_expires, status)
             VALUES (?, ?, ?, ?, ?, ?, 'inactive')`,
      [
        username,
        email,
        hashedPassword,
        userType,
        verificationToken,
        verificationExpires,
      ]
    );

    // Send verification email with username
    await sendVerificationEmail(email, username, verificationToken);

    return Response.json(
      {
        success: true,
        message:
          "Registration successful! Please check your email to verify your account.",
        email: email,
        userType: userType, // Return the assigned user type
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Registration failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
