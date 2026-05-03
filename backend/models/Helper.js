const mongoose = require('mongoose');

const VouchSchema = new mongoose.Schema({
  houseNo: { type: String, required: true },
  wing: { type: String, required: true },
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const HelperSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Cook', 'Maid', 'Plumber', 'Electrician', 'Driver', 'Carpenter', 'Security', 'Other'],
    },
    contact: { type: String, required: true },
    status: { type: String, enum: ['Available', 'Busy', 'Unavailable'], default: 'Available' },
    vouchedBy: [VouchSchema],
    tags: [{ type: String }],          // e.g. ["Punctual","Great with Kids","Owns Toolbox"]
    verifiedByAdmin: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5, default: 4.0 },
    experience: { type: String, default: '' },  // e.g. "5 years"
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Helper', HelperSchema);
