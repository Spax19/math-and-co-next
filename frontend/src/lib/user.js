// lib/users.js
import { query } from './db';
import { hashPassword } from './auth';

export async function createUser({ username, email, password, role = 'user' }) {
  const hashedPassword = await hashPassword(password);
  const result = await query(
    'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, role]
  );
  return result.insertId;
}

export async function getUserById(id) {
  const [user] = await query('SELECT id, username, email, role FROM users WHERE id = ?', [id]);
  return user;
}

export async function getUserByEmail(email) {
  const [user] = await query(
    'SELECT id, username, email, password_hash, role FROM users WHERE email = ?',
    [email]
  );
  return user;
}

export async function updateUser(id, { username, email, role }) {
  await query(
    'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
    [username, email, role, id]
  );
}

export async function deleteUser(id) {
  await query('DELETE FROM users WHERE id = ?', [id]);
}