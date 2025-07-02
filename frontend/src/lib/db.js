import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'math-and-co',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Execute a SQL query with parameters
 * @param {string} sql - The SQL query string
 * @param {Array} params - The parameters for the query
 * @returns {Promise<Array|Object>} - The query results
 */
export async function query(sql, params) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

/**
 * Execute a SQL query in a transaction
 * @param {function} callback - The function containing queries to execute
 * @returns {Promise} - The result of the transaction
 */
export async function transaction(callback) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const result = await callback(connection);
    await connection.commit();
    
    return result;
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Transaction error:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

