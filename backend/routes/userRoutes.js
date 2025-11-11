const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const db = require("../config/db");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const auth = require('../middleware/auth');

// Add user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role_id, status } = req.body;

    // Hash password
    //const salt = await bcrypt.genSalt(10);
    //const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.addUser({
      name,
      email,
      password,
      role_id,
      status,
    });

    res.status(200).json({ message: 'User added successfully', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding user' });
  }
});

// Get all users
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.getUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Login route
router.post("/login", async (req, res) => {
 // console.log("Incoming login body:", req.body);
  try {
    const { email, password } = req.body;
    // validate
    if (!email || !password) return res.status(400).json({ message: "Email & password required" });

    const user = await User.getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

     // sign JWT (only include non-sensitive info)
     const payload = { id: user.id, email: user.email, role_id: user.role_id };
     const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
     // message: "Login successful",
      //user: { id: user.id, name: user.name, email: user.email },
      message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, role_id: user.role_id } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, role_id, status, password } = req.body;

  try {
    const [existingRows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let hashedPassword = existingRows[0].password; 
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await db.query(
      "UPDATE users SET name=?, email=?, role_id=?, status=?, password=? WHERE id=?",
      [name, email, role_id, status, hashedPassword, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Update failed" });
    }

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]); 
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Test route
router.get("/test", (req, res) => {
  res.send("User routes working!");
});

module.exports = router;
