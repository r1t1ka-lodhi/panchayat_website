const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, houseNo, wing } = req.body;
    if (!name || !email || !password || !houseNo || !wing) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered.' });

    const user = await User.create({ name, email, password, houseNo, wing });
    res.status(201).json({
      message: 'Registration successful! Awaiting admin approval.',
      user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = signToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        houseNo: user.houseNo,
        wing: user.wing,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
