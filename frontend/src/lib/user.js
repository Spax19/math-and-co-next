// lib/users.js
import { connectToDB } from './db';
import { hashPassword } from './auth';

export async function createUser({ username, email, password, role = 'user' }) {
  const hashedPassword = await hashPassword(password);
  const result = await connectToDB(
    'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, role]
  );
  return result.insertId;
}

export async function getUserById(id) {
  const [user] = await connectToDB('SELECT id, username, email, role FROM users WHERE id = ?', [id]);
  return user;
}

export async function getUserByEmail(email) {
  const [user] = await connectToDB(
    'SELECT id, username, email, password_hash, role FROM users WHERE email = ?',
    [email]
  );
  return user;
}

export async function updateUser(id, { username, email, role }) {
  await connectToDB(
    'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
    [username, email, role, id]
  );
}

export async function deleteUser(id) {
  await connectToDB('DELETE FROM users WHERE id = ?', [id]);
}