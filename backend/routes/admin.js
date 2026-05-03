const express = require('express');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/pending  — list unverified residents
router.get('/pending', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ isVerified: false, role: 'resident' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/residents  — all verified residents
router.get('/residents', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ isVerified: true, role: 'resident' })
      .select('-password')
      .sort({ wing: 1, houseNo: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/verify/:id  — approve a resident
router.patch('/verify/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: `${user.name} has been verified!`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/reject/:id  — remove a pending user
router.delete('/reject/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User rejected and removed.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
