const express = require('express');
const Expense = require('../models/expenseModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.getAll();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.getById(req.params.id);
    if (expense) {
      res.json(expense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const success = await Expense.update(req.params.id, req.body);
    if (success) {
      res.json({ message: 'Expense updated successfully' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await Expense.delete(req.params.id);
    if (success) {
      res.json({ message: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/by-date-range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const expenses = await Expense.getExpensesByDateRange(startDate, endDate);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/total-by-project', async (req, res) => {
  try {
    const totals = await Expense.getTotalExpensesByProject();
    res.json(totals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;