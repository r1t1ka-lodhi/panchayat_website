require('dotenv').config();
const mongoose = require('mongoose');
const seed = require('./seed');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected for reset');

    console.log('🗑️ Dropping database...');
    await mongoose.connection.db.dropDatabase();

    console.log('🌱 Starting seed...');
    await seed();

    console.log('🎉 Database successfully dropped and seeded!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
