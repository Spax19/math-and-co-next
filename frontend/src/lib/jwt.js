// lib/jwt.js
import { sign, verify } from 'jsonwebtoken';

export function generateToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return verify(token, process.env.JWT_SECRET);
}