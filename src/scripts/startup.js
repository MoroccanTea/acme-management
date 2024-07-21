require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const ADMIN_NAME = 'henry';
const ADMIN_EMAIL = 'henry.ztilaks@acme.com';
const ADMIN_PASSWORD = 'sehorti0202';

async function createAdminUser() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Check if admin user already exists
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [ADMIN_EMAIL]);
    
    if (rows.length === 0) {
      // If admin doesn't exist, create one
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await connection.execute(
        'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
        [ADMIN_NAME, ADMIN_EMAIL, hashedPassword, 1]
      );
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error in createAdminUser:', error);
  } finally {
    if (connection) await connection.end();
  }
}

createAdminUser()
  .then(() => console.log('Admin creation script completed'))
  .catch(error => console.error('Admin creation script failed:', error))
  .finally(() => {
    // Ensure the script exits even if there was an error
    // This allows the main application to start
    process.exit(0);
  });