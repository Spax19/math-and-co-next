export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { generateToken } from '../../../../lib/jwt';


export async function POST(request) {
    try {
        const requestBody = await request.json();
        console.log('Login request body:', requestBody);

        const { email, password } = requestBody;

        if (!email || !password) {
            console.log('Validation failed - missing fields');
            return NextResponse.json(
                { success: false, error: "Email and password are required" },
                { status: 400 }
            );
        }

        console.log('Querying database for email:', email);
        const [user] = await query(
            'SELECT id, email, password, userType FROM users WHERE email = ?',
            [email]
        );

        if (!user) {
            console.log('No user found with email:', email);
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        console.log('User found, verifying password...');
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.log('Password mismatch for user:', user.id);
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        // Set HTTP-only cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.userType
            }
        });

        response.cookies.set({
            name: 'auth-token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60, // 1 hour
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}