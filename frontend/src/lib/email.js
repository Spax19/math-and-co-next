// src/lib/email.js
import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email,
  username,
  verificationToken
) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationLink = `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `"Math & Co" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d4b26a;">Welcome to Math & Co, ${username}!</h2>
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

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}
