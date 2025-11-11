const db = require('../config/db');

const Currency = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT c.*, u.name as updated_by_name 
      FROM currencies c
      LEFT JOIN users u ON c.updated_by = u.id
      ORDER BY c.id DESC
    `);
    return rows;
  },

  addCurrency: async (currency, userId) => {
    const { currency_code, currency_name, conversion_rate } = currency;
    const [result] = await db.query(
      `INSERT INTO currencies (currency_code, currency_name, conversion_rate, updated_by) 
       VALUES (?, ?, ?, ?)`,
      [currency_code, currency_name, conversion_rate, userId]
    );
    return { id: result.insertId, currency_code, currency_name, conversion_rate, updated_by: userId };
  },

  updateCurrency: async (id, data, userId) => {
    const { currency_name, conversion_rate } = data;
    const [result] = await db.query(
      `UPDATE currencies SET currency_name=?, conversion_rate=?, updated_by=? WHERE id=?`,
      [currency_name, conversion_rate, userId, id]
    );
    return result;
  },

  setDefault: async (id) => {
    await db.query(`UPDATE currencies SET is_default = 0`);
    const [result] = await db.query(`UPDATE currencies SET is_default = 1 WHERE id=?`, [id]);
    return result;
  },

   deleteCurrency: async (id) => {
    const [result] = await db.query(`DELETE FROM currencies WHERE id=?`, [id]);
    return result.affectedRows > 0; // true if deleted, false if not found
  },
};

module.exports = Currency;
