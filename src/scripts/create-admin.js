const bcrypt = require('bcryptjs');
const poolPromise = require('../config/database');

const ADMIN_NAME = 'henry';
const ADMIN_EMAIL = 'henry.ztilaks@acme.com';
const ADMIN_PASSWORD = 'sehorti0202';

async function createAdminUser() {
  console.log('Creating admin user...');
  let connection;
  try {
    const pool = await poolPromise;
    connection = await pool.getConnection();
    
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [ADMIN_EMAIL]);
    if (rows.length > 0) {
      console.log('Admin user already exists');
      return;
    }
    
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await connection.query(
      'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)', 
      [ADMIN_NAME, ADMIN_EMAIL, hashedPassword, 1]
    );
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

createAdminUser()
  .then(() => {
    console.log('Admin user creation process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Admin user creation failed:', error);
    process.exit(1);
  });