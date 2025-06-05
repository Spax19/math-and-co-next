// For verification and auth logic
import { getToken } from './token';

export async function verifyToken(token) {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    const data = await response.json();
    return data.user; // or whatever your API returns
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Optional: A combined function that gets and verifies the token
export async function getAndVerifyToken() {
  const token = getToken();
  if (!token) return null;
  return await verifyToken(token);
}

export function isAuthenticated() {
  const token = getToken();
  return !!token;
}