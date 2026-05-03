const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    priority: {
      type: String,
      enum: ['Emergency', 'Event', 'General'],
      default: 'General',
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for auto-expiry queries
NoticeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notice', NoticeSchema);
