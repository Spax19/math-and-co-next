// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";

export async function POST(request) {
  const token = request.cookies.get("session-token")?.value;

  if (token) {
    await connectToDB("DELETE FROM sessions WHERE token = ?", [token]);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("session-token");
  return response;
}
