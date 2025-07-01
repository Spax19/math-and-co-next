// lib/db.js
import mysql from "mysql2/promise";

// Configuration with defaults
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

console.log("Database configuration:", {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
});

const pool = mysql.createPool(dbConfig);

export async function query(sql, params) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Database error:", {
      sql,
      params,
      error: error.message,
    });
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  query: async (sql, params) => {
    const [rows] = await pool.query(sql, params);
    return rows;
  },
};
