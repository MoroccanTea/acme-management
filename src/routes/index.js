const express = require('express');

const router = express.Router();

const api_version = process.env.API_VERSION;

router.get('/', async (req, res) => {
  try {
    res.json({ message: `Welcome to the ACME API ${api_version}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;