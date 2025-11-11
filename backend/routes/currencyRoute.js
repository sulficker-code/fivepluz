const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Currency = require('../models/Currency');


// Get all currencies
router.get('/', auth, async (req, res) => {
  try {
    const currencies = await Currency.getAll();
    res.json(currencies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Add new currency
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const currency = req.body;
    const newCurrency = await Currency.addCurrency(currency, userId);
    res.json(newCurrency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding currency" });
  }
});

// Update currency
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const updated = await Currency.updateCurrency(req.params.id, req.body, userId);
    res.json({ message: 'Currency updated', updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating currency" });
  }
});

// Set default currency
router.put('/:id/default', auth, async (req, res) => {
  try {
    await Currency.setDefault(req.params.id);
    res.json({ message: "Default currency updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error setting default currency" });
  }
});


// Delete currency
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const deleted = await Currency.deleteCurrency(req.params.id, userId);
    if (!deleted) {
      return res.status(404).json({ message: "Currency not found" });
    }
    res.json({ message: 'Currency deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting currency" });
  }
});


module.exports = router;
