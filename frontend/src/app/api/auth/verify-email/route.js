// app/api/auth/verify-email/route.js
import { query } from '../../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return new Response(JSON.stringify({ 
        success: false,
        message: "Verification token is required" 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if token exists
    const [user] = await query(
      'SELECT * FROM users WHERE verification_token = ?',
      [token]
    );

    if (!user) {
      return new Response(JSON.stringify({ 
        success: false,
        message: "Invalid or expired verification token" 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update user status
    await query(
      `UPDATE users 
       SET is_verified = TRUE, status = 'active', verification_token = NULL 
       WHERE id = ?`,
      [user.id]
    );

    return new Response(JSON.stringify({ 
      success: true,
      message: "Email verified successfully!" 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Verification error:", error);
    return new Response(JSON.stringify({ 
      success: false,
      message: "Error verifying email" 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
