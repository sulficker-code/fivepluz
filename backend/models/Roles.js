// backend/models/Roles.js
const db = require('../config/db'); // mysql2 promise pool

const Role = {
  // Get all roles
  getRoles: async () => {
    try {
      const [results] = await db.query('SELECT * FROM roles');
      return results;
    } catch (err) {
      throw err;
    }
  },

  // Get role by id
  getRoleById: async (id) => {
    try {
      const [results] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
      return results[0];
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Role;
