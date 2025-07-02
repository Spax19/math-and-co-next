// lib/auth.js
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { query } from "./db";
import { SignJWT, jwtVerify } from "jose";

const SALT_ROUNDS = 12;

export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export async function createSession(userId) {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week
  await query(
    "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
    [userId, token, expiresAt]
  );
  return token;
}

// Enhanced JWT token creation
export async function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  return await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.userType,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "24h")
    .sign(secret);
}

// More robust token verification
export async function verifyToken(token) {
  if (!token || typeof token !== "string") {
    console.error("Invalid token format");
    return null;
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      clockTolerance: 15, // 15 seconds tolerance for clock skew
    });

    // Validate required claims
    if (!payload.userId || !payload.email || !payload.role) {
      console.error("Token missing required claims");
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Token verification failed:", error.name);
    return null;
  }
}

// Improved token extraction
export function extractToken(request) {
  try {
    const authHeader = request.headers?.get("authorization");
    if (!authHeader) {
      return null;
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      console.error("Invalid authorization header format");
      return null;
    }

    return token;
  } catch (error) {
    console.error("Error extracting token:", error);
    return null;
  }
}

// Enhanced current user retrieval
export async function getCurrentUser(request) {
  try {
    const token = extractToken(request);
    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    const [user] = await query(
      'SELECT id, username, email, userType FROM users WHERE id = ? AND status = "active"',
      [payload.userId]
    );

    if (!user) {
      console.error("User not found or inactive");
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Role checking with better error handling
export async function requireRole(request, requiredRole) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      throw new Error("Authentication required");
    }

    if (user.userType !== requiredRole) {
      throw new Error(`Requires ${requiredRole} privileges`);
    }

    return user;
  } catch (error) {
    console.error("Role requirement failed:", error);
    throw error; // Re-throw for route handlers to catch
  }
}
