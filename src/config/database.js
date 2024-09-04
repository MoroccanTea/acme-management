const mysql = require('mysql2/promise');

const connectWithRetry = async () => {
  const maxRetries = 5;
  let retries = 0;
  let success = false;

  while (!success) {
    while (retries < maxRetries)
    try {
      const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT, 10),
        connectTimeout: 10000, // 10 seconds
      });

      // Test the connection
      const connection = await pool.getConnection();
      console.log('Successfully connected to the database');
      success = true;
      connection.release();
      return pool;
    } catch (err) {
      console.error('Failed to connect to the database. Error details:');
      console.error(err);
      retries++;
      success = false;
      console.log(`Retrying in 5 seconds... (Attempt ${retries} of ${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
    }
  }
  throw new Error('Max retries reached. Unable to connect to the database.');
};

module.exports = connectWithRetry();