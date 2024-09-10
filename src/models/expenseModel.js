const pool = require('../config/database');

const Expense = {
  getAll: async () => {
    const connection = await pool;
    const [rows] = await connection.query('SELECT * FROM expenses');
    return rows;
  },

  getById: async (id) => {
    const connection = await pool;
    const [rows] = await connection.query('SELECT * FROM expenses WHERE id = '+ id);
    return rows[0];
  },

  create: async (expense) => {
    const connection = await pool;
    const { project_id, description, amount, date } = expense;
    const [result] = await connection.query(
      'INSERT INTO expenses (project_id, description, amount, date) VALUES (?, ?, ?, ?)',
      [project_id, description, amount, date]
    );
    return { id: result.insertId, ...expense };
  },

  update: async (id, expense) => {
    const connection = await pool;
    const { project_id, description, amount, date } = expense;
    const [result] = await connection.query(
      'UPDATE expenses SET project_id = ?, description = ?, amount = ?, date = ? WHERE id = ?',
      [project_id, description, amount, date, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const connection = await pool;
    const [result] = await connection.query('DELETE FROM expenses WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  getExpensesByDateRange: async (startDate, endDate) => {
    const connection = await pool;
    const [rows] = await connection.query('SELECT * FROM expenses WHERE date BETWEEN ? AND ?', [startDate, endDate]);
    return rows;
  },

  getTotalExpensesByProject: async () => {
    const connection = await pool;
    const [rows] = await connection.query('SELECT project_id, SUM(amount) as total FROM expenses GROUP BY project_id');
    return rows;
  }
};

module.exports = Expense;