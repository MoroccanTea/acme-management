// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { isAuth, isAdmin } = require('../middlewares/auth');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    users.forEach(user => delete user.password);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const user = await User.findByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    delete user.password;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, isAdmin } = req.body;
    const updated = await User.update(req.params.id, { name, email, isAdmin });
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const userId = await User.create({ name, email, password, isAdmin });
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

router.get('/profile', isAuth, (req, res) => {
  res.json({ user: req.user });
});

router.get('/admin', isAuth, isAdmin, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

module.exports = router;