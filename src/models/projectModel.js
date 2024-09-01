const pool = require('../config/database');

const Project = {
  getAll: async () => {
    const connection = await pool;
    const [rows] = await connection.query('SELECT * FROM projects');
    return rows;
  },

  getById: async (id) => {
    const connection = await pool;
    const [rows] = await connection.query('SELECT * FROM projects WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (project) => {
    const connection = await pool;
    const { name, client, budget, startDate, endDate, status } = project;
    const [result] = await connection.query(
      'INSERT INTO projects (name, client, budget, startDate, endDate, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, client, budget, startDate, endDate, status]
    );
    return { id: result.insertId, ...project };
  },

  update: async (id, project) => {
    const connection = await pool;
    const { name, client, budget, startDate, endDate, status } = project;
    const [result] = await connection.query(
      'UPDATE projects SET name = ?, client = ?, budget = ?, startDate = ?, endDate = ?, status = ? WHERE id = ?',
      [name, client, budget, startDate, endDate, status, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const connection = await pool;
    const [result] = await connection.query('DELETE FROM projects WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  getProjectExpenses: async (id) => {
    const connection = await pool;
    const [rows] = await connection.query('SELECT * FROM expenses WHERE project_id = ?', [id]);
    return rows;
  },

  getTotalExpenses: async (id) => {
    const connection = await pool;
    const [rows] = await connection.query('SELECT SUM(amount) as total FROM expenses WHERE project_id = ?', [id]);
    return rows[0].total;
  }
};

module.exports = Project;