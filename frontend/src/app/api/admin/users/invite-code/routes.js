// app/api/admin/generate-invite/route.js
import { query } from '../../../../../lib/db';
import crypto from 'crypto';

export async function POST(request) {
    try {
        const { user } = await auth(request);
        
        // Verify admin status
        const [adminUser] = await query('SELECT userType FROM users WHERE id = ?', [user.id]);
        if (!adminUser || !['admin', 'webadmin'].includes(adminUser.userType)) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { role, expiresInDays = 7 } = await request.json();
        const code = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        await query(
            'INSERT INTO invite_codes (code, role, created_by, expires_at) VALUES (?, ?, ?, ?)',
            [code, role, user.id, expiresAt]
        );

        return new Response(JSON.stringify({ code }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Error generating invite code:", error);
        return new Response(JSON.stringify({ message: "Failed to generate invite code" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}