const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dbConfig = require('../config/database');

class User {
  static async findById(id) {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
    await connection.end();
    return rows[0];
  }

  static async findByEmail(email) {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    await connection.end();
    return rows[0];
  }

  static async create(userData) {
    const { name, email, password, isAdmin } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, isAdmin ? 1 : 0]
    );
    await connection.end();
    return result.insertId;
  }

  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = User;