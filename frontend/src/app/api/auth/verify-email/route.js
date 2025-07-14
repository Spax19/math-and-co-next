// app/api/auth/verify-email/route.js
import { connectToDB } from "../../../../lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token) {
      return Response.redirect(
        new URL(
          "/auth/verified?status=error&message=Token required",
          request.url
        )
      );
    }

    // Check if user exists with this token (whether pending or already verified)
    const [user] = await connectToDB(
      `SELECT id, email, status FROM users WHERE verification_token = ?`,
      [token]
    );

    if (!user) {
      return Response.redirect(
        new URL("/auth/verified?status=already_verified", request.url)
      );
    }

    // If already verified
    if (user.status === "active") {
      new URL("/auth/verified?status=error&message=Invalid token", request.url);
    }

    // Check token expiration
    const [verificationData] = await connectToDB(
      `SELECT verification_expires FROM users WHERE id = ?`,
      [user.id]
    );

    const expiresAt = new Date(verificationData.verification_expires);
    if (new Date() > expiresAt) {
      const newToken = crypto.randomBytes(32).toString("hex");
      const newExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await connectToDB(
        `UPDATE users SET verification_token = ?, verification_expires = ? WHERE id = ?`,
        [newToken, newExpires, user.id]
      );

      return Response.redirect(
        new URL("/auth/verified?status=expired", request.url)
      );
    }

    // Mark as verified
    await connectToDB(
      `UPDATE users SET 
        is_verified = TRUE, 
        status = 'active', 
        verification_token = NULL,
        verification_expires = NULL,
        email_verified_at = NOW()
       WHERE id = ?`,
      [user.id]
    );

    return Response.redirect(
      new URL("/auth/verified?status=success", request.url)
    );
  } catch (error) {
    console.error("Verification error:", error);
    return Response.redirect(
      new URL(
        "/auth/verified?status=error&message=Verification failed",
        request.url
      )
    );
  }
}
