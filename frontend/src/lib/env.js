// lib/env.js
export function getDbConfig() {
  if (typeof process === 'undefined' || !process.env) {
    throw new Error('Server-side only environment access');
  }
  
  return {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };
}