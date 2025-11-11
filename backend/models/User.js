// backend/models/User.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');


const User = {
  // Get all users
  getUsers: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM users');
      return rows;
    } catch (err) {
      throw err;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (err) {
      throw err;
    }
  },

getUserByEmail: async (email) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0]; 
  } catch (err) {
    throw err;
  }
},

  // Add a new user
  addUser: async (user) => {
    try {
      const { name, email, role_id, password,status } = user;
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role_id, status) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role_id, status]
      );
      return { id: result.insertId, name, email, role_id, status };
    } catch (err) {
      throw err;
    }
  },

  // delete user
  deleteUser: async (id) => {
    try {
      await db.query('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = User;
