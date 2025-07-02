import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import { createToken } from "../../../../lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    // 1. Parse and validate request
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Database lookup
    const [user] = await query(
      `SELECT id, email, password, userType as role, is_verified 
       FROM users WHERE email = ?`,
      [email.toLowerCase().trim()]
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3. Check verification status
    if (!user.is_verified) {
      return NextResponse.json(
        {
          success: false,
          error: "Please verify your email before logging in",
          unverified: true,
        },
        { status: 403 }
      );
    }

    // 4. Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 5. Create token
    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Add this after successful login but before returning the response
    const [profile] = await query(
      `SELECT phone, address FROM users WHERE id = ?`,
      [user.id]
    );

    const isProfileComplete = profile.phone && profile.address;

    // 6. Create response with token and user data
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      profileComplete: isProfileComplete,
    });

    // 7. Set HTTP-only cookie (optional - choose either this or return token)
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
