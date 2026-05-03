require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ─── Middleware ────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/helpers', require('./routes/helpers'));
app.use('/api/admin',   require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// ─── DB Connect + Server Start ─────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    // Auto-seed on first run
    await require('./seed')();
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
