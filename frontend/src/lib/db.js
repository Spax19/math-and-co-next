import mysql from "mysql2/promise"; // Assuming you are using mysql2 with promise support
console.log("DB module loaded");
export async function connectToDB() {
  try {
    console.log("Attempting DB connection");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    // Optional: Log successful connection
    // console.log("Database connected successfully!");
    return connection;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    // Throw the error to be caught by the calling function (e.g., your API route)
    throw error;
  }
}
