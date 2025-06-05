import { query } from '../../../../lib/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Allowed user types (prevents arbitrary role assignment)
const ALLOWED_USER_TYPES = ['user', 'admin', 'webadmin'];

export async function POST(request) {
    try {
        const { username, email, password, inviteCode } = await request.json();
        const status = "inactive";

        // Validation
        if (!email || !email.includes("@")) {
            return new Response(JSON.stringify({ message: "Valid email is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!username || !password) {
            return new Response(JSON.stringify({ message: "Username and password are required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Check if email exists
        const emailCheck = await query("SELECT * FROM users WHERE email = ?", [email]);
        if (emailCheck.length > 0) {
            return new Response(JSON.stringify({ message: "Email already in use" }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Determine user type based on invite code
        let userType = 'user'; // Default role

        if (inviteCode) {
            // Verify invite code in database (you'll need to create an invite_codes table)
            const validCode = await query(
                "SELECT * FROM invite_codes WHERE code = ? AND expires_at > NOW() AND used = FALSE",
                [inviteCode]
            );

            if (validCode.length > 0) {
                userType = validCode[0].role; // Get role from invite code
                // Mark code as used
                await query("UPDATE invite_codes SET used = TRUE WHERE code = ?", [inviteCode]);
            } else {
                return new Response(JSON.stringify({ message: "Invalid or expired invite code" }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // Only proceed with email sending if we have valid credentials
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("Email credentials missing - skipping email verification");
            return new Response(JSON.stringify({
                success: true,
                message: "Registration successful! Email verification skipped (no email configured)."
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Insert user
        const result = await query(
            `INSERT INTO users (username, email, password, userType, verification_token, is_verified, status)
       VALUES (?, ?, ?, ?, ?, FALSE, ?)`,
            [username, email, hashedPassword, userType, verificationToken, status]
        );

        // Send verification email
        //const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

        // Configure transporter with proper error handling
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        try {
            await transporter.verify();
        } catch (verifyError) {
            console.error("Email transporter verification failed:", verifyError);
            throw new Error("Email service configuration error");
        }

        const verificationLink = `${process.env.NEXTAUTH_URL}/main/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: `"Math & Co" <${process.env.EMAIL_USER}>`,
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
            `
        };

        // Send email (but don't block registration if it fails)
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error("Email sending error (non-blocking):", error);
            }
        });

        return new Response(JSON.stringify({
            success: true,
            message: "Registration successful! Please check your email to verify your account."
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

        // const mailOptions = {
        //     from: process.env.EMAIL_USER,
        //     to: email,
        //     subject: "Email Verification",
        //     html: `... your email template here ...`
        // };

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({
            success: true,
            message: "Registration successful! A verification email has been sent."
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Registration error:", error);
        return new Response(JSON.stringify({
            message: "Registration failed. Please try again."
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}