const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    houseNo: { type: String, required: true, trim: true },   // e.g. "201"
    wing: { type: String, required: true, trim: true },      // e.g. "A"
    role: { type: String, enum: ['resident', 'admin'], default: 'resident' },
    isVerified: { type: Boolean, default: false },           // admin must approve
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
