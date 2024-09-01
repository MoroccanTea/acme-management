const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const User = {
  findAll: async () => {
    const connection = await pool;
    const [rows] = await connection.query('SELECT * FROM users');
    return rows;
  },

  findById: async (id) => {
    const connection = await pool;
    const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  findByEmail: async (email) => {
    const connection = await pool;
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  create: async (userData) => {
    const connection = await pool;
    const { name, email, password, isAdmin } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, isAdmin ? 1 : 0]
    );
    return { id: result.insertId, ...userData, password: undefined };
  },

  update: async (id, userData) => {
    const connection = await pool;
    const { name, email, isAdmin } = userData;
    const [result] = await connection.query(
      'UPDATE users SET name = ?, email = ?, isAdmin = ? WHERE id = ?',
      [name, email, isAdmin ? 1 : 0, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const connection = await pool;
    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  comparePassword: async (password, hash) => {
    return bcrypt.compare(password, hash);
  }
};

module.exports = User;