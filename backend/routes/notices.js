const express = require('express');
const Notice = require('../models/Notice');
const { verifyToken, isAdmin, isVerified } = require('../middleware/auth');

const router = express.Router();

// GET /api/notices  — public, excludes expired
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find({ expiresAt: { $gt: new Date() } })
      .populate('createdBy', 'name wing houseNo')
      .sort({ isPinned: -1, createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/notices  — admin only
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, content, priority, expiresAt, isPinned } = req.body;
    const notice = await Notice.create({
      title, content, priority, expiresAt, isPinned,
      createdBy: req.user._id,
    });
    res.status(201).json(notice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/notices/:id — admin only
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
