// src/lib/db.js
// REMOVE these lines:
// import dotenv from 'dotenv';
// dotenv.config();

// Keep your MySQL connection setup:
import mysql from "mysql2/promise"; // Ensure you are importing the promise version if you are using await pool.query

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
