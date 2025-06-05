// lib/session-edge.js
export async function verifySession(request) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) return null;

  // In Edge Runtime, we'll validate the token by making an API call
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}