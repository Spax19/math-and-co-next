import { query } from "../../../../lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

const ALLOWED_USER_TYPES = ["user", "admin", "web-admin"];

export async function POST(request) {
  try {
    const { username, email, password, inviteCode } = await request.json();

    // Input validation
    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ message: "Valid email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if email exists
    const existingUser = await query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ message: "Email already in use" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Process registration
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await query(
      `INSERT INTO users (username, email, password, userType, verification_token, status)
       VALUES (?, ?, ?, 'user', ?, 'inactive')`,
      [username, email, hashedPassword, verificationToken]
    );

    // Send verification email
    if (process.env.EMAIL_HOST) {
      await sendVerificationEmail(email, username, verificationToken);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Registration successful! Please check your email.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ message: "Registration failed. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function sendVerificationEmail(email, username, token) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `${process.env.NEXTAUTH_URL}/main/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Math & Co" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d4b26a;">Welcome to Math & Co!</h2>
            <p>Hello ${username},</p>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${verificationLink}" 
                style="display: inline-block; padding: 10px 20px; background-color: #d4b26a; 
                color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                Verify Email
            </a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${verificationLink}</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
            </div>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (emailError) {
    console.error("Failed to send verification email:", emailError);
    // Don't fail the registration if email fails
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return errorResponse(400, "Verification token is required");
  }

  try {
    const user = await query(
      "SELECT id FROM users WHERE verification_token = ?",
      [token]
    );

    if (user.length === 0) {
      return errorResponse(400, "Invalid or expired verification token");
    }

    await query(
      "UPDATE users SET is_verified = TRUE, status = 'active', verification_token = NULL WHERE id = ?",
      [user[0].id]
    );

    return successResponse("Email verified successfully!");
  } catch (error) {
    console.error("Verification error:", error);
    return errorResponse(500, "Email verification failed");
  }
}
