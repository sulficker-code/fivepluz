const express = require('express');
const router = express.Router();
const Role = require('../models/Roles');

// GET all roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.getRoles();
    res.json(roles); // returns an array
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
