const db = require('../config/database');

const Expense = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM expenses');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM expenses WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (expense) => {
    const { project_id, description, amount, date } = expense;
    const [result] = await db.query(
      'INSERT INTO expenses (project_id, description, amount, date) VALUES (?, ?, ?, ?)',
      [project_id, description, amount, date]
    );
    return { id: result.insertId, ...expense };
  },

  update: async (id, expense) => {
    const { project_id, description, amount, date } = expense;
    const [result] = await db.query(
      'UPDATE expenses SET project_id = ?, description = ?, amount = ?, date = ? WHERE id = ?',
      [project_id, description, amount, date, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM expenses WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  getExpensesByDateRange: async (startDate, endDate) => {
    const [rows] = await db.query('SELECT * FROM expenses WHERE date BETWEEN ? AND ?', [startDate, endDate]);
    return rows;
  },

  getTotalExpensesByProject: async () => {
    const [rows] = await db.query('SELECT project_id, SUM(amount) as total FROM expenses GROUP BY project_id');
    return rows;
  }
};

module.exports = Expense;