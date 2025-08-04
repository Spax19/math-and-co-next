// app/api/auth/resend-verification/route.js
import { connectToDB } from "../../../../lib/db";
import { sendVerificationEmail } from "../../../../lib/email";

export async function POST(request) {
  const { email } = await request.json();

  // Generate new token and update user
  const newToken = crypto.randomBytes(32).toString("hex");
  const newExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await connectToDB(
    `UPDATE users 
         SET verification_token = ?, verification_expires = ?
         WHERE email = ?`,
    [newToken, newExpires, email]
  );

  // Resend email
  await sendVerificationEmail(email, newToken);

  return Response.json({ success: true });
}
