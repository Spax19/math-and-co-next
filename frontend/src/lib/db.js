// lib/db.js
import mysql from 'mysql2/promise';

// Configuration with defaults
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'math-and-co-2',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('Database configuration:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database
});

const pool = mysql.createPool(dbConfig);

export async function query(sql, params) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(sql, params);
    return rows;

  } catch (error) {
    console.error('Database error:', {
      sql,
      params,
      error: error.message
    });
    throw error;
    
  } finally {
    if (connection) connection.release();
  }
}