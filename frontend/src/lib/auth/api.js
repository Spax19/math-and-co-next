// For auth API calls
import { getToken } from './token';

export async function authFetch(url, options = {}) {
  const token = getToken();
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}