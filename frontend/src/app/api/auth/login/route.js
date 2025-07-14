import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import { createToken } from "../../../../lib/auth";
import bcrypt from "bcryptjs";
import { verifyToken } from "../../../../lib/auth";

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

    console.log("Login API: User object fetched from DB:", user);
    console.log("Login API: User Type (role) from DB:", user.role);

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
    const token = await createToken(user);

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

export async function GET(request) {
  // 1. Get the token from the HttpOnly cookie (server-side can access it)
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    console.log("/api/auth/me: No token found in cookies.");
    return NextResponse.json(
      { success: false, message: "No token provided" },
      { status: 401 }
    );
  }

  try {
    // 2. Verify the token using your server-side function
    const decoded = await verifyToken(token); // This returns the payload { userId, email, role, ... }

    // DEBUGGING: Log the decoded payload on the server
    console.log("/api/auth/login: Decoded token payload:", decoded);

    if (!decoded || !decoded.userId || !decoded.role) {
      // Basic validation
      console.log("/api/auth/login: Invalid or incomplete token payload.");
      return NextResponse.json(
        { success: false, message: "Invalid token payload" },
        { status: 401 }
      );
    }

    // 3. Return the user's essential info, INCLUDING THEIR ROLE, to the client
    return NextResponse.json(
      {
        success: true,
        user: {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role, // <-- THIS IS WHAT ProtectedRoute NEEDS
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/auth/login:", error);
    // Clear the token if it's expired or invalid (on the server-side, for the client)
    const response = NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 401 }
    );
    response.cookies.delete("auth-token"); // Delete invalid/expired token from cookie
    return response;
  }
}
