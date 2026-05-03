const express = require('express');
const Helper = require('../models/Helper');
const { verifyToken, isAdmin, isVerified } = require('../middleware/auth');

const router = express.Router();

// GET /api/helpers  — public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { verifiedByAdmin: true };
    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    const helpers = await Helper.find(query).sort({ rating: -1 });
    res.json(helpers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/helpers  — admin only
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, category, contact, status, tags, experience, rating } = req.body;
    const helper = await Helper.create({
      name, category, contact, status, tags, experience, rating,
      verifiedByAdmin: true,
      createdBy: req.user._id,
    });
    res.status(201).json(helper);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/helpers/:id/vouch  — verified resident
router.post('/:id/vouch', verifyToken, isVerified, async (req, res) => {
  try {
    const helper = await Helper.findById(req.params.id);
    if (!helper) return res.status(404).json({ message: 'Helper not found.' });

    const alreadyVouched = helper.vouchedBy.some(
      (v) => v.userId?.toString() === req.user._id.toString()
    );
    if (alreadyVouched) {
      return res.status(400).json({ message: 'You have already vouched for this helper.' });
    }

    helper.vouchedBy.push({
      houseNo: req.user.houseNo,
      wing: req.user.wing,
      name: req.user.name,
      userId: req.user._id,
    });
    await helper.save();
    res.json({ message: 'Vouched successfully!', helper });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/helpers/:id  — admin only
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Helper.findByIdAndDelete(req.params.id);
    res.json({ message: 'Helper removed.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
